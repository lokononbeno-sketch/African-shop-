-- AFRICAN SHOP — espace administrateur (à exécuter UNE fois dans Supabase > SQL Editor)
-- 1) Remplace TON_EMAIL ci-dessous par l'e-mail avec lequel tu te connectes sur African Shop.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.admins enable row level security;

-- Chaque utilisateur ne peut lire que sa propre ligne (personne ne peut écrire depuis le site).
drop policy if exists "admins_lire_soi" on public.admins;
create policy "admins_lire_soi" on public.admins for select to authenticated using (user_id = auth.uid());

create or replace function public.is_admin() returns boolean
language sql security definer set search_path = public stable
as $$ select exists (select 1 from public.admins where user_id = auth.uid()) $$;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Droits supplémentaires réservés à l'administrateur
drop policy if exists "admin_shops_tout" on public.shops;
create policy "admin_shops_tout" on public.shops for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_products_tout" on public.products;
create policy "admin_products_tout" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());
drop policy if exists "admin_orders_lire" on public.orders;
create policy "admin_orders_lire" on public.orders for select to authenticated using (public.is_admin());

-- 2) Te déclarer administrateur (remplace l'e-mail, puis exécute)
insert into public.admins (user_id)
select id from auth.users where lower(email) = lower('TON_EMAIL')
on conflict do nothing;
