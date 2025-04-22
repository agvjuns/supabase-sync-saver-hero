-- Enable RLS on tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (from previous troubleshooting)
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- organizations RLS Policies
-- Allow users to select organizations they are members of
CREATE POLICY "Organizations: Select members"
ON public.organizations FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
  )
);

-- Deny direct insert on organizations (handled by trigger)
CREATE POLICY "Organizations: Deny insert"
ON public.organizations FOR INSERT
WITH CHECK (false);

-- Allow admins to update their organization
CREATE POLICY "Organizations: Update admin"
ON public.organizations FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organizations.id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'admin'
  )
);

-- Deny delete on organizations
CREATE POLICY "Organizations: Deny delete"
ON public.organizations FOR DELETE
USING (false);

-- profiles RLS Policies
-- Allow users to select their own profile and profiles in their organization
CREATE POLICY "Profiles: Select members"
ON public.profiles FOR SELECT
USING (
  auth.uid() = id OR EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = profiles.organization_id
    AND organization_members.user_id = auth.uid()
  )
);

-- Deny direct insert on profiles (handled by trigger)
CREATE POLICY "Profiles: Deny insert"
ON public.profiles FOR INSERT
WITH CHECK (false);

-- Allow users to update their own profile
CREATE POLICY "Profiles: Update self"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

-- Deny delete on profiles (handled by cascade)
CREATE POLICY "Profiles: Deny delete"
ON public.profiles FOR DELETE
USING (false);

-- organization_members RLS Policies
-- Allow users to select members in their organization
CREATE POLICY "Organization Members: Select members"
ON public.organization_members FOR SELECT
USING (organization_members.organization_id IN (
  SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
));

-- Allow admins to insert new pending members (handled by invite function with security definer)
-- This policy is more for general insert attempts outside the function
CREATE POLICY "Organization Members: Insert admin"
ON public.organization_members FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = new.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'admin'
  )
);

-- Allow admins to update members in their organization
CREATE POLICY "Organization Members: Update admin"
ON public.organization_members FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = new.organization_id
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'admin'
  )
);

-- Allow users to update their own status (e.g., accepting invite)
CREATE POLICY "Organization Members: Update self status"
ON public.organization_members FOR UPDATE
USING (auth.uid() = user_id);


-- Allow admins to delete members in their organization
CREATE POLICY "Organization Members: Delete admin"
ON public.organization_members FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.organization_members
    WHERE organization_members.organization_id = organization_members.organization_id -- refers to the row being deleted
    AND organization_members.user_id = auth.uid()
    AND organization_members.role = 'admin'
  )
);


-- inventory RLS Policies
-- Allow users to select inventory in their organization
CREATE POLICY "Inventory: Select members"
ON public.inventory FOR SELECT
USING (organization_id IN (
  SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
));

-- Allow users to insert inventory in their organization
CREATE POLICY "Inventory: Insert members"
ON public.inventory FOR INSERT
WITH CHECK (organization_id IN (
  SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
));

-- Allow users to update inventory in their organization
CREATE POLICY "Inventory: Update members"
ON public.inventory FOR UPDATE
USING (organization_id IN (
  SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
));

-- Allow users to delete inventory in their organization
CREATE POLICY "Inventory: Delete members"
ON public.inventory FOR DELETE
USING (organization_id IN (
  SELECT organization_id FROM public.organization_members WHERE user_id = auth.uid()
));