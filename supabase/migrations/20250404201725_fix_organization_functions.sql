
-- Fix the update_organization RPC function to ensure proper admin checks
CREATE OR REPLACE FUNCTION public.update_organization(
  p_org_id uuid,
  p_user_id uuid,
  p_new_name text,
  p_stripe_customer_id text DEFAULT NULL,
  p_subscription_status text DEFAULT NULL,
  p_member_limit integer DEFAULT NULL,
  p_billing_email text DEFAULT NULL,
  p_subscription_tier text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Check if user exists in organization_members with admin role
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = p_org_id
    AND user_id = p_user_id
    AND role = 'admin'
  ) INTO is_admin;
  
  IF NOT is_admin THEN
    RETURN false;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM organizations WHERE id = p_org_id) THEN
    RETURN false;
  END IF;
  
  UPDATE organizations 
  SET name = p_new_name,
      stripe_customer_id = COALESCE(p_stripe_customer_id, stripe_customer_id),
      subscription_status = COALESCE(p_subscription_status, subscription_status),
      member_limit = COALESCE(p_member_limit, member_limit),
      billing_email = COALESCE(p_billing_email, billing_email),
      subscription_tier = COALESCE(p_subscription_tier, subscription_tier),
      updated_at = now()
  WHERE id = p_org_id;
  
  RETURN true;
END;
$$;

-- Create a better function to return organization members with profile data
CREATE OR REPLACE FUNCTION public.get_organization_members(org_id uuid)
RETURNS TABLE(
  id uuid,
  user_id uuid,
  email text,
  full_name text,
  role text,
  avatar_url text,
  status text
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    om.id,
    p.id AS user_id,
    p.email,
    p.full_name,
    om.role,
    p.avatar_url,
    om.status
  FROM 
    organization_members om
  JOIN
    profiles p ON om.user_id = p.id
  WHERE 
    om.organization_id = org_id;
END;
$$;

-- Add status field to organization_members if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'organization_members' 
    AND column_name = 'status'
  ) THEN
    ALTER TABLE public.organization_members ADD COLUMN status text DEFAULT 'active';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'organization_members' 
    AND column_name = 'email'
  ) THEN
    ALTER TABLE public.organization_members ADD COLUMN email text;
  END IF;
END;
$$;

-- Grant execute permission on functions
GRANT EXECUTE ON FUNCTION public.update_organization TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_organization_members TO authenticated;
