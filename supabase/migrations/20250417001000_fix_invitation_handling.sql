-- Update the function to properly handle invited users
CREATE OR REPLACE FUNCTION public.handle_invited_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  org_id uuid;
  user_role text;
  org_name text;
BEGIN
  -- Check if this user was invited (has organization_id in their metadata)
  IF new.raw_user_meta_data->>'organization_id' IS NOT NULL THEN
    -- Get the organization ID from the user's metadata
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

    -- Return without creating a new organization
    RETURN new;
  END IF;


  RETURN new;
END;
$$;

-- Replace the old handle_new_user trigger function with our updated one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_invited_user();
