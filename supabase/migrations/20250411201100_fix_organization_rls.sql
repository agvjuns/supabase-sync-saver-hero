
-- Drop existing potentially problematic policies
DROP POLICY IF EXISTS "Admins can manage their organization" ON organizations;
DROP POLICY IF EXISTS "Members can view their organization" ON organizations;
DROP POLICY IF EXISTS "Authenticated users can create organizations" ON organizations;

-- Create security definer function to check if user is admin in an organization
CREATE OR REPLACE FUNCTION public.is_admin_of_org(org_id uuid)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  );
$$;

-- Create security definer function to check if user is member of an organization
CREATE OR REPLACE FUNCTION public.is_member_of_org(org_id uuid)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = org_id
    AND user_id = auth.uid()
  );
$$;

-- Create new non-recursive policies for organizations table
CREATE POLICY "Admins can manage their organization" 
ON organizations
FOR ALL USING (public.is_admin_of_org(id));

CREATE POLICY "Members can view their organization" 
ON organizations
FOR SELECT USING (public.is_member_of_org(id));

CREATE POLICY "Authenticated users can create organizations"
ON organizations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Grant execute permission on the security definer functions
GRANT EXECUTE ON FUNCTION public.is_admin_of_org TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_member_of_org TO authenticated;
