-- Rychlý fix pro chybějící sloupce v produkční/staging DB
-- Spusťte v Supabase SQL editoru

-- Přidá vote_statistics do votes, pokud chybí (vyžaduje ho trigger update_vote_statistics)
ALTER TABLE IF EXISTS votes ADD COLUMN IF NOT EXISTS vote_statistics JSONB DEFAULT '{}';

-- Pojistka: přidá unikátní omezení, pokud chybí
DO $$
BEGIN
  -- member_votes unique (vote_id, member_id, question_id)
  BEGIN
    ALTER TABLE member_votes
      ADD CONSTRAINT member_votes_unique UNIQUE (vote_id, member_id, question_id);
  EXCEPTION WHEN duplicate_table THEN NULL; WHEN duplicate_object THEN NULL; END;

  -- manual_vote_notes unique (vote_id, member_id)
  BEGIN
    ALTER TABLE manual_vote_notes
      ADD CONSTRAINT manual_vote_notes_unique UNIQUE (vote_id, member_id);
  EXCEPTION WHEN duplicate_table THEN NULL; WHEN duplicate_object THEN NULL; END;
END $$;
