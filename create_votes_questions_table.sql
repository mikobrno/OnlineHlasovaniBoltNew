-- Vytvoření chybějící tabulky votes_questions
-- Tato tabulka spojuje hlasování s otázkami (many-to-many vztah)

CREATE TABLE IF NOT EXISTS votes_questions (
    id SERIAL PRIMARY KEY,
    vote_id INTEGER NOT NULL REFERENCES votes(id) ON DELETE CASCADE,
    question_id INTEGER NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Zajistit unikátní kombinaci vote_id + question_id
    UNIQUE(vote_id, question_id)
);

-- Vypnout RLS pro novou tabulku
ALTER TABLE votes_questions DISABLE ROW LEVEL SECURITY;

-- Přidat indexy pro rychlejší dotazy
CREATE INDEX IF NOT EXISTS idx_votes_questions_vote_id ON votes_questions(vote_id);
CREATE INDEX IF NOT EXISTS idx_votes_questions_question_id ON votes_questions(question_id);

-- Ověřit, že tabulka byla vytvořena
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'votes_questions'
ORDER BY ordinal_position;
