begin;

alter table public.users drop constraint ship_role_requires_ship;
alter table public.users add constraint ship_role_requires_ship check (
  (role = 'ship' and (ship_id is not null or email = 'ship@cris.local')) or
  (role <> 'ship' and ship_id is null)
);

create or replace function public.is_demo_ship_user()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.users
    where id = (select auth.uid())
      and active = true
      and role = 'ship'
      and email = 'ship@cris.local'
      and ship_id is null
  );
$$;

revoke all on function public.is_demo_ship_user() from public;
grant execute on function public.is_demo_ship_user() to authenticated;

drop policy ships_select_by_role on public.ships;
create policy ships_select_by_role on public.ships for select to authenticated
using (
  public.current_cris_role() in ('admin', 'commander') or
  (public.current_cris_role() = 'ship' and
    (public.is_demo_ship_user() or id = public.current_cris_ship_id()))
);

drop policy overlays_select_by_role on public.ship_overlay;
create policy overlays_select_by_role on public.ship_overlay for select to authenticated
using (
  public.current_cris_role() in ('admin', 'commander') or
  (public.current_cris_role() = 'ship' and
    (public.is_demo_ship_user() or ship_id = public.current_cris_ship_id()))
);

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
    'mission_limitations', 'updated_at'
  ];
  supplied_field text;
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

  insert into public.ship_overlay (
    ship_id, crew, propulsion, radar, communication, navigation, weapon,
    rhib, eoir, major_deficiencies, mission_limitations, updated_at,
    updated_by, saved_at
  ) values (
    p_ship_id,
    case when p_patch ? 'crew' then (p_patch ->> 'crew')::integer else null end,
    p_patch ->> 'propulsion', p_patch ->> 'radar',
    p_patch ->> 'communication', p_patch ->> 'navigation',
    p_patch ->> 'weapon', p_patch ->> 'rhib', p_patch ->> 'eoir',
    coalesce(p_patch ->> 'major_deficiencies', ''),
    coalesce(p_patch ->> 'mission_limitations', ''),
    p_patch ->> 'updated_at', (select auth.uid()), now()
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
    updated_by = (select auth.uid()), saved_at = now();
end;
$$;

revoke all on function public.patch_ship_overlay(text, jsonb) from public;
grant execute on function public.patch_ship_overlay(text, jsonb) to authenticated;

commit;
