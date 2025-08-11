-- Alternative audit trigger with SECURITY DEFINER to avoid RLS issues on audit_log
-- Run this if authenticated INSERT policy on audit_log is undesirable.

DO $$
BEGIN
  -- Create or replace function with SECURITY DEFINER
  CREATE OR REPLACE FUNCTION public.audit_trigger_function()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  SECURITY DEFINER
  SET search_path = public
  AS $$
  BEGIN
      IF TG_OP = 'INSERT' THEN
          INSERT INTO audit_log (entity_type, entity_id, action, old_data, new_data, actor_id)
          VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', NULL, row_to_json(NEW), NULL);
          RETURN NEW;
      ELSIF TG_OP = 'UPDATE' THEN
          INSERT INTO audit_log (entity_type, entity_id, action, old_data, new_data, actor_id)
          VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW), NULL);
          RETURN NEW;
      ELSIF TG_OP = 'DELETE' THEN
          INSERT INTO audit_log (entity_type, entity_id, action, old_data, new_data, actor_id)
          VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), NULL, NULL);
          RETURN OLD;
      END IF;
      RETURN NULL;
  END;
  $$;

  -- Ensure ownership of function is postgres (or table owner) so SECURITY DEFINER is safe
  -- Note: Supabase usually uses the schema owner; adjust if needed.

  -- Grant execute to authenticated role (not strictly required for triggers, but harmless)
  GRANT EXECUTE ON FUNCTION public.audit_trigger_function() TO authenticated;
EXCEPTION WHEN others THEN
  -- no-op
END
$$;

-- Triggers recreation is not necessary if they already point to audit_trigger_function()
-- If needed, you can drop/create triggers similarly to step4_final_complete.sql
