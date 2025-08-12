// Vercel serverless function to forward contact form to Telegram bots
// Save as /api/sendMessage.js
// NOTE: tokens are included here so the function works immediately.
// Recommended: replace with environment variables (see notes below).

const TELEGRAM_TARGETS = [
  // Bot 1
  { token: '8031827358:AAFRRr4Yy3gtirAQ08RqvCfV5V2VnqAESxA', chat_id: '7881015762' },
  // Bot 2
  { token: '8361906173:AAGxE1OrAq9mEYz96Cro_ATxBauX6ghl0mo', chat_id: '1716902346' }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success:false, error:'Method not allowed' });
    return;
  }
  try {
    const { name, email,telegrm, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ success:false, error:'Missing fields' });
      return;
    }

    // encode line breaks with %0A so Telegram displays new lines correctly in GET; here we use JSON body with parse_mode.
    const text = `<b>New inquiry — CrackAlgo</b>\n<b>Name:</b> ${escapeHtml(name)}\n<b>Email:</b> ${escapeHtml(email)}\n<b>Telegram:</b> ${escapeHtml(telegrm)}\n<b>Message:</b> ${escapeHtml(message)}\n<b>Made by urSTARK.t.me</b>`;

    const results = await Promise.all(TELEGRAM_TARGETS.map(async t => {
      const url = `https://api.telegram.org/bot${t.token}/sendMessage`;
      const body = { chat_id: t.chat_id, text, parse_mode: 'HTML' };
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const j = await r.json();
      return j;
    }));

    const okCount = results.reduce((s, r) => s + (r && r.ok ? 1 : 0), 0);
    res.status(200).json({ success: okCount > 0, sent: okCount, total: TELEGRAM_TARGETS.length, results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success:false, error: String(err) });
  }
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, (m)=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]) );
}
