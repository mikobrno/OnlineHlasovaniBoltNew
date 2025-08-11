// Rychlý test Supabase připojení
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://dcivvmtxrdmywkaolyld.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaXZ2bXR4cmRteXdrYW9seWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjQ5MDEsImV4cCI6MjA2OTkwMDkwMX0.mxfAQsxzKnCj-8IcxzPv4c1AlmM2YtOJ-d1WXTMHM8A';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('Testing Supabase connection...');
    
    const { data, error } = await supabase
      .from('buildings')
      .select('*');
    
    if (error) {
      console.error('Error:', error);
    } else {
      console.log('Success! Buildings found:', data);
    }
  } catch (err) {
    console.error('Connection error:', err);
  }
}

testConnection();
