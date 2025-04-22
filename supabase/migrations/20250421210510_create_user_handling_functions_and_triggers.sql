-- Function to handle new users (non-invited)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  default_org_id UUID;
  org_name TEXT;
  default_member_limit INTEGER := 1;  -- Default to 1 for free tier
BEGIN
  -- Check if the user was invited. If so, exit this function.
  IF new.raw_user_meta_data->>'invited' IS NOT NULL AND (new.raw_user_meta_data->>'invited')::boolean THEN
    RETURN new;
  END IF;

  -- Get the organization name from user metadata or use a default
  org_name := COALESCE(new.raw_user_meta_data->>'organization_name', concat('Organization for ', new.email));

  -- Guard: Ensure org_name is not null or empty
  IF org_name IS NULL OR btrim(org_name) = '' THEN
    RAISE EXCEPTION 'Signup failed: organization_name is missing in user metadata and could not be generated';
  END IF;

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

  -- Add user as admin in organization_members table (optional based on plan, but including for completeness if needed)
  -- BEGIN
  --   INSERT INTO public.organization_members (user_id, organization_id, role, email, status)
  --   VALUES (
  --     new.id,
  --     default_org_id,
  --     'admin',
  --     new.email,
  --     'active'
  --   );
  -- EXCEPTION WHEN OTHERS THEN
  --   RAISE NOTICE 'Error inserting into organization_members for new user: %', SQLERRM;
  -- END;

  RETURN new;
END;
$$;

-- Function to handle invited users
CREATE OR REPLACE FUNCTION public.handle_invited_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  org_id uuid;
  user_role text;
BEGIN
  -- Check if this user was invited (has organization_id in their metadata)
  IF new.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
    -- Get the organization ID and role from the user's metadata
    org_id := (new.raw_user_meta_data->>'organization_id')::uuid;
    user_role := COALESCE(new.raw_user_meta_data->>'role', 'user');

    -- Guard: Ensure org_id is not null
    IF org_id IS NULL THEN
      RAISE EXCEPTION 'Signup failed: organization_id in user metadata is null';
    END IF;

    -- Update the organization_members entry to associate it with the new user
    UPDATE public.organization_members
    SET user_id = new.id, status = 'active'
    WHERE email = new.email AND organization_id = org_id;

    RETURN new;
  END IF;

  RETURN new;
END;
$$;

-- Function to create a profile for any new user
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$;

-- Trigger to call handle_new_user after a new user is created (if not invited)
DROP TRIGGER IF EXISTS new_user_trigger ON auth.users;
CREATE TRIGGER new_user_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW WHEN (new.raw_user_meta_data->>'invited' IS NULL OR (new.raw_user_meta_data->>'invited')::boolean IS FALSE)
  EXECUTE PROCEDURE public.handle_new_user();

-- Trigger to call handle_invited_user after a new user is created (if invited)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW WHEN (new.raw_user_meta_data->>'invited' IS NOT NULL AND (new.raw_user_meta_data->>'invited')::boolean IS TRUE)
  EXECUTE PROCEDURE public.handle_invited_user();

-- Trigger to call create_profile_for_new_user for any new user
DROP TRIGGER IF EXISTS create_profile_trigger ON auth.users;
CREATE TRIGGER create_profile_trigger
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE PROCEDURE public.create_profile_for_new_user();