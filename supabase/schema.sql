-- Create tables
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  block text not null,
  district text not null,
  financial_limit numeric, -- [NEW]
  start_date date, -- [NEW]
  created_at timestamp with time zone default now()
);

create table if not exists boq_items (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  item_code text not null,
  description text not null,
  unit text not null,
  total_quantity numeric,
  rate numeric,
  category text, -- [NEW] Pipeline, Civil, E&M
  created_at timestamp with time zone default now()
);

create table if not exists daily_reports (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade not null,
  user_id uuid references auth.users(id) not null,
  report_date date default current_date,
  location_gps jsonb,
  work_summary_text text,
  discipline text, -- Pipeline, Civil, E&M
  created_at timestamp with time zone default now()
);

-- Replaces old report_line_items
create table if not exists report_entries (
  id uuid primary key default gen_random_uuid(),
  report_id uuid references daily_reports(id) on delete cascade not null,
  boq_item_id uuid references boq_items(id) on delete set null, 
  quantity numeric not null default 0,
  stage_percentage numeric default 0, -- [NEW] 0-100 for Civil
  meta_data jsonb, -- [NEW] Stores "Soil Type", "Machine Used", "Diameter"
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table projects enable row level security;
alter table boq_items enable row level security;
alter table daily_reports enable row level security;
alter table report_entries enable row level security;

-- Policies (Assuming public read for authorized users, write for authenticated)
create policy "Enable read access for authenticated users" on projects for select using (auth.role() = 'authenticated');
create policy "Enable read access for authenticated users" on boq_items for select using (auth.role() = 'authenticated');
create policy "Enable read access for authenticated users" on daily_reports for select using (auth.role() = 'authenticated');
create policy "Enable read access for authenticated users" on report_entries for select using (auth.role() = 'authenticated');

create policy "Enable insert for authenticated users" on daily_reports with check (auth.uid() = user_id);
create policy "Enable insert for authenticated users" on report_entries with check (
  exists (select 1 from daily_reports where id = report_entries.report_id and user_id = auth.uid())
);
