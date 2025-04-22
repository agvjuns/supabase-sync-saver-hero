-- Create organizations table
create table public.organizations (
  id uuid not null default gen_random_uuid (),
  name text not null,
  subscription_tier text null default 'free'::text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  stripe_customer_id text null,
  subscription_status text null default 'inactive'::text,
  member_limit integer null default 20,
  billing_email text null,
  role text null, -- This column seems redundant based on the plan's role definition in organization_members, consider removing if not used elsewhere.
  constraint organizations_pkey primary key (id)
) TABLESPACE pg_default;

-- Create profiles table
create table public.profiles (
  id uuid not null, -- FK to auth.users (id)
  email text not null,
  full_name text null,
  organization_id uuid not null, -- FK to organizations (id)
  role text null default 'user'::text, -- 'admin', 'user'
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  avatar_url text null,
  constraint profiles_pkey primary key (id),
  constraint profiles_id_fkey foreign key (id) references auth.users (id) on delete CASCADE,
  constraint profiles_organization_id_fkey foreign key (organization_id) references organizations (id) on delete CASCADE
) TABLESPACE pg_default;

-- Create organization_members table
create table public.organization_members (
  id uuid not null default gen_random_uuid (),
  user_id uuid null, -- FK to auth.users (id) - NULLABLE for pending invites
  organization_id uuid not null, -- FK to organizations (id)
  role text not null default 'user'::text, -- 'admin', 'user'
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  status text null default 'pending'::text, -- 'pending', 'active'
  email text not null, -- email of invited user
  name text null, -- name of invited user - removed default ''::text as per schema diagram
  constraint organization_members_pkey primary key (id),
  constraint organization_members_user_id_organization_id_key unique (user_id, organization_id),
  constraint organization_members_organization_id_fkey foreign key (organization_id) references organizations (id) on delete CASCADE,
  constraint organization_members_user_id_fkey foreign key (user_id) references auth.users (id) on delete CASCADE
) TABLESPACE pg_default;

-- Create inventory table
create table public.inventory (
  id uuid not null default gen_random_uuid (),
  organization_id uuid not null, -- FK to organizations (id)
  item_name text not null,
  quantity integer,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),
  constraint inventory_pkey primary key (id),
  constraint inventory_organization_id_fkey foreign key (organization_id) references organizations (id) on delete CASCADE
) TABLESPACE pg_default;