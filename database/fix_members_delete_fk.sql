-- Fix FK constraints to allow deleting members without 400 errors due to references
-- Idempotent and safe: checks column existence before altering

-- 1) Self-reference from members.representative_id -> members.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='members' AND column_name='representative_id'
  ) THEN
    BEGIN
      ALTER TABLE public.members DROP CONSTRAINT IF EXISTS members_representative_id_fkey;
    EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN
      ALTER TABLE public.members
        ADD CONSTRAINT members_representative_id_fkey
        FOREIGN KEY (representative_id)
        REFERENCES public.members(id)
        ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END$$;

-- 2) attachments.uploaded_by -> members.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='attachments' AND column_name='uploaded_by'
  ) THEN
    BEGIN
      ALTER TABLE public.attachments DROP CONSTRAINT IF EXISTS attachments_uploaded_by_fkey;
    EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN
      ALTER TABLE public.attachments
        ADD CONSTRAINT attachments_uploaded_by_fkey
        FOREIGN KEY (uploaded_by)
        REFERENCES public.members(id)
        ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END$$;

-- 3) reports.generated_by -> members.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='reports' AND column_name='generated_by'
  ) THEN
    BEGIN
      ALTER TABLE public.reports DROP CONSTRAINT IF EXISTS reports_generated_by_fkey;
    EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN
      ALTER TABLE public.reports
        ADD CONSTRAINT reports_generated_by_fkey
        FOREIGN KEY (generated_by)
        REFERENCES public.members(id)
        ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END$$;

-- 4) member_votes.delegated_by -> members.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='member_votes' AND column_name='delegated_by'
  ) THEN
    BEGIN
      ALTER TABLE public.member_votes DROP CONSTRAINT IF EXISTS member_votes_delegated_by_fkey;
    EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN
      ALTER TABLE public.member_votes
        ADD CONSTRAINT member_votes_delegated_by_fkey
        FOREIGN KEY (delegated_by)
        REFERENCES public.members(id)
        ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END$$;

-- 5) member_votes.proxy_for -> members.id
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema='public' AND table_name='member_votes' AND column_name='proxy_for'
  ) THEN
    BEGIN
      ALTER TABLE public.member_votes DROP CONSTRAINT IF EXISTS member_votes_proxy_for_fkey;
    EXCEPTION WHEN undefined_object THEN NULL; END;
    BEGIN
      ALTER TABLE public.member_votes
        ADD CONSTRAINT member_votes_proxy_for_fkey
        FOREIGN KEY (proxy_for)
        REFERENCES public.members(id)
        ON DELETE SET NULL;
    EXCEPTION WHEN duplicate_object THEN NULL; END;
  END IF;
END$$;

-- Quick inspect: list all FKs referencing members
-- SELECT conname, conrelid::regclass AS table_name, a.attname AS column_name, confdeltype
-- FROM pg_constraint c
-- JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY (c.conkey)
-- WHERE c.contype='f' AND c.confrelid = 'public.members'::regclass
-- ORDER BY table_name, column_name;
