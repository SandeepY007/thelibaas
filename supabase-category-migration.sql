-- Run once on an existing Maison Muse database before using custom categories.
-- This migration leaves all existing products and IDs unchanged.
alter table public.products drop constraint if exists products_category_check;

create table if not exists public.categories (
  name text primary key check (char_length(trim(name)) between 1 and 60)
);

insert into public.categories (name)
select distinct category from public.products where trim(category) <> ''
on conflict (name) do nothing;

insert into public.categories (name) values ('Beauty'), ('Fashion'), ('Jewellery')
on conflict (name) do nothing;
