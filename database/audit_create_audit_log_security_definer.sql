-- Make existing create_audit_log() trigger function SECURITY DEFINER to bypass RLS on audit_log
-- Use this only if you don't want to grant INSERT on audit_log to authenticated role.

CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
BEGIN
    INSERT INTO audit_log (
        entity_type,
        entity_id,
        action,
        old_data,
        new_data,
        actor_id
    ) VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN row_to_json(OLD) ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN row_to_json(NEW) ELSE NULL END,
        NULL
    );

    IF TG_OP = 'DELETE' THEN
      RETURN OLD;
    ELSE
      RETURN NEW;
    END IF;
END;
$fn$;

-- Optional: grant execute (not required for trigger use)
GRANT EXECUTE ON FUNCTION public.create_audit_log() TO authenticated;
