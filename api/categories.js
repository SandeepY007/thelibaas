function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: `${url.replace(/\/$/, '')}/rest/v1/categories`, key };
}

async function request(path, options = {}) {
  const cfg = config();
  if (!cfg) throw new Error('Add Supabase settings in Vercel project settings.');
  const response = await fetch(`${cfg.url}${path}`, {
    ...options,
    headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json', ...options.headers }
  });
  if (!response.ok) throw new Error(`Category storage returned ${response.status}.`);
  return response.status === 204 ? null : response.json();
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') return res.status(200).json(await request('?select=name&order=name.asc'));
    if (req.method === 'POST') {
      const expected = process.env.ADMIN_TOKEN;
      if (!expected) return res.status(503).json({ error: 'Set ADMIN_TOKEN in Vercel project settings.' });
      if (req.headers['x-admin-token'] !== expected) return res.status(401).json({ error: 'Sign in to manage categories.' });
      const name = String(req.body?.name || '').trim();
      if (!name || name.length > 60) return res.status(400).json({ error: 'Enter a category name up to 60 characters.' });
      const rows = await request('?on_conflict=name', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify({ name }) });
      return res.status(200).json(rows[0]);
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    return res.status(503).json({ error: error.message || 'Category storage is not available.' });
  }
}
