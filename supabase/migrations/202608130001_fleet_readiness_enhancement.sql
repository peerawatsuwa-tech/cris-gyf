begin;

alter table public.ship_overlay
  add column personnel_officers integer check (personnel_officers >= 0),
  add column personnel_senior_ncos integer check (personnel_senior_ncos >= 0),
  add column personnel_petty_officers integer check (personnel_petty_officers >= 0),
  add column personnel_conscripts integer check (personnel_conscripts >= 0),
  add column equipment_details jsonb not null default '{}'::jsonb;

-- User-entered dates are intentionally replaced by the trusted timestamp of the
-- last database save. Every future write is stamped by NOW() in the RPC below.
alter table public.ship_overlay
  alter column updated_at type timestamptz using saved_at,
  alter column updated_at set default now(),
  alter column updated_at set not null;

alter table public.ship_overlay
  add constraint ship_overlay_personnel_complete check (
    (personnel_officers is null and personnel_senior_ncos is null and personnel_petty_officers is null and personnel_conscripts is null)
    or
    (personnel_officers is not null and personnel_senior_ncos is not null and personnel_petty_officers is not null and personnel_conscripts is not null)
  ),
  add constraint ship_overlay_equipment_details_object check (jsonb_typeof(equipment_details) = 'object');

create or replace function public.audit_ship_overlay_changes()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  field_name text;
  old_record jsonb := case when tg_op = 'INSERT' then '{}'::jsonb else to_jsonb(old) end;
  new_record jsonb := to_jsonb(new);
  audited_fields constant text[] := array[
    'crew', 'propulsion', 'radar', 'communication', 'navigation',
    'weapon', 'rhib', 'eoir', 'major_deficiencies',
    'mission_limitations', 'updated_at', 'assignment_group',
    'assignment_location', 'personnel_officers', 'personnel_senior_ncos',
    'personnel_petty_officers', 'personnel_conscripts', 'equipment_details'
  ];
begin
  foreach field_name in array audited_fields loop
    if (old_record -> field_name) is distinct from (new_record -> field_name) then
      insert into public.audit_logs(user_id, ship_id, field, old_value, new_value)
      values ((select auth.uid()), new.ship_id, field_name, old_record -> field_name, new_record -> field_name);
    end if;
  end loop;
  return new;
end;
$$;

create or replace function public.patch_ship_overlay(p_ship_id text, p_patch jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  caller_role public.cris_role := public.current_cris_role();
  permitted_fields constant text[] := array[
    'crew', 'propulsion', 'radar', 'communication', 'navigation',
    'weapon', 'rhib', 'eoir', 'major_deficiencies',
    'mission_limitations', 'assignment_group', 'assignment_location',
    'personnel', 'equipment_details'
  ];
  allowed_equipment_keys constant text[] := array[
    'weapon:ปืนหัว', 'weapon:ปืนท้าย', 'weapon:เครื่องควบคุมการยิง', 'weapon:ปืนกราบซ้าย', 'weapon:ปืนกราบขวา',
    'hull:ระบบหางเสือ', 'hull:เข็มทิศไยโร', 'hull:เข็มทิศแม่เหล็ก',
    'propulsion:เครื่องจักรใหญ่', 'propulsion:เครื่องขับเครื่องกำเนิดไฟฟ้า', 'propulsion:เครื่องกำเนิดไฟฟ้า',
    'auxiliary:เครื่องปรับอากาศ', 'auxiliary:เครื่องทำความเย็น', 'auxiliary:เครื่องอัดลม', 'auxiliary:เครื่องสูบน้ำเคลื่อนที่', 'auxiliary:ไฟร์เมน', 'auxiliary:กว้านสมอ',
    'radar:เรดาร์ FURUNO ชุดที่ 1', 'radar:เรดาร์ FURUNO ชุดที่ 2', 'radar:เรดาร์ SPERRY',
    'communication:HF/CB', 'communication:VLF-HF', 'communication:HF/SSB', 'communication:VHF/FM', 'communication:VHF DSC', 'communication:VHF-UHF', 'communication:EPIRB', 'communication:SART', 'communication:COLLINS',
    'radio:VLF HF', 'radio:VHF/UHF', 'radio:HF/SSB (0.5-1 KW)', 'radio:HF/SSB (100-150 W)', 'radio:HF/SSB HOPPING', 'radio:HF/CB', 'radio:VHF/FM Lowband', 'radio:VHF/FM Lowband Manpack', 'radio:VHF/FM Highband Mobile', 'radio:VHF/FM Highband H/T', 'radio:UHF AM/FM'
  ];
  supplied_field text;
  equipment_key text;
  equipment_status text;
  next_group text;
  next_location text;
  next_officers integer;
  next_senior_ncos integer;
  next_petty_officers integer;
  next_conscripts integer;
  next_crew integer;
begin
  if caller_role is null then
    raise exception 'inactive or missing CRIS profile' using errcode = '42501';
  end if;
  if caller_role = 'commander' then
    raise exception 'commander role is read only' using errcode = '42501';
  end if;
  if caller_role = 'ship' and not public.is_demo_ship_user()
     and p_ship_id <> public.current_cris_ship_id() then
    raise exception 'ship isolation violation' using errcode = '42501';
  end if;
  if not exists (select 1 from public.ships where id = p_ship_id) then
    raise exception 'unknown ship' using errcode = '22023';
  end if;
  for supplied_field in select jsonb_object_keys(p_patch) loop
    if not (supplied_field = any(permitted_fields)) then
      raise exception 'field % is not editable', supplied_field using errcode = '22023';
    end if;
  end loop;

  select
    case when p_patch ? 'assignment_group' then p_patch ->> 'assignment_group' else assignment_group end,
    case when p_patch ? 'assignment_location' then p_patch ->> 'assignment_location' else assignment_location end
  into next_group, next_location
  from public.ship_overlay where ship_id = p_ship_id;

  if next_group is not null and not (
    (next_group = 'ทรภ.1' and next_location in ('กปก.', 'มชด.')) or
    (next_group = 'ทรภ.2' and next_location in ('สน.เรือสมุย', 'ฐท.สข.')) or
    (next_group = 'ทรภ.3' and next_location in ('ระนอง', 'ฐท.พง.', 'ภูเก็ต')) or
    (next_group = 'มรภ.ฐท.สส.' and next_location is null) or
    (next_group = 'พร้อมที่ตั้งปกติ' and next_location = 'ทลท.กทส.ฐท.สส.') or
    (next_group = 'ซ่อมทำ' and next_location in ('กรง.ฐท.สส.', 'อจปร.'))
  ) then
    raise exception 'invalid operational assignment pair' using errcode = '22023';
  end if;
  if next_group is null and next_location is not null then
    raise exception 'assignment location requires assignment group' using errcode = '22023';
  end if;

  if p_patch ? 'equipment_details' then
    if jsonb_typeof(p_patch -> 'equipment_details') <> 'object' then
      raise exception 'equipment_details must be an object' using errcode = '22023';
    end if;
    for equipment_key, equipment_status in
      select key, value #>> '{}' from jsonb_each(p_patch -> 'equipment_details')
    loop
      if not (equipment_key = any(allowed_equipment_keys)) then
        raise exception 'unsupported equipment item %', equipment_key using errcode = '22023';
      end if;
      if equipment_status is not null and equipment_status not in ('Operational', 'Limited', 'Not Ready', 'Not Installed') then
        raise exception 'invalid equipment status for %', equipment_key using errcode = '22023';
      end if;
    end loop;
  end if;

  if p_patch ? 'personnel' then
    if jsonb_typeof(p_patch -> 'personnel') <> 'object' then
      raise exception 'personnel must be an object' using errcode = '22023';
    end if;
    next_officers := (p_patch #>> '{personnel,officers}')::integer;
    next_senior_ncos := (p_patch #>> '{personnel,seniorNcos}')::integer;
    next_petty_officers := (p_patch #>> '{personnel,pettyOfficers}')::integer;
    next_conscripts := (p_patch #>> '{personnel,conscripts}')::integer;
    if (next_officers is null and next_senior_ncos is null and next_petty_officers is null and next_conscripts is null) then
      next_crew := null;
    elsif next_officers is null or next_senior_ncos is null or next_petty_officers is null or next_conscripts is null
       or least(next_officers, next_senior_ncos, next_petty_officers, next_conscripts) < 0 then
      raise exception 'personnel requires four non-negative values or four null values' using errcode = '22023';
    else
      next_crew := next_officers + next_senior_ncos + next_petty_officers + next_conscripts;
    end if;
  end if;

  update public.ship_overlay set
    crew = case when p_patch ? 'personnel' then next_crew when p_patch ? 'crew' then (p_patch ->> 'crew')::integer else crew end,
    propulsion = case when p_patch ? 'propulsion' then p_patch ->> 'propulsion' else propulsion end,
    radar = case when p_patch ? 'radar' then p_patch ->> 'radar' else radar end,
    communication = case when p_patch ? 'communication' then p_patch ->> 'communication' else communication end,
    navigation = case when p_patch ? 'navigation' then p_patch ->> 'navigation' else navigation end,
    weapon = case when p_patch ? 'weapon' then p_patch ->> 'weapon' else weapon end,
    rhib = case when p_patch ? 'rhib' then p_patch ->> 'rhib' else rhib end,
    eoir = case when p_patch ? 'eoir' then p_patch ->> 'eoir' else eoir end,
    major_deficiencies = case when p_patch ? 'major_deficiencies' then coalesce(p_patch ->> 'major_deficiencies', '') else major_deficiencies end,
    mission_limitations = case when p_patch ? 'mission_limitations' then coalesce(p_patch ->> 'mission_limitations', '') else mission_limitations end,
    assignment_group = next_group,
    assignment_location = next_location,
    personnel_officers = case when p_patch ? 'personnel' then next_officers else personnel_officers end,
    personnel_senior_ncos = case when p_patch ? 'personnel' then next_senior_ncos else personnel_senior_ncos end,
    personnel_petty_officers = case when p_patch ? 'personnel' then next_petty_officers else personnel_petty_officers end,
    personnel_conscripts = case when p_patch ? 'personnel' then next_conscripts else personnel_conscripts end,
    equipment_details = case when p_patch ? 'equipment_details' then p_patch -> 'equipment_details' else equipment_details end,
    updated_at = now(),
    updated_by = (select auth.uid()),
    saved_at = now()
  where ship_id = p_ship_id;

  if not found then
    raise exception 'ship overlay missing' using errcode = '22023';
  end if;
end;
$$;

revoke all on function public.patch_ship_overlay(text, jsonb) from public;
grant execute on function public.patch_ship_overlay(text, jsonb) to authenticated;

commit;
