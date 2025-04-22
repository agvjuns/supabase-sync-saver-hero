-- Migration to drop the legacy delete_user_account(user_id bigint) function, which causes ambiguity.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'delete_user_account'
      AND proargtypes = '20' -- 20 = OID for bigint
  ) THEN
    DROP FUNCTION public.delete_user_account(user_id bigint);
  END IF;
END
$$;