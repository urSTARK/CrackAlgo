// Vercel serverless function to forward contact form to Telegram bots
// Path: /api/sendMessage.js
// NOTE: Tokens are placed here so it works on first deploy.
// Recommended: use Vercel Environment Variables and read process.env.* instead.

const TELEGRAM_TARGETS = [
  { token: '8031827358:AAFRRr4Yy3gtirAQ08RqvCfV5V2VnqAESxA', chat_id: '7881015762' },
  { token: '8494844734:AAH52mZzg3tzFrzdX6Zb1aaeXeBAJqEj-Lo', chat_id: '5122043113' }
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success:false, error:'Method not allowed' });
    return;
  }
  try {
    const { name, email, telegram, message } = req.body || {};
    if (!name || !email || !message) {
      res.status(400).json({ success:false, error:'Missing fields' });
      return;
    }

    // Build message
    const text = `<b>New inquiry — CrackAlgo</b>\n\n<b>Name:</b> ${escapeHtml(name)}\n<b>Email:</b> ${escapeHtml(email)}\n<b>Telegram:</b> ${escapeHtml(telegram)}\n<b>Message:</b> ${escapeHtml(message)}\n\n<b>Made by @Umgxero</b>`;

    // Send to all targets
    const fetchPromises = TELEGRAM_TARGETS.map(async t => {
      const url = `https://api.telegram.org/bot${t.token}/sendMessage`;
      const body = { chat_id: t.chat_id, text, parse_mode: 'HTML' };
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const j = await r.json();
      return j;
    });

    const results = await Promise.all(fetchPromises);
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
