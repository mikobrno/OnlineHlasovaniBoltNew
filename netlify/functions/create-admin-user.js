// netlify/functions/create-admin-user.js
// Secure one-off bootstrap function to create an admin user in Supabase Auth
// Protection: requires header X-Setup-Token matching process.env.SETUP_TOKEN
// Env required:
// - SUPABASE_URL (same as VITE_SUPABASE_URL)
// - SUPABASE_SERVICE_ROLE_KEY (Supabase service role key; KEEP SECRET)
// - SETUP_TOKEN (random secret to authorize this endpoint)

const { createClient } = require('@supabase/supabase-js');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,X-Setup-Token',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Method Not Allowed' }),
    };
  }

  const setupToken = event.headers['x-setup-token'] || event.headers['X-Setup-Token'] || event.headers['x-setup-token'];
  if (!process.env.SETUP_TOKEN || setupToken !== process.env.SETUP_TOKEN) {
    return {
      statusCode: 403,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Forbidden' }),
    };
  }

  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!SUPABASE_URL || !SERVICE_ROLE) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: 'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY' }),
    };
  }

  const adminClient = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  try {
    const { email = 'admin@onlinesprava.cz', password = 'admin123' } = JSON.parse(event.body || '{}');

    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'admin', created_by: 'bootstrap' },
    });

    if (error) {
      const alreadyExists = (error.message || '').toLowerCase().includes('user already registered') || error.status === 422;
      if (alreadyExists) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          body: JSON.stringify({ success: true, note: 'User already exists', email }),
        };
      }
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ success: false, error: error.message }),
      };
    }

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
      body: JSON.stringify({ success: true, email: data.user?.email, id: data.user?.id }),
    };
  } catch (e) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ success: false, error: e.message || 'Unknown error' }),
    };
  }
};
