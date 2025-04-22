
-- This is a reference SQL file that should be manually executed in the Supabase SQL Editor
-- Please run this SQL in your Supabase project to update the handle_new_user function

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER set search_path = ''
AS $$
DECLARE
  default_org_id UUID;
  org_name TEXT;
  default_member_limit INTEGER := 1;  -- Default to 1 for free tier
BEGIN
  -- Get the organization name from user metadata or use a default
  org_name := COALESCE(new.raw_user_meta_data->>'organization_name', concat('Organization for ', new.email));
  
  -- Create a default organization for the user
  INSERT INTO public.organizations (name, member_limit, subscription_tier, subscription_status)
  VALUES (
    org_name,
    default_member_limit,
    'free',     -- Default tier is 'free'
    'inactive'  -- Default status is 'inactive'
  )
  RETURNING id INTO default_org_id;
  
  -- Create a profile for the user
  INSERT INTO public.profiles (id, email, full_name, organization_id, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', new.email),
    default_org_id,
    'admin'
  );
  
  RETURN new;
END;
$$;
