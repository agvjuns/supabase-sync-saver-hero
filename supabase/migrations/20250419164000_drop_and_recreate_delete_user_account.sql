-- Drop the old function with the ambiguous parameter name
DROP FUNCTION IF EXISTS public.delete_user_account(user_id uuid);

-- Recreate the function with an unambiguous parameter name
CREATE OR REPLACE FUNCTION public.delete_user_account(p_user_id uuid DEFAULT NULL)
 RETURNS boolean
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  v_user_id uuid;
  v_org_id uuid;
  v_org_user_count int;
BEGIN
  -- Get the user ID either from the parameter or the current user's session
  IF p_user_id IS NOT NULL THEN
    v_user_id := p_user_id;
  ELSE
    v_user_id := auth.uid();
    
    IF v_user_id IS NULL THEN
      RAISE EXCEPTION 'Not authenticated';
    END IF;
  END IF;
  
  -- Get the user's organization ID
  SELECT organization_id INTO v_org_id 
  FROM public.profiles 
  WHERE id = v_user_id;
  
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'User profile not found';
  END IF;
  
  -- Count how many users are in this organization
  SELECT COUNT(*) INTO v_org_user_count
  FROM public.profiles
  WHERE organization_id = v_org_id;
  
  -- Delete inventory items created by this user
  DELETE FROM public.inventory_items
  WHERE created_by = v_user_id;
  
  -- Delete inventory items from the user's organization if they are the only user
  IF v_org_user_count = 1 THEN
    DELETE FROM public.inventory_items
    WHERE organization_id = v_org_id;
    
    -- Delete the organization if this is the only user
    DELETE FROM public.organizations
    WHERE id = v_org_id;
  END IF;
  
  -- Remove user from organization_members table
  DELETE FROM public.organization_members
  WHERE user_id = v_user_id;
  
  -- Delete user profile
  DELETE FROM public.profiles
  WHERE id = v_user_id;
  
  -- Return success
  RETURN TRUE;
END;
$function$;