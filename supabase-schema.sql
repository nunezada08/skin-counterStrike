-- SkinsCS — Schema Supabase
-- Execute no SQL Editor do painel do Supabase

-- Tabela de skins
create table if not exists skins (
  id          bigserial primary key,
  name        text        not null,
  category    text        not null,
  rarity      text        not null,
  price       numeric     not null default 0,
  wear        text,
  float       numeric,
  image       text,
  rating      numeric     default 0,
  reviews_count integer   default 0,
  created_at  timestamptz default now()
);

-- Tabela de avaliações
create table if not exists reviews (
  id          bigserial primary key,
  skin_id     bigint references skins(id) on delete cascade,
  player_name text not null,
  rating      smallint check (rating between 1 and 5),
  comment     text,
  created_at  timestamptz default now()
);

-- Índices
create index if not exists skins_rarity_idx    on skins(rarity);
create index if not exists skins_category_idx  on skins(category);
create index if not exists reviews_skin_id_idx on reviews(skin_id);

-- RLS (Row Level Security) — permite leitura pública, inserção autenticada
alter table skins   enable row level security;
alter table reviews enable row level security;
alter table ideias  enable row level security;

create policy "Skins são públicas"    on skins   for select using (true);
create policy "Reviews são públicas"  on reviews for select using (true);
create policy "Qualquer um pode avaliar" on reviews for insert with check (true);
create policy "Ideias são públicas"   on ideias  for select using (true);
create policy "Qualquer um pode criar ideia" on ideias for insert with check (true);
