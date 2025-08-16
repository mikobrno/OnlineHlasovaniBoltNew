-- Vytvoření tabulky document_templates (chyběla – způsobovalo GraphQL chybu)
-- Spusťte v Nhost / Hasura SQL konzoli nebo přidejte do migrační sekvence.

CREATE TABLE IF NOT EXISTS document_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  body TEXT NOT NULL,
  help_text TEXT,
  is_global BOOLEAN NOT NULL DEFAULT false,
  building_id UUID REFERENCES buildings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Trigger pro aktualizaci updated_at (pokud již není globálně definována funkce update_updated_at_column)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'update_document_templates_updated_at'
  ) THEN
    CREATE TRIGGER update_document_templates_updated_at
      BEFORE UPDATE ON document_templates
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- RLS zapnutí
ALTER TABLE document_templates ENABLE ROW LEVEL SECURITY;

-- Politiky (zatím otevřené – přizpůsobte dle potřeby role claimů)
DROP POLICY IF EXISTS "Allow all for admin document_templates" ON document_templates;
CREATE POLICY "Allow all for admin document_templates" ON document_templates FOR ALL USING (true);

-- Volitelně pouze read pro ostatní:
-- DROP POLICY IF EXISTS "Public read document_templates" ON document_templates;
-- CREATE POLICY "Public read document_templates" ON document_templates FOR SELECT USING (true);

-- Indexy
CREATE INDEX IF NOT EXISTS idx_document_templates_building ON document_templates(building_id);
CREATE INDEX IF NOT EXISTS idx_document_templates_is_global ON document_templates(is_global);

-- Ukázková globální šablona (volitelně)
-- INSERT INTO document_templates (name, body, help_text, is_global)
-- VALUES ('Hlasovací listina – výchozí', '<h1>Hlasování: {{vote.title}}</h1>\n{{#questions}}<p>{{index}}. {{question.text}}</p>{{/questions}}', 'Blok {{#questions}} iteruje otázky.', true);
