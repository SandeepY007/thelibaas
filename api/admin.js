export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const expected = process.env.ADMIN_TOKEN;
  if (!expected) return res.status(503).json({ error: 'Set ADMIN_TOKEN in Vercel project settings.' });
  if (req.body?.token !== expected) return res.status(401).json({ error: 'Invalid shop key.' });
  return res.status(200).json({ ok: true });
}
