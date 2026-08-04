begin;

alter table public.ship_overlay
  add column assignment_group text,
  add column assignment_location text;

alter table public.ship_overlay
  add constraint ship_overlay_assignment_pair_valid check (coalesce((
    (assignment_group is null and assignment_location is null) or
    (assignment_group = 'ทรภ.1' and assignment_location in ('กปก.', 'มชด.')) or
    (assignment_group = 'ทรภ.2' and assignment_location in ('สน.เรือสมุย', 'ฐท.สข.')) or
    (assignment_group = 'ทรภ.3' and assignment_location in ('ระนอง', 'ฐท.พง.', 'ภูเก็ต')) or
    (assignment_group = 'มรภ.ฐท.สส.' and assignment_location is null) or
    (assignment_group = 'พร้อมที่ตั้งปกติ' and assignment_location = 'ทลท.กทส.ฐท.สส.') or
    (assignment_group = 'ซ่อมทำ' and assignment_location in ('กรง.ฐท.สส.', 'อจปร.'))
  ), false));

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
    'assignment_location'
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
    'mission_limitations', 'updated_at', 'assignment_group',
    'assignment_location'
  ];
  supplied_field text;
  next_group text;
  next_location text;
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

  insert into public.ship_overlay (
    ship_id, crew, propulsion, radar, communication, navigation, weapon,
    rhib, eoir, major_deficiencies, mission_limitations, updated_at,
    assignment_group, assignment_location, updated_by, saved_at
  ) values (
    p_ship_id,
    case when p_patch ? 'crew' then (p_patch ->> 'crew')::integer else null end,
    p_patch ->> 'propulsion', p_patch ->> 'radar',
    p_patch ->> 'communication', p_patch ->> 'navigation',
    p_patch ->> 'weapon', p_patch ->> 'rhib', p_patch ->> 'eoir',
    coalesce(p_patch ->> 'major_deficiencies', ''),
    coalesce(p_patch ->> 'mission_limitations', ''),
    p_patch ->> 'updated_at', next_group, next_location,
    (select auth.uid()), now()
  )
  on conflict (ship_id) do update set
    crew = case when p_patch ? 'crew' then (p_patch ->> 'crew')::integer else ship_overlay.crew end,
    propulsion = case when p_patch ? 'propulsion' then p_patch ->> 'propulsion' else ship_overlay.propulsion end,
    radar = case when p_patch ? 'radar' then p_patch ->> 'radar' else ship_overlay.radar end,
    communication = case when p_patch ? 'communication' then p_patch ->> 'communication' else ship_overlay.communication end,
    navigation = case when p_patch ? 'navigation' then p_patch ->> 'navigation' else ship_overlay.navigation end,
    weapon = case when p_patch ? 'weapon' then p_patch ->> 'weapon' else ship_overlay.weapon end,
    rhib = case when p_patch ? 'rhib' then p_patch ->> 'rhib' else ship_overlay.rhib end,
    eoir = case when p_patch ? 'eoir' then p_patch ->> 'eoir' else ship_overlay.eoir end,
    major_deficiencies = case when p_patch ? 'major_deficiencies' then coalesce(p_patch ->> 'major_deficiencies', '') else ship_overlay.major_deficiencies end,
    mission_limitations = case when p_patch ? 'mission_limitations' then coalesce(p_patch ->> 'mission_limitations', '') else ship_overlay.mission_limitations end,
    updated_at = case when p_patch ? 'updated_at' then p_patch ->> 'updated_at' else ship_overlay.updated_at end,
    assignment_group = next_group,
    assignment_location = next_location,
    updated_by = (select auth.uid()), saved_at = now();
end;
$$;

revoke all on function public.patch_ship_overlay(text, jsonb) from public;
grant execute on function public.patch_ship_overlay(text, jsonb) to authenticated;

commit;
