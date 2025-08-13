// Simple local test to send SMS via Netlify function
// Usage: node test-sms.js [phoneNumber] [message]

const endpoint = process.env.SMS_FN_URL || 'http://localhost:8888/.netlify/functions/sms';
const phone = process.argv[2] || '777338203';
const message = process.argv[3] || 'Test SMS z OnlineSprava';

async function main() {
  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'send_sms', phoneNumber: phone, message })
    });
    const data = await res.json().catch(() => ({}));
    console.log('[TEST SMS] status', res.status);
    console.log('[TEST SMS] response', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[TEST SMS] error', err?.message || String(err));
  }
}

main();
