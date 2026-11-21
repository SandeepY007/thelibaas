function config() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url: `${url.replace(/\/$/, '')}/rest/v1/products`, key };
}

async function supabase(path = '', options = {}) {
  const cfg = config();
  if (!cfg) throw new Error('Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in Vercel project settings.');
  const response = await fetch(`${cfg.url}${path}`, {
    ...options,
    headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}`, 'Content-Type': 'application/json', ...options.headers }
  });
  if (!response.ok) throw new Error(`Product storage returned ${response.status}.`);
  return response.status === 204 ? null : response.json();
}

export default async function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') {
      const rows = await supabase('?select=*&order=id.asc');
      return res.status(200).json(rows);
    }
    if (req.method === 'POST' || req.method === 'DELETE') {
      const expected = process.env.ADMIN_TOKEN;
      if (!expected) return res.status(503).json({ error: 'Set ADMIN_TOKEN in Vercel project settings.' });
      if (req.headers['x-admin-token'] !== expected) return res.status(401).json({ error: 'Sign in to manage products.' });
    }
    if (req.method === 'POST') {
      const product = req.body;
      if (!product?.name || !product?.category || !Number.isFinite(Number(product.price))) return res.status(400).json({ error: 'Add a name, category, and price.' });
      const row = { id: Number(product.id), name: product.name, category: product.category, price: Number(product.price), oldPrice: product.oldPrice ? Number(product.oldPrice) : null, tag: product.tag || null, rating: Number(product.rating) || 0, reviews: Number(product.reviews) || 0, image: product.image, description: product.description || '' };
      const rows = await supabase('?on_conflict=id', { method: 'POST', headers: { Prefer: 'resolution=merge-duplicates,return=representation' }, body: JSON.stringify(row) });
      return res.status(200).json(rows[0]);
    }
    if (req.method === 'DELETE') {
      if (!req.query?.id) return res.status(400).json({ error: 'Product id is required.' });
      await supabase(`?id=eq.${encodeURIComponent(req.query.id)}`, { method: 'DELETE', headers: { Prefer: 'return=minimal' } });
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed.' });
  } catch (error) {
    return res.status(503).json({ error: error.message || 'Product storage is not available.' });
  }
}
