// Vložte tento kód do konzole browseru na stránce localhost:3001
// Pro testování Supabase připojení

const testSupabaseAPI = async () => {
  const SUPABASE_URL = 'https://dcivvmtxrdmywkaolyld.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjaXZ2bXR4cmRteXdrYW9seWxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3MDg3ODQsImV4cCI6MjA0OTI4NDc4NH0.Q0Qz_x6JQhxNuNSzKoNZQ4H2f0X2E5kF79r3zKa6PbQ';
  
  console.log('🔍 Testing Supabase API connection...');
  
  try {
    console.log('📡 Sending request to:', `${SUPABASE_URL}/rest/v1/buildings`);
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/buildings`, {
      method: 'GET',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ SUCCESS! Buildings data:', data);
      return { success: true, data };
    } else {
      const errorText = await response.text();
      console.error('❌ HTTP Error:', response.status, errorText);
      return { success: false, error: `HTTP ${response.status}: ${errorText}` };
    }
  } catch (error) {
    console.error('❌ Network Error:', error);
    return { success: false, error: error.message };
  }
};

// Spustit test
testSupabaseAPI().then(result => {
  console.log('🎯 Final result:', result);
});

console.log('📋 Test script loaded. Results will appear above.');
