-- =====================================================================
-- Ders Ormanı – Supabase (PostgreSQL) şeması ve erişim kuralları (v2: birleşik site)
-- İlkeler: çocuğun kendi hesabı yok (ebeveyn oturumu); en az veri (takma ad + sınıf + oyun ilerlemesi);
-- tüm tablolarda satır düzeyi güvenlik (RLS); silinen çocuğun verisi zincirleme silinir.
-- NOT: Bu dosya bir hukuki görüş değildir. Yayından önce hukukçuya gösterin.
-- =====================================================================
create table public.parents (id uuid primary key references auth.users(id) on delete cascade, created_at timestamptz not null default now());

create table public.consents (
  id bigint generated always as identity primary key,
  parent_id uuid not null references public.parents(id) on delete cascade,
  kind text not null check (kind in ('aydinlatma_okundu','acik_riza_cocuk_verisi')),
  version text not null, accepted_at timestamptz not null default now(), withdrawn_at timestamptz);
create index on public.consents(parent_id);

create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.parents(id) on delete cascade,
  nickname text not null check (char_length(nickname) between 2 and 20),
  grade smallint not null check (grade between 5 and 8),
  created_at timestamptz not null default now(),
  unique (parent_id, nickname));
create index on public.children(parent_id);

-- Oyun ilerlemesi: sitenin kullanıcı kaydı (puan, yıldızlar, rozetler, seri, kazanım istatistikleri, tekrar listesi) tek JSON olarak tutulur
create table public.child_state (
  child_id uuid primary key references public.children(id) on delete cascade,
  data jsonb not null default '{}'::jsonb check (pg_column_size(data) < 200000),
  updated_at timestamptz not null default now());

create or replace function public.is_my_child(cid uuid) returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.children c where c.id = cid and c.parent_id = auth.uid()); $$;

alter table public.parents enable row level security;
alter table public.consents enable row level security;
alter table public.children enable row level security;
alter table public.child_state enable row level security;
create policy parents_own on public.parents for all using (id = auth.uid()) with check (id = auth.uid());
create policy consents_read on public.consents for select using (parent_id = auth.uid());
create policy consents_insert on public.consents for insert with check (parent_id = auth.uid());
create policy consents_update on public.consents for update using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy children_own on public.children for all using (parent_id = auth.uid()) with check (parent_id = auth.uid());
create policy state_own on public.child_state for all using (public.is_my_child(child_id)) with check (public.is_my_child(child_id));
revoke all on all tables in schema public from anon;

-- Güncel açık rıza yoksa çocuk profili oluşturulamaz
create or replace function public.require_consent() returns trigger language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from public.consents where parent_id = new.parent_id and kind = 'acik_riza_cocuk_verisi' and withdrawn_at is null)
  then raise exception 'Çocuk profili için güncel açık rıza gerekli'; end if;
  return new;
end $$;
create trigger children_need_consent before insert on public.children for each row execute function public.require_consent();

-- KVKK hakları: dışa aktarma ve silme
create or replace function public.export_child_data(cid uuid) returns jsonb language sql stable security invoker as $$
  select jsonb_build_object('cocuk', (select to_jsonb(c) from public.children c where c.id = cid),
                            'ilerleme', (select s.data from public.child_state s where s.child_id = cid))
  where public.is_my_child(cid); $$;
create or replace function public.delete_child(cid uuid) returns void language plpgsql security invoker as $$
begin delete from public.children where id = cid and parent_id = auth.uid(); end $$;

-- Hesabı tamamen silmek için Edge Function gerekir (README'ye bakın); service_role anahtarı ASLA tarayıcıya konmaz.
-- Saklama süresi örneği (pg_cron ile): 12 aydır güncellenmeyen çocuk profillerini sil.
-- select cron.schedule('inaktif-temizlik','0 3 * * 0', $$ delete from public.children c using public.child_state s where s.child_id=c.id and s.updated_at < now() - interval '12 months' $$);
