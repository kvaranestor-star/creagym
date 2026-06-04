export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('body:', JSON.stringify(req.body));
    const { phone, message, token, sender } = req.body;
    console.log('token:', token);

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
    console.log('turbosms:', JSON.stringify(data));
    res.status(200).json(data);
  } catch(e) {
    res.status(500).json({ error: e.message });
  }
}
