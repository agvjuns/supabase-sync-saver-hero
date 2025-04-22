CREATE OR REPLACE FUNCTION public.update_organization(
  p_org_id uuid,
  p_user_id uuid,
  p_new_name text,
  p_stripe_customer_id text DEFAULT NULL,
  p_subscription_status text DEFAULT NULL,
  p_member_limit integer DEFAULT NULL,
  p_billing_email text DEFAULT NULL
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  is_admin boolean;
BEGIN
  -- Check if user is admin of the organization
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
      updated_at = now()
  WHERE id = p_org_id;
  
  RETURN true;
END;
$$;