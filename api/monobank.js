export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'Method not allowed' }); return; }

  try {
    let body = req.body;
    if (typeof body === 'string') body = JSON.parse(body);

    const { token, amount, orderId, description, redirectUrl, name } = body;

    const r = await fetch('https://api.monobank.ua/api/merchant/invoice/create', {
      method: 'POST',
      headers: {
        'X-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amount * 100, // в копійках
        ccy: 980, // UAH
        merchantPaymInfo: {
          reference: orderId,
          destination: description || 'Абонемент',
          basketOrder: [{ name: name || description, qty: 1, sum: amount * 100, unit: 'шт' }]
        },
        redirectUrl: redirectUrl
      })
    });

    const data = await r.json();
    res.status(200).json(data);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
