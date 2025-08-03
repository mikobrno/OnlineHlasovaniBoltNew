-- MINIMAL TEST - pouze nejjednodušší příkazy

-- Zapnutí RLS
ALTER DATABASE postgres SET row_security = on;

-- Test 1: vytvoření jedné tabulky
CREATE TABLE IF NOT EXISTS test_table (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Test úspěchu
SELECT 'Test tabulka vytvořena' as status;
