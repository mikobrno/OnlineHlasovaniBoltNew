// SUPABASE CONNECTION TEST
// Otevřete browser console a spusťte tento kód pro test připojení

const SUPABASE_URL = 'https://dcivvmtxrdmywkaolyld.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaXZ2bXR4cmRteXdrYW9seWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzMjQ5MDEsImV4cCI6MjA2OTkwMDkwMX0.mxfAQsxzKnCj-8IcxzPv4c1AlmM2YtOJ-d1WXTMHM8A';

// Test 1: Základní ping
fetch(SUPABASE_URL + '/rest/v1/', {
  headers: {
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Ping test:', response.status, response.statusText);
  return response.text();
})
.then(data => console.log('Ping response:', data))
.catch(err => console.error('Ping error:', err));

// Test 2: Načtení tabulek
fetch(SUPABASE_URL + '/rest/v1/buildings?select=*', {
  headers: {
    'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Buildings test:', response.status, response.statusText);
  return response.json();
})
.then(data => console.log('Buildings data:', data))
.catch(err => console.error('Buildings error:', err));
