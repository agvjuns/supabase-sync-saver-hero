
-- Enable Row Level Security on organizations table
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Allow admins full access to their organization
CREATE POLICY "Admins can manage their organization" 
ON organizations
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = organizations.id 
    AND user_id = auth.uid() 
    AND role = 'admin'
  )
);

-- Allow read access to organization members
CREATE POLICY "Members can view their organization" 
ON organizations
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM organization_members
    WHERE organization_id = organizations.id
    AND user_id = auth.uid()
  )
);

-- Allow insert only by authenticated users (will be limited by application logic)
CREATE POLICY "Authenticated users can create organizations"
ON organizations
FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Add RLS policies for organization_members table
ALTER TABLE organization_members ENABLE ROW LEVEL SECURITY;

-- Allow admins to manage members in their organization
CREATE POLICY "Admins can manage organization members"
ON organization_members
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
    AND om.role = 'admin'
  )
);

-- Allow members to view other members in their organization
CREATE POLICY "Members can view organization members"
ON organization_members
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM organization_members om
    WHERE om.organization_id = organization_members.organization_id
    AND om.user_id = auth.uid()
  )
);
