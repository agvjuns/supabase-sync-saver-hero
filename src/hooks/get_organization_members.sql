
-- Function to get all members of an organization
CREATE OR REPLACE FUNCTION public.get_organization_members(org_id uuid)
RETURNS SETOF profiles
LANGUAGE plpgsql SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM profiles
  WHERE organization_id = org_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_organization_members(uuid) TO authenticated;
