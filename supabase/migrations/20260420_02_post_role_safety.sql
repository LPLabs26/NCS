create or replace function public.enforce_scheduler_post_role_safety()
returns trigger
language plpgsql
as $$
declare
  scheduler_role text := coalesce(public.current_scheduler_role(), '');
  auth_role text := coalesce(auth.role(), '');
begin
  -- Service-role writes come from trusted server code. App-level role checks still gate
  -- owner approval, scheduling, price verification, and publish operations before save.
  if auth_role = 'service_role' then
    return new;
  end if;

  if scheduler_role in ('editor', 'viewer') then
    if coalesce(new.owner_approved, false) then
      raise exception 'Only owner/admin can set owner_approved=true on posts.'
        using errcode = '42501';
    end if;

    if coalesce(new.price_verified, false) then
      raise exception 'Only owner/admin can set price_verified=true on posts.'
        using errcode = '42501';
    end if;

    if new.status in ('approved', 'scheduled', 'publishing', 'published') then
      raise exception 'Only owner/admin can move posts into publish-sensitive statuses.'
        using errcode = '42501';
    end if;
  end if;

  return new;
end;
$$;

comment on function public.enforce_scheduler_post_role_safety() is
  'Blocks authenticated editor/viewer clients from setting publish-sensitive post fields. Service-role writes remain allowed for trusted server flows.';

drop trigger if exists posts_enforce_scheduler_role_safety on public.posts;

create trigger posts_enforce_scheduler_role_safety
before insert or update on public.posts
for each row
execute function public.enforce_scheduler_post_role_safety();

