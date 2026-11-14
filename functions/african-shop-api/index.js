const DATABASE_ID = 'african_shop_db';
const BUCKET_ID = 'african_shop_media';

class HttpError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const clean = (value, max) => String(value ?? '').trim().slice(0, max);
const id = () => crypto.randomUUID();
const permission = (action, userId) => `${action}("user:${userId}")`;
const publicRead = 'read("any")';

function bodyOf(req) {
  const raw = req.body;
  if (typeof raw === 'string') {
    if (!raw.trim()) return {};
    try { return JSON.parse(raw); } catch { throw new HttpError('Corps JSON invalide.', 400); }
  }
  if (raw && typeof raw === 'object') return raw;
  return {};
}

function queryString(queries, limit = 100) {
  const params = new URLSearchParams();
  for (const query of queries) params.append('queries[]', JSON.stringify(query));
  params.set('limit', String(limit));
  params.set('total', 'false');
  return params.toString();
}

async function appwriteRequest(ctx, path, method = 'GET', payload) {
  const response = await fetch(`${ctx.endpoint}${path}`, {
    method,
    headers: {
      'X-Appwrite-Project': ctx.projectId,
      'X-Appwrite-Key': ctx.apiKey,
      ...(payload === undefined ? {} : { 'Content-Type': 'application/json' })
    },
    ...(payload === undefined ? {} : { body: JSON.stringify(payload) })
  });
  const raw = await response.text();
  let data = {};
  try { data = raw ? JSON.parse(raw) : {}; } catch { data = { message: raw }; }
  if (!response.ok) {
    throw new HttpError(data.message || `Erreur Appwrite ${response.status}.`, response.status);
  }
  return data;
}

const tablePath = table => `/tablesdb/${DATABASE_ID}/tables/${table}/rows`;

async function listRows(ctx, table, queries = [], limit = 100) {
  return appwriteRequest(ctx, `${tablePath(table)}?${queryString(queries, limit)}`);
}

async function getRow(ctx, table, rowId) {
  return appwriteRequest(ctx, `${tablePath(table)}/${encodeURIComponent(rowId)}`);
}

async function createRow(ctx, table, data, permissions, rowId = id()) {
  return appwriteRequest(ctx, tablePath(table), 'POST', { rowId, data, permissions });
}

async function updateRow(ctx, table, rowId, data, permissions) {
  return appwriteRequest(ctx, `${tablePath(table)}/${encodeURIComponent(rowId)}`, 'PATCH', { data, permissions });
}

async function currentUser(ctx, headers) {
  const jwt = headers['x-appwrite-user-jwt'];
  if (!jwt) throw new HttpError('Connexion requise.', 401);
  const response = await fetch(`${ctx.endpoint}/account`, {
    headers: { 'X-Appwrite-Project': ctx.projectId, 'X-Appwrite-JWT': jwt }
  });
  const raw = await response.text();
  let user = {};
  try { user = raw ? JSON.parse(raw) : {}; } catch {}
  if (!response.ok || !user.$id) throw new HttpError('Session invalide ou expirée.', 401);
  return user;
}

async function findProfile(ctx, user) {
  const field = user.email ? 'email' : user.phone ? 'phone' : null;
  const value = user.email || user.phone;
  if (!field || !value) throw new HttpError('Le compte doit avoir une adresse e-mail ou un téléphone.', 400);
  const result = await listRows(ctx, 'profiles', [{ method: 'equal', attribute: field, values: [value] }], 2);
  return result.rows?.[0] || null;
}

async function ensureProfile(ctx, user) {
  let profile = await findProfile(ctx, user);
  if (!profile) {
    profile = await createRow(ctx, 'profiles', {
      email: user.email || '',
      phone: user.phone || '',
      display_name: user.name || '',
      role: 'customer',
      created_at: new Date().toISOstring()
    }, [permission('read', user.$id)]);
  }
  return profile;
}

async function requireAdmin(ctx, user) {
  const profile = await findProfile(ctx, user);
  if (!profile || profile.role !== 'admin') throw new HttpError('Accès réservé à l’administration.', 403);
  return profile;
}

function ownerPermissions(existing, ownerId, makePublic) {
  const perms = (Array.isArray(existing) ? existing : []).filter(value =>
    value !== publicRead && value !== permission('update', ownerId) &&
    value !== permission('read', ownerId) && value !== permission('delete', ownerId)
  );
  perms.push(permission('read', ownerId), permission('delete', ownerId));
  if (makePublic) perms.push(publicRead);
  return [...new Set(perms)];
}

async function setFileVisibility(ctx, fileId, ownerId, makePublic) {
  if (!fileId || typeof fileId !== 'string') return;
  const path = `/storage/buckets/${BUCKET_ID}/files/${encodeURIComponent(fileId)}`;
  const file = await appwriteRequest(ctx, path);
  const permissions = ownerPermissions(file.$permissions, ownerId, makePublic);
  await appwriteRequest(ctx, path, 'PATCH', { permissions });
}

function slugify(value, suffix) {
  const slug = String(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 160);
  return `${slug || 'boutique'}-${suffix.slice(0, 5)}`;
}

async function handle({ req, res, log, error }) {
  try {
    const endpoint = process.env.APPWRITE_FUNCTION_API_ENDPOINT;
    const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
    const headers = Object.fromEntries(Object.entries(req.headers || {}).map(([key, value]) => [key.toLowerCase(), value]));
    const apiKey = headers['x-appwrite-key'];
    if (!endpoint || !projectId || !apiKey) throw new HttpError('Configuration serveur Appwrite incomplète.', 500);
    const ctx = { endpoint: endpoint.replace(/\/$/, ''), projectId, apiKey };
    const method = String(req.method || 'GET').toUpperCase();
    const path = String(req.path || '/').split('?')[0];
    const body = bodyOf(req);

    const user = await currentUser(ctx, headers);

    if (path === '/profile/ensure' && method === 'POST') {
      const profile = await ensureProfile(ctx, user);
      return res.json({ profile: { $id: profile.$id, role: profile.role, display_name: profile.display_name || '' } });
    }

    if (path === '/shops/create' && method === 'POST') {
      const name = clean(body.name, 160);
      const city = clean(body.city, 100);
      if (!name || !city) throw new HttpError('Le nom de la boutique et la ville sont obligatoires.', 400);
      const shopId = id();
      const shop = await createRow(ctx, 'shops', {
        owner_id: user.$id,
        name,
        slug: slugify(name, shopId),
        category: clean(body.category, 80),
        city,
        district: clean(body.district, 120),
        whatsapp_number: clean(body.whatsapp_number, 24),
        description: clean(body.description, 2000),
        status: 'pending',
        created_at: new Date().toISOString()
      }, [permission('read', user.$id), permission('delete', user.$id)], shopId);
      return res.json({ shop }, 201);
    }

    if (path === '/shops/update' && method === 'POST') {
      const shopId = clean(body.shop_id, 36);
      if (!shopId) throw new HttpError('Identifiant de boutique manquant.', 400);
      const shop = await getRow(ctx, 'shops', shopId);
      if (shop.owner_id !== user.$id) throw new HttpError('Cette boutique ne t’appartient pas.', 403);
      const data = {};
      if (body.name !== undefined) data.name = clean(body.name, 160);
      if (body.category !== undefined) data.category = clean(body.category, 80);
      if (body.city !== undefined) data.city = clean(body.city, 100);
      if (body.district !== undefined) data.district = clean(body.district, 120);
      if (body.whatsapp_number !== undefined) data.whatsapp_number = clean(body.whatsapp_number, 24);
      if (body.description !== undefined) data.description = clean(body.description, 2000);
      if (body.logo_file_id !== undefined) data.logo_file_id = clean(body.logo_file_id, 36);
      if (body.cover_file_id !== undefined) data.cover_file_id = clean(body.cover_file_id, 36);
      if (data.name !== undefined && !data.name) throw new HttpError('Le nom de la boutique est obligatoire.', 400);
      if (data.city !== undefined && !data.city) throw new HttpError('La ville est obligatoire.', 400);
      if (data.name !== undefined) data.slug = slugify(data.name, shop.$id);
      if (shop.status === 'active') {
        if (data.logo_file_id) await setFileVisibility(ctx, data.logo_file_id, user.$id, true);
        if (data.cover_file_id) await setFileVisibility(ctx, data.cover_file_id, user.$id, true);
      }
      const updated = await updateRow(ctx, 'shops', shopId, data, ownerPermissions(shop.$permissions, user.$id, shop.status === 'active'));
      return res.json({ shop: updated });
    }

    if (path === '/products/create' && method === 'POST') {
      const shopId = clean(body.shop_id, 36);
      const title = clean(body.title, 180);
      const price = Number(body.price_fcfa);
      const stock = Number(body.stock_quantity ?? 0);
      if (!shopId || !title || !Number.isSafeInteger(price) || price < 1 || !Number.isSafeInteger(stock) || stock < 0) {
        throw new HttpError('Informations du produit invalides.', 400);
      }
      const shop = await getRow(ctx, 'shops', shopId);
      if (shop.owner_id !== user.$id) throw new HttpError('Cette boutique ne t’appartient pas.', 403);
      const media = Array.isArray(body.media_file_ids) ? body.media_file_ids.filter(x => typeof x === 'string').slice(0, 12) : [];
      const product = await createRow(ctx, 'products', {
        shop_id: shopId,
        title,
        description: clean(body.description, 4000),
        price_fcfa: price,
        stock_quantity: stock,
        status: 'pending',
        category: clean(body.category, 80),
        image_file_id: clean(body.image_file_id || media[0] || '', 36),
        media_file_ids: media,
        created_at: new Date().toISOString()
      }, [permission('read', user.$id), permission('delete', user.$id)]);
      return res.json({ product }, 201);
    }

    if (path === '/moderation/queue' && method === 'GET') {
      await requireAdmin(ctx, user);
      const [shops, products] = await Promise.all([
        listRows(ctx, 'shops', [{ method: 'equal', attribute: 'status', values: ['pending'] }], 100),
        listRows(ctx, 'products', [{ method: 'equal', attribute: 'status', values: ['pending'] }], 100)
      ]);
      return res.json({
        shops: (shops.rows || []).map(x => ({ $id: x.$id, name: x.name, city: x.city, category: x.category, owner_id: x.owner_id, created_at: x.created_at })),
        products: (products.rows || []).map(x => ({ $id: x.$id, title: x.title, price_fcfa: x.price_fcfa, shop_id: x.shop_id, status: x.status, created_at: x.created_at }))
      });
    }

    if (path === '/moderation/approve' && method === 'POST') {
      await requireAdmin(ctx, user);
      const type = body.type;
      const action = body.action;
      const rowId = clean(body.id, 36);
      if (!['shop', 'product'].includes(type) || !['approve', 'reject'].includes(action) || !rowId) {
        throw new HttpError('Action de modération invalide.', 400);
      }
      const table = type === 'shop' ? 'shops' : 'products';
      const row = await getRow(ctx, table, rowId);
      const ownerId = type === 'shop' ? row.owner_id : (await getRow(ctx, 'shops', row.shop_id)).owner_id;
      if (type === 'product' && action === 'approve') {
        const shop = await getRow(ctx, 'shops', row.shop_id);
        if (shop.status !== 'active') throw new HttpError('La boutique doit être validée avant ses produits.', 409);
      }
      const makePublic = action === 'approve';
      const fileIds = type === 'shop'
        ? [row.logo_file_id, row.cover_file_id]
        : [...(Array.isArray(row.media_file_ids) ? row.media_file_ids : []), row.image_file_id];
      for (const fileId of [...new Set(fileIds.filter(Boolean))]) await setFileVisibility(ctx, fileId, ownerId, makePublic);
      const updated = await updateRow(ctx, table, rowId, { status: makePublic ? 'active' : 'rejected' }, ownerPermissions(row.$permissions, ownerId, makePublic));
      return res.json({ item: updated, status: updated.status });
    }

    throw new HttpError('Route introuvable.', 404);
  } catch (err) {
    const status = Number(err.status) || 500;
    if (typeof error === 'function') error(err.stack || err.message || String(err));
    const message = status >= 500 && !(err instanceof HttpError)
      ? 'Erreur interne du service African Shop.'
      : (err.message || 'Requête impossible.');
    return res.json({ error: message }, status);
  }
}

export default handle;
