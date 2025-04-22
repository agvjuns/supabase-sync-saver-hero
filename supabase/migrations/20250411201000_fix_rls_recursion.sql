
-- First, let's check existing RLS policies on profiles table and remove any problematic ones
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Users can view profiles in their organization" ON profiles;

-- Create a security definer function to safely check user role without causing recursion
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create a security definer function to safely check if users are in the same organization
CREATE OR REPLACE FUNCTION public.users_in_same_org(user_id_1 uuid, user_id_2 uuid)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles a
    JOIN public.profiles b ON a.organization_id = b.organization_id
    WHERE a.id = user_id_1 AND b.id = user_id_2
  );
$$;

-- Enable RLS on profiles table if not already enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id);

-- Users with admin role can view all profiles in their organization
CREATE POLICY "Admins can view org profiles"
ON public.profiles
FOR SELECT
USING (
  public.get_user_role(auth.uid()) = 'admin' AND 
  public.users_in_same_org(auth.uid(), id)
);

-- Users can view other profiles in their organization
CREATE POLICY "Users can view org profiles"
ON public.profiles
FOR SELECT
USING (
  public.users_in_same_org(auth.uid(), id)
);

-- Grant execute permission on the security definer functions
GRANT EXECUTE ON FUNCTION public.get_user_role TO authenticated;
GRANT EXECUTE ON FUNCTION public.users_in_same_org TO authenticated;
