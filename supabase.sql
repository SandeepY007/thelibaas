-- Run this once in the Supabase SQL editor before deploying.
create table if not exists public.products (
  id bigint primary key,
  name text not null,
  category text not null,
  price numeric(10, 2) not null check (price >= 0),
  "oldPrice" numeric(10, 2),
  tag text,
  rating numeric(2, 1) not null default 5,
  reviews integer not null default 0,
  image text not null,
  description text not null default ''
);

-- Allow products to use categories added in the shop editor.
alter table public.products drop constraint if exists products_category_check;

create table if not exists public.categories (
  name text primary key check (char_length(trim(name)) between 1 and 60)
);

insert into public.categories (name) values ('Beauty'), ('Fashion'), ('Jewellery')
on conflict (name) do nothing;

insert into public.categories (name)
select distinct category from public.products where trim(category) <> ''
on conflict (name) do nothing;

insert into public.products (id, name, category, price, "oldPrice", tag, rating, reviews, image, description) values
(1, 'The Everyday Glow Serum', 'Beauty', 34, 42, 'BESTSELLER', 4.9, 128, 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85', 'A lightweight, vitamin-rich serum for a fresh, dewy glow. Made for everyday skin, with hyaluronic acid and niacinamide.'),
(2, 'Sunday Morning Knit', 'Fashion', 68, null, 'JUST IN', 4.8, 64, 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=85', 'Your softest layer yet. An easy, relaxed knit in a lovely neutral tone that goes with absolutely everything.'),
(3, 'Solstice Gold Hoops', 'Jewellery', 46, null, null, 5.0, 93, 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=85', 'A little golden something for every day. Lightweight, water-resistant hoops finished in warm 18k gold vermeil.'),
(4, 'Soft Focus Lip Tint', 'Beauty', 24, null, 'STAFF PICK', 4.9, 81, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=800&q=85', 'Your lips, just a little more lovely. A comfortable, buildable tint with a soft satin finish.'),
(5, 'The Weekend Tote', 'Fashion', 72, null, null, 4.7, 42, 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&w=800&q=85', 'Room for the little things and the lovely things. Our everyday carry-all, made from soft, durable cotton canvas.'),
(6, 'Daisy Chain Necklace', 'Jewellery', 58, null, 'LOVED', 4.9, 76, 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=800&q=85', 'A delicate chain that catches the light just right. Layer it or let it shine on its own.'),
(7, 'Cloud Nine Hand Cream', 'Beauty', 18, null, null, 4.8, 55, 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=85', 'A pocket-sized moment of softness. Fast-absorbing hand cream with a gentle, clean scent.'),
(8, 'Sunday Market Shirt', 'Fashion', 64, null, 'NEW COLOUR', 4.8, 37, 'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?auto=format&fit=crop&w=800&q=85', 'An easy button-up for slower mornings and long lunches. Cut in a breathable, beautifully soft cotton.'),
(9, 'Tiny Treasures Studs', 'Jewellery', 32, null, null, 4.9, 61, 'https://images.unsplash.com/photo-1635767798638-3665a6b4e7b0?auto=format&fit=crop&w=800&q=85', 'Small, special, and made to stay in your rotation. Thoughtful little studs with a polished gold finish.')
on conflict (id) do nothing;
