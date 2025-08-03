// Test Supabase pripojeni
import { supabase } from './src/lib/supabaseClient.js';

async function testConnection() {
  console.log('🔍 Testování připojení k Supabase...');
  
  try {
    // Test základního připojení
    const { data, error } = await supabase.from('buildings').select('count');
    
    if (error) {
      console.error('❌ Chyba připojení k databázi:');
      console.error('Kód:', error.code);
      console.error('Zpráva:', error.message);
      console.error('Detaily:', error.details);
      
      if (error.code === '42P01') {
        console.log('\n💡 Řešení: Tabulka "buildings" neexistuje.');
        console.log('   Spusťte SQL schema v Supabase dashboard.');
        console.log('   Více informací v DATABASE_SETUP.md');
      } else if (error.code === 'PGRST116') {
        console.log('\n💡 Řešení: Problém s autorizací nebo RLS policies.');
        console.log('   Zkontrolujte schema.sql a RLS nastavení.');
      }
    } else {
      console.log('✅ Připojení k databázi úspěšné!');
      console.log('📊 Počet budov v databázi:', data);
    }
  } catch (err) {
    console.error('❌ Neočekávaná chyba:', err.message);
  }
}

testConnection();
