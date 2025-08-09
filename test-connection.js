// Test connection to Supabase
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://nehlqaoqmhdvyncvizcc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5laGxxYW9xbWhkdnluY3ZpemNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQwNzY1OTEsImV4cCI6MjA2OTY1MjU5MX0.poCWT_JCWnP5t0FvQjk3-VLKRE2o59EvBq7GoPcwRao';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    // Test basic connection by trying to query buildings table
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Chyba při dotazu:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
      console.log('Úspěšné připojení!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Network error:', err);
  }
}

testConnection();
