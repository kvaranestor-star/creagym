export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { phone, message, token, sender } = req.body;

  const r = await fetch('https://api.turbosms.ua/message/send.json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      token,
      recipients: [phone],
      sms: { sender: sender || 'CREAGYM', text: message }
    })
  });

  const data = await r.json();
  return res.status(200).json(data);
}
