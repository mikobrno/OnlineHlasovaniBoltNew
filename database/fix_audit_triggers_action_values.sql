-- Fix audit triggers to use allowed action values per audit_log.action CHECK
-- Maps TG_OP ('INSERT','UPDATE','DELETE') -> ('create','update','delete')

-- create_audit_log used by table triggers (e.g., members)
CREATE OR REPLACE FUNCTION public.create_audit_log()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_action TEXT;
BEGIN
  v_action := CASE TG_OP
                WHEN 'INSERT' THEN 'create'
                WHEN 'UPDATE' THEN 'update'
                WHEN 'DELETE' THEN 'delete'
              END;

  INSERT INTO audit_log (
      entity_type,
      entity_id,
      action,
      actor_type,
      actor_id,
      actor_name,
      old_data,
      new_data
  ) VALUES (
      TG_TABLE_NAME,
      COALESCE(NEW.id, OLD.id),
      v_action,
      'member',
      NULL,
      NULL,
      CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN row_to_json(OLD) ELSE NULL END,
      CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN row_to_json(NEW) ELSE NULL END
  );

  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.create_audit_log() TO authenticated;

-- audit_trigger_function used in step4 for votes and others
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $fn$
DECLARE
  v_action TEXT;
BEGIN
  v_action := CASE TG_OP
                WHEN 'INSERT' THEN 'create'
                WHEN 'UPDATE' THEN 'update'
                WHEN 'DELETE' THEN 'delete'
              END;

  IF TG_OP = 'INSERT' THEN
      INSERT INTO audit_log (entity_type, entity_id, action, actor_type, old_data, new_data)
      VALUES (TG_TABLE_NAME, NEW.id, v_action, 'member', NULL, row_to_json(NEW));
      RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
      INSERT INTO audit_log (entity_type, entity_id, action, actor_type, old_data, new_data)
      VALUES (TG_TABLE_NAME, NEW.id, v_action, 'member', row_to_json(OLD), row_to_json(NEW));
      RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
      INSERT INTO audit_log (entity_type, entity_id, action, actor_type, old_data, new_data)
      VALUES (TG_TABLE_NAME, OLD.id, v_action, 'member', row_to_json(OLD), NULL);
      RETURN OLD;
  END IF;
  RETURN NULL;
END;
$fn$;

GRANT EXECUTE ON FUNCTION public.audit_trigger_function() TO authenticated;

-- No trigger recreation needed if they already reference these function names
