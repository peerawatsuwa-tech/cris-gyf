begin;

alter table public.ship_overlay
  drop constraint if exists ship_overlay_assignment_pair_valid;

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

create or replace function public.validate_ship_overlay_assignment()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not coalesce((
    (new.assignment_group is null and new.assignment_location is null) or
    (new.assignment_group = 'ทรภ.1' and new.assignment_location in ('กปก.', 'มชด.')) or
    (new.assignment_group = 'ทรภ.2' and new.assignment_location in ('สน.เรือสมุย', 'ฐท.สข.')) or
    (new.assignment_group = 'ทรภ.3' and new.assignment_location in ('ระนอง', 'ฐท.พง.', 'ภูเก็ต')) or
    (new.assignment_group = 'มรภ.ฐท.สส.' and new.assignment_location is null) or
    (new.assignment_group = 'พร้อมที่ตั้งปกติ' and new.assignment_location = 'ทลท.กทส.ฐท.สส.') or
    (new.assignment_group = 'ซ่อมทำ' and new.assignment_location in ('กรง.ฐท.สส.', 'อจปร.'))
  ), false) then
    raise exception 'invalid operational assignment pair' using errcode = '22023';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_ship_overlay_assignment on public.ship_overlay;
create trigger validate_ship_overlay_assignment
before insert or update of assignment_group, assignment_location on public.ship_overlay
for each row execute function public.validate_ship_overlay_assignment();

commit;
