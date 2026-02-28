-- =============================================================
-- JABSON PRO — Supabase SQL Schema
-- სრული მონაცემთა ბაზა POS + ინვენტარიზაცია
-- =============================================================
-- დააკოპირეთ და ჩასვით Supabase SQL Editor-ში
-- =============================================================

-- 0. Extensions
-- =============================================================
create extension if not exists "uuid-ossp";

-- =============================================================
-- 1. BRANCHES (ფილიალები)
-- =============================================================
create table branches (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  address     text,
  phone       text,
  is_main     boolean not null default false,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table branches is 'ფილიალები / მაღაზიები';

-- =============================================================
-- 2. ROLES & USERS (როლები და მომხმარებლები)
-- =============================================================
create type user_role as enum ('admin', 'manager', 'cashier', 'accountant', 'viewer');

create table users (
  id          uuid primary key default uuid_generate_v4(),
  auth_id     uuid unique,                              -- Supabase Auth uid (auth.users.id)
  email       text not null unique,
  full_name   text not null,
  phone       text,
  role        user_role not null default 'cashier',
  branch_id   uuid references branches(id) on delete set null,
  avatar_url  text,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on table users is 'სისტემის მომხმარებლები / გუნდის წევრები';

-- =============================================================
-- 3. COMPANY SETTINGS (კომპანიის პარამეტრები)
-- =============================================================
create table company_settings (
  id              uuid primary key default uuid_generate_v4(),
  company_name    text not null default '',
  tin             text,                                  -- საიდენტიფიკაციო კოდი
  address         text,
  phone           text,
  email           text,
  currency        text not null default 'GEL',
  vat_rate        numeric(5,2) not null default 18.00,
  auto_vat        boolean not null default true,
  language        text not null default 'ka',
  logo_url        text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

comment on table company_settings is 'კომპანიის ზოგადი პარამეტრები (1 ჩანაწერი)';

-- =============================================================
-- 4. CATEGORIES (კატეგორიები)
-- =============================================================
create table categories (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null unique,
  color       text not null default '#16a34a',           -- HEX ფერი UI-სთვის
  icon        text,                                      -- lucide icon სახელი
  sort_order  int not null default 0,
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

comment on table categories is 'პროდუქტის კატეგორიები';

-- =============================================================
-- 5. PRODUCTS (პროდუქტები)
-- =============================================================
create table products (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  sku           text unique,
  barcode       text unique,
  category_id   uuid not null references categories(id) on delete restrict,
  price         numeric(12,2) not null default 0,        -- გასაყიდი ფასი
  cost_price    numeric(12,2) not null default 0,        -- თვითღირებულება
  stock         numeric(12,3) not null default 0,        -- მიმდინარე მარაგი
  min_stock     numeric(12,3) not null default 0,        -- მინიმალური მარაგი (ალერტისთვის)
  unit          text not null default 'ც',               -- ერთეული: ც, კგ, ლ
  vat_rate      numeric(5,2) not null default 18.00,
  is_active     boolean not null default true,
  pos_visible   boolean not null default true,            -- POS-ზე ჩანს?
  image_url     text,
  branch_id     uuid references branches(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_products_category on products(category_id);
create index idx_products_barcode on products(barcode);
create index idx_products_sku on products(sku);
create index idx_products_branch on products(branch_id);
create index idx_products_stock_alert on products(stock, min_stock) where is_active = true;

comment on table products is 'პროდუქტების კატალოგი + მარაგი';

-- =============================================================
-- 6. CUSTOMERS (კლიენტები)
-- =============================================================
create table customers (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  tin           text,                                    -- საიდენტიფიკაციო კოდი
  phone         text,
  email         text,
  address       text,
  balance       numeric(12,2) not null default 0,        -- ბალანსი (+ = ვალი ჩვენთან, - = წინასწარ გადახდილი)
  total_spent   numeric(14,2) not null default 0,
  visit_count   int not null default 0,
  loyalty_pts   int not null default 0,
  notes         text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index idx_customers_phone on customers(phone);
create index idx_customers_tin on customers(tin);

comment on table customers is 'კლიენტების ბაზა + ლოიალობის სისტემა';

-- =============================================================
-- 7. SUPPLIERS (მომწოდებლები)
-- =============================================================
create table suppliers (
  id            uuid primary key default uuid_generate_v4(),
  name          text not null,
  tin           text,
  phone         text,
  email         text,
  address       text,
  balance       numeric(14,2) not null default 0,        -- ბალანსი (- = ვალი მომწოდებელთან)
  notes         text,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

comment on table suppliers is 'მომწოდებლების ბაზა';

-- =============================================================
-- 8. SALES (გაყიდვები / ჩეკები)
-- =============================================================
create type payment_method as enum ('cash', 'card', 'transfer');

create table sales (
  id              uuid primary key default uuid_generate_v4(),
  receipt_number  text not null unique,                  -- RC-XXXXXX
  customer_id     uuid references customers(id) on delete set null,
  branch_id       uuid references branches(id) on delete set null,
  subtotal        numeric(14,2) not null default 0,
  discount        numeric(14,2) not null default 0,
  discount_pct    numeric(5,2) not null default 0,       -- % ფასდაკლება
  vat_amount      numeric(14,2) not null default 0,
  total           numeric(14,2) not null default 0,
  payment_method  payment_method not null default 'cash',
  cash_given      numeric(14,2),
  change_amount   numeric(14,2),
  is_return       boolean not null default false,         -- უკან დაბრუნებაა?
  return_of       uuid references sales(id) on delete set null,  -- რომელი გაყიდვის დაბრუნება
  promo_code      text,
  notes           text,
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now()
);

create index idx_sales_receipt on sales(receipt_number);
create index idx_sales_customer on sales(customer_id);
create index idx_sales_branch on sales(branch_id);
create index idx_sales_created_at on sales(created_at desc);
create index idx_sales_payment_method on sales(payment_method);

comment on table sales is 'გაყიდვების ჩეკები';

-- =============================================================
-- 9. SALE ITEMS (გაყიდვის ხაზები)
-- =============================================================
create table sale_items (
  id            uuid primary key default uuid_generate_v4(),
  sale_id       uuid not null references sales(id) on delete cascade,
  product_id    uuid not null references products(id) on delete restrict,
  product_name  text not null,                           -- snapshot: პროდუქტის სახელი გაყიდვის დროს
  quantity      numeric(12,3) not null,
  unit_price    numeric(12,2) not null,                  -- ერთეულის ფასი გაყიდვის დროს
  cost_price    numeric(12,2) not null default 0,        -- თვითღირებულება snapshot
  discount      numeric(12,2) not null default 0,
  vat_rate      numeric(5,2) not null default 18.00,
  total         numeric(14,2) not null,
  created_at    timestamptz not null default now()
);

create index idx_sale_items_sale on sale_items(sale_id);
create index idx_sale_items_product on sale_items(product_id);

comment on table sale_items is 'გაყიდვის ხაზები (ჩეკის აითემები)';

-- =============================================================
-- 10. INVENTORY ADJUSTMENTS (ინვენტარიზაცია / კორექტირება)
-- =============================================================
create type adjustment_reason as enum (
  'correction',    -- კორექტირება
  'damage',        -- დაზიანება
  'theft',         -- ქურდობა
  'expiry',        -- ვადაგასული
  'initial',       -- საწყისი მარაგი
  'other'          -- სხვა
);

create table inventory_adjustments (
  id            uuid primary key default uuid_generate_v4(),
  product_id    uuid not null references products(id) on delete restrict,
  product_name  text not null,                           -- snapshot
  branch_id     uuid references branches(id) on delete set null,
  qty_before    numeric(12,3) not null,
  qty_after     numeric(12,3) not null,
  qty_change    numeric(12,3) not null,                  -- = qty_after - qty_before
  reason        adjustment_reason not null default 'correction',
  notes         text,
  created_by    uuid references users(id) on delete set null,
  created_at    timestamptz not null default now()
);

create index idx_adj_product on inventory_adjustments(product_id);
create index idx_adj_created_at on inventory_adjustments(created_at desc);
create index idx_adj_reason on inventory_adjustments(reason);

comment on table inventory_adjustments is 'მარაგის მანუალური კორექტირება / ინვენტარიზაცია';

-- =============================================================
-- 11. STOCK TRANSFERS (ფილიალებს შორის გადატანა)
-- =============================================================
create type transfer_status as enum ('pending', 'completed', 'cancelled');

create table stock_transfers (
  id              uuid primary key default uuid_generate_v4(),
  from_branch_id  uuid not null references branches(id) on delete restrict,
  to_branch_id    uuid not null references branches(id) on delete restrict,
  status          transfer_status not null default 'pending',
  notes           text,
  created_by      uuid references users(id) on delete set null,
  approved_by     uuid references users(id) on delete set null,
  approved_at     timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  constraint chk_different_branches check (from_branch_id <> to_branch_id)
);

create index idx_transfers_status on stock_transfers(status);
create index idx_transfers_from on stock_transfers(from_branch_id);
create index idx_transfers_to on stock_transfers(to_branch_id);

comment on table stock_transfers is 'ფილიალებს შორის მარაგის გადატანა';

-- =============================================================
-- 12. STOCK TRANSFER ITEMS (გადატანის ხაზები)
-- =============================================================
create table stock_transfer_items (
  id            uuid primary key default uuid_generate_v4(),
  transfer_id   uuid not null references stock_transfers(id) on delete cascade,
  product_id    uuid not null references products(id) on delete restrict,
  product_name  text not null,                           -- snapshot
  quantity      numeric(12,3) not null,
  created_at    timestamptz not null default now()
);

create index idx_transfer_items_transfer on stock_transfer_items(transfer_id);

comment on table stock_transfer_items is 'გადატანის ხაზები (პროდუქტები)';

-- =============================================================
-- 13. PURCHASE ORDERS (შესყიდვები / შეკვეთები მომწოდებლისგან)
-- =============================================================
create type purchase_status as enum ('draft', 'ordered', 'partial', 'received', 'cancelled');

create table purchase_orders (
  id              uuid primary key default uuid_generate_v4(),
  order_number    text not null unique,                  -- PO-XXXXXX
  supplier_id     uuid not null references suppliers(id) on delete restrict,
  branch_id       uuid references branches(id) on delete set null,
  status          purchase_status not null default 'draft',
  subtotal        numeric(14,2) not null default 0,
  vat_amount      numeric(14,2) not null default 0,
  total           numeric(14,2) not null default 0,
  notes           text,
  expected_date   date,
  received_date   date,
  created_by      uuid references users(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index idx_po_supplier on purchase_orders(supplier_id);
create index idx_po_status on purchase_orders(status);

comment on table purchase_orders is 'შესყიდვის ორდერები / მომწოდებლისგან შეკვეთები';

-- =============================================================
-- 14. PURCHASE ORDER ITEMS (შესყიდვის ხაზები)
-- =============================================================
create table purchase_order_items (
  id              uuid primary key default uuid_generate_v4(),
  purchase_id     uuid not null references purchase_orders(id) on delete cascade,
  product_id      uuid not null references products(id) on delete restrict,
  product_name    text not null,
  quantity        numeric(12,3) not null,
  received_qty    numeric(12,3) not null default 0,
  unit_cost       numeric(12,2) not null,
  total           numeric(14,2) not null,
  created_at      timestamptz not null default now()
);

create index idx_po_items_purchase on purchase_order_items(purchase_id);

comment on table purchase_order_items is 'შესყიდვის ხაზები (პროდუქტები)';

-- =============================================================
-- 15. AUDIT LOG (აუდიტ ლოგი)
-- =============================================================
create type audit_action as enum ('CREATE', 'UPDATE', 'DELETE');

create table audit_log (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references users(id) on delete set null,
  user_email  text not null,
  action      audit_action not null,
  table_name  text not null,
  record_id   text not null,
  old_data    jsonb,
  new_data    jsonb,
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);

create index idx_audit_user on audit_log(user_id);
create index idx_audit_table on audit_log(table_name);
create index idx_audit_action on audit_log(action);
create index idx_audit_created_at on audit_log(created_at desc);
create index idx_audit_record on audit_log(table_name, record_id);

comment on table audit_log is 'სისტემის ყველა ცვლილების აუდიტ ლოგი (PRO)';

-- =============================================================
-- 16. NOTIFICATIONS (შეტყობინებები)
-- =============================================================
create type notification_type as enum ('stock_alert', 'sale', 'system', 'transfer', 'purchase');

create table notifications (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references users(id) on delete cascade,    -- null = ყველასთვის
  branch_id   uuid references branches(id) on delete set null,
  type        notification_type not null,
  title       text not null,
  body        text not null,
  is_read     boolean not null default false,
  metadata    jsonb,                                     -- დამატებითი მონაცემები
  created_at  timestamptz not null default now()
);

create index idx_notif_user on notifications(user_id);
create index idx_notif_read on notifications(is_read) where is_read = false;
create index idx_notif_created_at on notifications(created_at desc);

comment on table notifications is 'შეტყობინებები / ალერტები';

-- =============================================================
-- 17. PROMO CODES (პრომო კოდები)
-- =============================================================
create table promo_codes (
  id              uuid primary key default uuid_generate_v4(),
  code            text not null unique,
  discount_pct    numeric(5,2) not null default 0,       -- % ფასდაკლება
  discount_amount numeric(12,2) not null default 0,      -- ფიქსირებული ფასდაკლება
  min_order       numeric(12,2) not null default 0,      -- მინ. შეკვეთის ჯამი
  max_uses        int,                                   -- null = ულიმიტო
  used_count      int not null default 0,
  valid_from      timestamptz not null default now(),
  valid_until     timestamptz,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now()
);

create unique index idx_promo_code on promo_codes(lower(code));

comment on table promo_codes is 'პრომო / ფასდაკლების კოდები';

-- =============================================================
-- 18. DAILY STATS CACHE (დღიური სტატისტიკის ქეში)
-- =============================================================
create table daily_stats (
  id              uuid primary key default uuid_generate_v4(),
  branch_id       uuid references branches(id) on delete cascade,
  date            date not null,
  total_sales     numeric(14,2) not null default 0,
  total_orders    int not null default 0,
  total_profit    numeric(14,2) not null default 0,
  avg_check       numeric(12,2) not null default 0,
  cash_sales      numeric(14,2) not null default 0,
  card_sales      numeric(14,2) not null default 0,
  transfer_sales  numeric(14,2) not null default 0,
  returns_count   int not null default 0,
  returns_amount  numeric(14,2) not null default 0,
  created_at      timestamptz not null default now(),

  unique(branch_id, date)
);

create index idx_daily_stats_date on daily_stats(date desc);

comment on table daily_stats is 'დღიური სტატისტიკის ქეში (dashboard-სთვის)';

-- =============================================================
-- 19. HELPER FUNCTIONS
-- =============================================================

-- ავტო-updated_at ტრიგერის ფუნქცია
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- updated_at ტრიგერები
create trigger trg_branches_updated    before update on branches            for each row execute function update_updated_at();
create trigger trg_users_updated       before update on users               for each row execute function update_updated_at();
create trigger trg_company_updated     before update on company_settings    for each row execute function update_updated_at();
create trigger trg_products_updated    before update on products            for each row execute function update_updated_at();
create trigger trg_customers_updated   before update on customers           for each row execute function update_updated_at();
create trigger trg_suppliers_updated   before update on suppliers           for each row execute function update_updated_at();
create trigger trg_transfers_updated   before update on stock_transfers     for each row execute function update_updated_at();
create trigger trg_po_updated          before update on purchase_orders     for each row execute function update_updated_at();

-- =============================================================
-- 20. AUTOMATIC STOCK DEDUCTION ON SALE
-- =============================================================
create or replace function deduct_stock_on_sale()
returns trigger as $$
begin
  update products
  set stock = stock - new.quantity
  where id = new.product_id;

  -- მარაგის ალერტი
  if (select stock <= min_stock from products where id = new.product_id) then
    insert into notifications (type, title, body, metadata)
    select
      'stock_alert',
      case when p.stock <= 0 then 'მარაგი ამოიწურა' else 'დაბალი მარაგი' end,
      p.name || ' — ' || p.stock || ' ' || p.unit || ' (მინ: ' || p.min_stock || ')',
      jsonb_build_object('product_id', p.id, 'stock', p.stock, 'min_stock', p.min_stock)
    from products p
    where p.id = new.product_id;
  end if;

  return new;
end;
$$ language plpgsql;

create trigger trg_deduct_stock
after insert on sale_items
for each row execute function deduct_stock_on_sale();

-- =============================================================
-- 21. AUTOMATIC STOCK UPDATE ON INVENTORY ADJUSTMENT
-- =============================================================
create or replace function apply_inventory_adjustment()
returns trigger as $$
begin
  update products
  set stock = new.qty_after
  where id = new.product_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_apply_adjustment
after insert on inventory_adjustments
for each row execute function apply_inventory_adjustment();

-- =============================================================
-- 22. AUTOMATIC CUSTOMER STATS UPDATE ON SALE
-- =============================================================
create or replace function update_customer_on_sale()
returns trigger as $$
begin
  if new.customer_id is not null and new.is_return = false then
    update customers
    set
      total_spent = total_spent + new.total,
      visit_count = visit_count + 1,
      loyalty_pts = loyalty_pts + floor(new.total)::int
    where id = new.customer_id;
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_update_customer_stats
after insert on sales
for each row execute function update_customer_on_sale();

-- =============================================================
-- 23. RECEIPT NUMBER GENERATOR
-- =============================================================
create sequence receipt_seq start 1000;

create or replace function generate_receipt_number()
returns trigger as $$
begin
  if new.receipt_number is null or new.receipt_number = '' then
    new.receipt_number = 'RC-' || lpad(nextval('receipt_seq')::text, 6, '0');
  end if;
  return new;
end;
$$ language plpgsql;

create trigger trg_receipt_number
before insert on sales
for each row execute function generate_receipt_number();

-- =============================================================
-- 24. ROW LEVEL SECURITY (RLS)
-- =============================================================
alter table users enable row level security;
alter table products enable row level security;
alter table sales enable row level security;
alter table sale_items enable row level security;
alter table customers enable row level security;
alter table suppliers enable row level security;
alter table inventory_adjustments enable row level security;
alter table stock_transfers enable row level security;
alter table stock_transfer_items enable row level security;
alter table purchase_orders enable row level security;
alter table purchase_order_items enable row level security;
alter table audit_log enable row level security;
alter table notifications enable row level security;

-- RLS Policies: Authenticated users can read everything (same org)
-- Admin/Manager can write everything
-- Cashiers can only create sales and read products

create policy "Authenticated users can read all"
  on products for select
  to authenticated
  using (true);

create policy "Managers can manage products"
  on products for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read sales"
  on sales for select
  to authenticated
  using (true);

create policy "Authenticated users can create sales"
  on sales for insert
  to authenticated
  with check (true);

create policy "Authenticated users can read sale_items"
  on sale_items for select
  to authenticated
  using (true);

create policy "Authenticated users can insert sale_items"
  on sale_items for insert
  to authenticated
  with check (true);

create policy "Authenticated users can read customers"
  on customers for select
  to authenticated
  using (true);

create policy "Authenticated users can manage customers"
  on customers for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read suppliers"
  on suppliers for select
  to authenticated
  using (true);

create policy "Managers can manage suppliers"
  on suppliers for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read adjustments"
  on inventory_adjustments for select
  to authenticated
  using (true);

create policy "Authenticated users can create adjustments"
  on inventory_adjustments for insert
  to authenticated
  with check (true);

create policy "Authenticated users can read transfers"
  on stock_transfers for select
  to authenticated
  using (true);

create policy "Authenticated users can manage transfers"
  on stock_transfers for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read transfer_items"
  on stock_transfer_items for select
  to authenticated
  using (true);

create policy "Authenticated users can manage transfer_items"
  on stock_transfer_items for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read purchase orders"
  on purchase_orders for select
  to authenticated
  using (true);

create policy "Managers can manage purchase orders"
  on purchase_orders for all
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated users can read po items"
  on purchase_order_items for select
  to authenticated
  using (true);

create policy "Managers can manage po items"
  on purchase_order_items for all
  to authenticated
  using (true)
  with check (true);

create policy "Users can read own notifications"
  on notifications for select
  to authenticated
  using (user_id is null or user_id = auth.uid());

create policy "System can insert notifications"
  on notifications for insert
  to authenticated
  with check (true);

create policy "Users can update own notifications"
  on notifications for update
  to authenticated
  using (user_id is null or user_id = auth.uid());

create policy "Admins can read audit log"
  on audit_log for select
  to authenticated
  using (true);

create policy "System can insert audit log"
  on audit_log for insert
  to authenticated
  with check (true);

create policy "Users can read own profile"
  on users for select
  to authenticated
  using (true);

create policy "Users can update own profile"
  on users for update
  to authenticated
  using (auth_id = auth.uid());

-- =============================================================
-- 25. SEED DATA (დემო მონაცემები)
-- =============================================================

-- ფილიალები
insert into branches (name, address, is_main) values
  ('მთავარი მაღაზია', 'თბილისი, რუსთაველის 12', true),
  ('ფილიალი #2 — ვაკე', 'თბილისი, ჭავჭავაძის 45', false);

-- კომპანიის პარამეტრები
insert into company_settings (company_name, tin, address, phone, email) values
  ('შპს "JabsOn Demo"', '404123456', 'თბილისი, რუსთაველის 12', '+995 322 123 456', 'info@jabson.ge');

-- კატეგორიები
insert into categories (name, color, icon, sort_order) values
  ('სასმელი',          '#3b82f6', 'wine',      1),
  ('საკვები',          '#f59e0b', 'utensils',   2),
  ('ტკბილეული',       '#ec4899', 'candy',      3),
  ('ჰიგიენა',         '#8b5cf6', 'sparkles',   4),
  ('საყოფაცხოვრებო',   '#06b6d4', 'home',      5),
  ('რძის პროდუქტი',    '#22c55e', 'milk',      6);

-- პროდუქტები
insert into products (name, sku, barcode, category_id, price, cost_price, stock, min_stock, unit, vat_rate) values
  ('კოკა-კოლა 0.5ლ',          'SKU-001', '5449000000996', (select id from categories where name='სასმელი'),         2.50,  1.80, 145, 20, 'ც', 18),
  ('ფანტა 0.5ლ',              'SKU-002', '5449000011527', (select id from categories where name='სასმელი'),         2.50,  1.80,  89, 20, 'ც', 18),
  ('ბორჯომი 0.5ლ',            'SKU-003', '4860019001377', (select id from categories where name='სასმელი'),         1.80,  1.20, 200, 30, 'ც', 18),
  ('ნაბეღლავი 1ლ',            'SKU-004', '4860019001384', (select id from categories where name='სასმელი'),         1.50,  0.90, 310, 50, 'ც', 18),
  ('ლაგერი ლუდი 0.5ლ',        'SKU-005', '4860019002345', (select id from categories where name='სასმელი'),         3.50,  2.40,  78, 15, 'ც', 18),
  ('პური შავი',               'SKU-006', '4860019003456', (select id from categories where name='საკვები'),          1.50,  0.80,  45, 10, 'ც', 18),
  ('ყველი იმერული 1კგ',       'SKU-007', '4860019004567', (select id from categories where name='რძის პროდუქტი'),  14.00, 10.50,  22,  5, 'კგ', 18),
  ('რძე 1ლ',                  'SKU-008', '4860019005678', (select id from categories where name='რძის პროდუქტი'),   4.50,  3.20,  67, 15, 'ც', 18),
  ('შოკოლადი ბარამბო',         'SKU-009', '4860019006789', (select id from categories where name='ტკბილეული'),       3.20,  2.10, 156, 25, 'ც', 18),
  ('ჩიფსი ლეისი',             'SKU-010', '4860019007890', (select id from categories where name='საკვები'),          4.80,  3.50,  93, 20, 'ც', 18),
  ('სარეცხი ფხვნილი 3კგ',     'SKU-011', '4860019008901', (select id from categories where name='საყოფაცხოვრებო'),  18.00, 13.50,   8, 10, 'ც', 18),
  ('კბილის პასტა კოლგეიტი',   'SKU-012', '4860019009012', (select id from categories where name='ჰიგიენა'),         6.50,  4.20,   3, 10, 'ც', 18),
  ('მაკარონი სპაგეტი 500გ',   'SKU-013', '4860019010123', (select id from categories where name='საკვები'),          3.00,  1.90, 120, 20, 'ც', 18),
  ('ზეთისხილის ზეთი 1ლ',     'SKU-014', '4860019011234', (select id from categories where name='საკვები'),         22.00, 16.00,  34,  8, 'ც', 18),
  ('კარაქი 200გ',             'SKU-015', '4860019012345', (select id from categories where name='რძის პროდუქტი'),   7.80,  5.60,  42, 10, 'ც', 18),
  ('საპონი 100გ',             'SKU-016', '4860019013456', (select id from categories where name='ჰიგიენა'),          2.20,  1.30,   0, 15, 'ც', 18);

-- კლიენტები
insert into customers (name, tin, phone, email, address, balance, total_spent, visit_count, loyalty_pts) values
  ('გიორგი მაისურაძე',     '123456789', '599123456', 'giorgi@mail.ge', null,                           0,     1250.80, 45, 125),
  ('ანა კვარაცხელია',       null,        '555987654', 'ana@mail.ge',    null,                          50.00,  3420.50, 89, 342),
  ('ნიკა გელაშვილი',       '987654321', '577111222',  null,            null,                         -120.00,   890.00, 12,  89),
  ('მარიამ ჯავახიშვილი',    null,        '591456789',  null,            null,                           0,      560.30, 23,  56),
  ('შპს "დელტა"',          '404123456', '322123456', 'info@delta.ge',  'თბილისი, რუსთაველის 12',    850.00, 15600.00, 120, 1560);

-- მომწოდებლები
insert into suppliers (name, tin, phone, email, balance) values
  ('შპს "გადამამუშავებელი"',         '100200300', '322555111', 'info@supplier1.ge', -2500.00),
  ('შპს "სასმელების დისტრიბუტორი"', '100200301', '322555222',  null,                -800.00),
  ('იპ "ზვიად მეღვინეთხუცესი"',      null,        '599777888',  null,                   0.00);

-- პრომო კოდები
insert into promo_codes (code, discount_pct, is_active) values
  ('JABSON10', 10, true),
  ('VIP20',    20, true);

-- =============================================================
-- DONE! 
-- =============================================================
