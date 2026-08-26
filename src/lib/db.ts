import mysql from 'mysql2/promise';
import { Product, User, Order, WithdrawalRequest, StoreSettings, OrderStatus, WithdrawalStatus, SupportMessage, SupportMessageStatus } from './types';

// MySQL Connection Pool
let pool: mysql.Pool | null = null;

export function getMySQLPool(): mysql.Pool {
  if (pool) return pool;
  const url = process.env.DATABASE_URL || 'mysql://root:@localhost:3306/blackora';
  pool = mysql.createPool({
    uri: url,
    waitForConnections: true,
    connectionLimit: 15,
    queueLimit: 0,
    enableKeepAlive: true,
  });
  return pool;
}

// ---------------- PRODUCTS (100% Direct MySQL) ----------------
export async function getProducts(): Promise<Product[]> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM products ORDER BY createdAt DESC');
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    tagline: r.tagline || '',
    description: r.description || '',
    category: r.category,
    price: Number(r.price),
    originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
    stock: Number(r.stock || 0),
    commissionAmount: Number(r.commissionAmount || 200),
    images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : r.images || [],
    specs: typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : r.specs || {},
    featured: Boolean(r.featured),
    bestSeller: Boolean(r.bestSeller),
    isNewArrival: Boolean(r.isNewArrival),
    rating: Number(r.rating || 5.0),
    reviewCount: Number(r.reviewCount || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getPublicProducts(): Promise<Omit<Product, 'stock' | 'commissionAmount'>[]> {
  const products = await getProducts();
  return products.map(({ stock: _stock, commissionAmount: _comm, ...rest }) => rest);
}

export async function getProductById(id: string): Promise<Product | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM products WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    tagline: r.tagline || '',
    description: r.description || '',
    category: r.category,
    price: Number(r.price),
    originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
    stock: Number(r.stock || 0),
    commissionAmount: Number(r.commissionAmount || 200),
    images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : r.images || [],
    specs: typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : r.specs || {},
    featured: Boolean(r.featured),
    bestSeller: Boolean(r.bestSeller),
    isNewArrival: Boolean(r.isNewArrival),
    rating: Number(r.rating || 5.0),
    reviewCount: Number(r.reviewCount || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM products WHERE slug = ? LIMIT 1', [slug]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    tagline: r.tagline || '',
    description: r.description || '',
    category: r.category,
    price: Number(r.price),
    originalPrice: r.originalPrice ? Number(r.originalPrice) : undefined,
    stock: Number(r.stock || 0),
    commissionAmount: Number(r.commissionAmount || 200),
    images: typeof r.images === 'string' ? JSON.parse(r.images || '[]') : r.images || [],
    specs: typeof r.specs === 'string' ? JSON.parse(r.specs || '{}') : r.specs || {},
    featured: Boolean(r.featured),
    bestSeller: Boolean(r.bestSeller),
    isNewArrival: Boolean(r.isNewArrival),
    rating: Number(r.rating || 5.0),
    reviewCount: Number(r.reviewCount || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const p = getMySQLPool();
  const id = 'prod-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const now = new Date();

  await p.query(
    `INSERT INTO products (id, name, slug, tagline, description, category, price, originalPrice, stock, commissionAmount, images, specs, featured, bestSeller, isNewArrival, rating, reviewCount, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.slug,
      data.tagline || '',
      data.description || '',
      data.category,
      data.price,
      data.originalPrice || null,
      data.stock || 0,
      data.commissionAmount || 200,
      JSON.stringify(data.images || []),
      JSON.stringify(data.specs || {}),
      data.featured ? 1 : 0,
      data.bestSeller ? 1 : 0,
      data.isNewArrival ? 1 : 0,
      data.rating || 5.0,
      data.reviewCount || 0,
      now,
      now,
    ]
  );

  return {
    ...data,
    id,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
  const existing = await getProductById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates, updatedAt: new Date().toISOString() };
  const p = getMySQLPool();

  await p.query(
    `UPDATE products SET name=?, slug=?, tagline=?, description=?, category=?, price=?, originalPrice=?, stock=?, commissionAmount=?, images=?, specs=?, featured=?, bestSeller=?, isNewArrival=?, updatedAt=?
     WHERE id=?`,
    [
      merged.name,
      merged.slug,
      merged.tagline || '',
      merged.description || '',
      merged.category,
      merged.price,
      merged.originalPrice || null,
      merged.stock || 0,
      merged.commissionAmount || 200,
      JSON.stringify(merged.images || []),
      JSON.stringify(merged.specs || {}),
      merged.featured ? 1 : 0,
      merged.bestSeller ? 1 : 0,
      merged.isNewArrival ? 1 : 0,
      new Date(),
      id,
    ]
  );

  return merged;
}

export async function deleteProduct(id: string): Promise<boolean> {
  const p = getMySQLPool();
  const [res]: any = await p.query('DELETE FROM products WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

// ---------------- USERS (100% Direct MySQL) ----------------
export async function getUsers(): Promise<User[]> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM users ORDER BY createdAt DESC');
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.passwordHash,
    phone: r.phone || '',
    role: r.role || 'customer',
    referralCode: r.referralCode,
    isSeller: Boolean(r.isSeller),
    walletBalance: Number(r.walletBalance || 0),
    pendingBalance: Number(r.pendingBalance || 0),
    totalEarned: Number(r.totalEarned || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getUserById(id: string): Promise<User | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM users WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.passwordHash,
    phone: r.phone || '',
    role: r.role || 'customer',
    referralCode: r.referralCode,
    isSeller: Boolean(r.isSeller),
    walletBalance: Number(r.walletBalance || 0),
    pendingBalance: Number(r.pendingBalance || 0),
    totalEarned: Number(r.totalEarned || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM users WHERE LOWER(email) = LOWER(?) LIMIT 1', [email.trim()]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.passwordHash,
    phone: r.phone || '',
    role: r.role || 'customer',
    referralCode: r.referralCode,
    isSeller: Boolean(r.isSeller),
    walletBalance: Number(r.walletBalance || 0),
    pendingBalance: Number(r.pendingBalance || 0),
    totalEarned: Number(r.totalEarned || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function getUserByReferralCode(code: string): Promise<User | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM users WHERE UPPER(referralCode) = UPPER(?) LIMIT 1', [code.trim()]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    passwordHash: r.passwordHash,
    phone: r.phone || '',
    role: r.role || 'customer',
    referralCode: r.referralCode,
    isSeller: Boolean(r.isSeller),
    walletBalance: Number(r.walletBalance || 0),
    pendingBalance: Number(r.pendingBalance || 0),
    totalEarned: Number(r.totalEarned || 0),
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  };
}

export async function createUser(data: { name: string; email: string; passwordHash: string; phone?: string }): Promise<User> {
  const cleanEmail = data.email.toLowerCase().trim();
  const existing = await getUserByEmail(cleanEmail);
  if (existing) {
    throw new Error('User with this email already exists.');
  }

  const nameSnippet = data.name.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 4) || 'USER';
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const referralCode = `BLK-${nameSnippet}${randomSuffix}`;
  const id = 'user-' + Date.now();
  const now = new Date();

  const p = getMySQLPool();
  await p.query(
    `INSERT INTO users (id, name, email, passwordHash, phone, role, referralCode, isSeller, walletBalance, pendingBalance, totalEarned, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, 'customer', ?, 0, 0, 0, 0, ?, ?)`,
    [id, data.name, cleanEmail, data.passwordHash, data.phone || '', referralCode, now, now]
  );

  return {
    id,
    name: data.name,
    email: cleanEmail,
    passwordHash: data.passwordHash,
    phone: data.phone || '',
    role: 'customer',
    referralCode,
    isSeller: false,
    walletBalance: 0,
    pendingBalance: 0,
    totalEarned: 0,
    createdAt: now.toISOString(),
  };
}

export async function updateUser(id: string, updates: Partial<User>): Promise<User | null> {
  const existing = await getUserById(id);
  if (!existing) return null;

  const merged = { ...existing, ...updates };
  const p = getMySQLPool();

  await p.query(
    `UPDATE users SET name=?, phone=?, role=?, isSeller=?, walletBalance=?, pendingBalance=?, totalEarned=?, updatedAt=?
     WHERE id=?`,
    [
      merged.name,
      merged.phone || '',
      merged.role,
      merged.isSeller ? 1 : 0,
      merged.walletBalance,
      merged.pendingBalance,
      merged.totalEarned,
      new Date(),
      id,
    ]
  );

  return merged;
}

// ---------------- ORDERS (100% Direct MySQL) ----------------
export async function getOrders(): Promise<Order[]> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM orders ORDER BY createdAt DESC');
  return rows.map((r) => ({
    id: r.id,
    orderNumber: r.orderNumber,
    userId: r.userId || undefined,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    customerPhone: r.customerPhone,
    city: r.city,
    address: r.address,
    postalCode: r.postalCode || undefined,
    notes: r.notes || undefined,
    items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : r.items || [],
    subtotal: Number(r.subtotal),
    deliveryCharge: Number(r.deliveryCharge),
    total: Number(r.total),
    paymentMethod: r.paymentMethod,
    paymentStatus: r.paymentStatus,
    transactionId: r.transactionId || undefined,
    referralCodeUsed: r.referralCodeUsed || undefined,
    referrerUserId: r.referrerUserId || undefined,
    totalCommissionEarned: Number(r.totalCommissionEarned || 0),
    commissionPaid: Boolean(r.commissionPaid),
    status: r.status,
    statusHistory: typeof r.statusHistory === 'string' ? JSON.parse(r.statusHistory || '[]') : r.statusHistory || [],
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getOrdersByUserId(userId: string): Promise<Order[]> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC', [userId]);
  return rows.map((r) => ({
    id: r.id,
    orderNumber: r.orderNumber,
    userId: r.userId || undefined,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    customerPhone: r.customerPhone,
    city: r.city,
    address: r.address,
    postalCode: r.postalCode || undefined,
    notes: r.notes || undefined,
    items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : r.items || [],
    subtotal: Number(r.subtotal),
    deliveryCharge: Number(r.deliveryCharge),
    total: Number(r.total),
    paymentMethod: r.paymentMethod,
    paymentStatus: r.paymentStatus,
    transactionId: r.transactionId || undefined,
    referralCodeUsed: r.referralCodeUsed || undefined,
    referrerUserId: r.referrerUserId || undefined,
    totalCommissionEarned: Number(r.totalCommissionEarned || 0),
    commissionPaid: Boolean(r.commissionPaid),
    status: r.status,
    statusHistory: typeof r.statusHistory === 'string' ? JSON.parse(r.statusHistory || '[]') : r.statusHistory || [],
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getOrderById(id: string): Promise<Order | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM orders WHERE id = ? OR orderNumber = ? LIMIT 1', [id, id]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    orderNumber: r.orderNumber,
    userId: r.userId || undefined,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    customerPhone: r.customerPhone,
    city: r.city,
    address: r.address,
    postalCode: r.postalCode || undefined,
    notes: r.notes || undefined,
    items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : r.items || [],
    subtotal: Number(r.subtotal),
    deliveryCharge: Number(r.deliveryCharge),
    total: Number(r.total),
    paymentMethod: r.paymentMethod,
    paymentStatus: r.paymentStatus,
    transactionId: r.transactionId || undefined,
    referralCodeUsed: r.referralCodeUsed || undefined,
    referrerUserId: r.referrerUserId || undefined,
    totalCommissionEarned: Number(r.totalCommissionEarned || 0),
    commissionPaid: Boolean(r.commissionPaid),
    status: r.status,
    statusHistory: typeof r.statusHistory === 'string' ? JSON.parse(r.statusHistory || '[]') : r.statusHistory || [],
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function trackOrders(query: string): Promise<Order[]> {
  const p = getMySQLPool();
  const clean = query.trim();
  const [rows] = await p.query<any[]>(
    'SELECT * FROM orders WHERE id = ? OR LOWER(orderNumber) = LOWER(?) OR LOWER(customerEmail) = LOWER(?) OR REPLACE(customerPhone, " ", "") = REPLACE(?, " ", "") ORDER BY createdAt DESC',
    [clean, clean, clean, clean]
  );
  return rows.map((r) => ({
    id: r.id,
    orderNumber: r.orderNumber,
    userId: r.userId || undefined,
    customerName: r.customerName,
    customerEmail: r.customerEmail,
    customerPhone: r.customerPhone,
    city: r.city,
    address: r.address,
    postalCode: r.postalCode || undefined,
    notes: r.notes || undefined,
    items: typeof r.items === 'string' ? JSON.parse(r.items || '[]') : r.items || [],
    subtotal: Number(r.subtotal),
    deliveryCharge: Number(r.deliveryCharge),
    total: Number(r.total),
    paymentMethod: r.paymentMethod,
    paymentStatus: r.paymentStatus,
    transactionId: r.transactionId || undefined,
    referralCodeUsed: r.referralCodeUsed || undefined,
    referrerUserId: r.referrerUserId || undefined,
    totalCommissionEarned: Number(r.totalCommissionEarned || 0),
    commissionPaid: Boolean(r.commissionPaid),
    status: r.status,
    statusHistory: typeof r.statusHistory === 'string' ? JSON.parse(r.statusHistory || '[]') : r.statusHistory || [],
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}


export async function createOrder(data: {
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  items: { productId: string; quantity: number }[];
  paymentMethod: 'cod' | 'easypaisa' | 'jazzcash';
  transactionId?: string;
  referralCode?: string;
}): Promise<Order> {
  const settings = await getSettings();
  const p = getMySQLPool();

  let subtotal = 0;
  let totalCommission = 0;
  const orderItems = [];

  for (const item of data.items) {
    const product = await getProductById(item.productId);
    if (!product) continue;

    const itemPrice = product.price;
    const itemCommission = product.commissionAmount || settings.defaultReferralReward || 200;
    subtotal += itemPrice * item.quantity;
    totalCommission += itemCommission * item.quantity;

    // Decrement stock in MySQL
    const newStock = Math.max(0, (product.stock || 0) - item.quantity);
    await p.query('UPDATE products SET stock = ? WHERE id = ?', [newStock, product.id]);

    orderItems.push({
      productId: product.id,
      name: product.name,
      price: itemPrice,
      quantity: item.quantity,
      image: product.images[0] || '',
      commissionAmount: itemCommission,
    });
  }

  if (orderItems.length === 0) {
    throw new Error('No valid products in cart.');
  }

  const deliveryCharge = subtotal >= settings.freeDeliveryThreshold ? 0 : settings.deliveryFee;
  const total = subtotal + deliveryCharge;

  let referrerUser: User | null = null;
  if (data.referralCode) {
    referrerUser = await getUserByReferralCode(data.referralCode);
  }

  const orderNumber = `BLK-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const id = 'ord-' + Date.now();

  const statusHistory = [
    {
      status: 'pending' as OrderStatus,
      timestamp: now.toISOString(),
      note: 'Order placed successfully.',
    }
  ];

  await p.query(
    `INSERT INTO orders (id, orderNumber, userId, customerName, customerEmail, customerPhone, city, address, postalCode, notes, items, subtotal, deliveryCharge, total, paymentMethod, paymentStatus, transactionId, referralCodeUsed, referrerUserId, totalCommissionEarned, commissionPaid, status, statusHistory, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      orderNumber,
      data.userId || null,
      data.customerName,
      data.customerEmail,
      data.customerPhone,
      data.city,
      data.address,
      data.postalCode || null,
      data.notes || null,
      JSON.stringify(orderItems),
      subtotal,
      deliveryCharge,
      total,
      data.paymentMethod,
      data.paymentMethod === 'cod' ? 'approved' : 'pending_verification',
      data.transactionId || null,
      referrerUser ? referrerUser.referralCode : null,
      referrerUser ? referrerUser.id : null,
      referrerUser ? totalCommission : 0,
      0,
      'pending',
      JSON.stringify(statusHistory),
      now,
      now,
    ]
  );

  // Increase pending balance for referrer
  if (referrerUser && totalCommission > 0) {
    const updatedPending = (referrerUser.pendingBalance || 0) + totalCommission;
    await p.query('UPDATE users SET pendingBalance = ? WHERE id = ?', [updatedPending, referrerUser.id]);
  }

  return {
    id,
    orderNumber,
    userId: data.userId,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    city: data.city,
    address: data.address,
    postalCode: data.postalCode,
    notes: data.notes,
    items: orderItems,
    subtotal,
    deliveryCharge,
    total,
    paymentMethod: data.paymentMethod,
    paymentStatus: data.paymentMethod === 'cod' ? 'approved' : 'pending_verification',
    transactionId: data.transactionId,
    referralCodeUsed: referrerUser ? referrerUser.referralCode : undefined,
    referrerUserId: referrerUser ? referrerUser.id : undefined,
    totalCommissionEarned: referrerUser ? totalCommission : 0,
    commissionPaid: false,
    status: 'pending',
    statusHistory,
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  paymentStatus?: 'pending_verification' | 'approved' | 'paid' | 'rejected',
  note?: string
): Promise<Order | null> {
  const order = await getOrderById(orderId);
  if (!order) return null;

  order.status = newStatus;
  if (paymentStatus) {
    order.paymentStatus = paymentStatus;
  }
  const now = new Date();
  order.updatedAt = now.toISOString();
  order.statusHistory.push({
    status: newStatus,
    timestamp: now.toISOString(),
    note: note || `Status updated to ${newStatus}`,
  });

  const p = getMySQLPool();

  // 1. Credit commission upon DELIVERED in MySQL
  if (newStatus === 'delivered' && !order.commissionPaid && order.referrerUserId && order.totalCommissionEarned > 0) {
    const referrer = await getUserById(order.referrerUserId);
    if (referrer) {
      const newWallet = (referrer.walletBalance || 0) + order.totalCommissionEarned;
      const newTotalEarned = (referrer.totalEarned || 0) + order.totalCommissionEarned;
      const newPending = Math.max(0, (referrer.pendingBalance || 0) - order.totalCommissionEarned);
      await p.query(
        'UPDATE users SET walletBalance = ?, pendingBalance = ?, totalEarned = ? WHERE id = ?',
        [newWallet, newPending, newTotalEarned, referrer.id]
      );
    }
    order.commissionPaid = true;
  }

  // 2. Remove pending if CANCELLED in MySQL
  if (newStatus === 'cancelled' && order.referrerUserId && !order.commissionPaid && order.totalCommissionEarned > 0) {
    const referrer = await getUserById(order.referrerUserId);
    if (referrer) {
      const newPending = Math.max(0, (referrer.pendingBalance || 0) - order.totalCommissionEarned);
      await p.query('UPDATE users SET pendingBalance = ? WHERE id = ?', [newPending, referrer.id]);
    }
  }

  // 3. Unlock SELLER status for buyer in MySQL upon delivery
  if (newStatus === 'delivered' && order.userId) {
    const buyer = await getUserById(order.userId);
    if (buyer && !buyer.isSeller) {
      await p.query('UPDATE users SET isSeller = 1 WHERE id = ?', [buyer.id]);
    }
  }

  await p.query(
    `UPDATE orders SET status=?, paymentStatus=?, commissionPaid=?, statusHistory=?, updatedAt=? WHERE id=?`,
    [order.status, order.paymentStatus, order.commissionPaid ? 1 : 0, JSON.stringify(order.statusHistory), now, order.id]
  );

  return order;
}

// ---------------- WITHDRAWALS (100% Direct MySQL) ----------------
export async function getWithdrawals(): Promise<WithdrawalRequest[]> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM withdrawals ORDER BY createdAt DESC');
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.userName,
    userEmail: r.userEmail,
    userPhone: r.userPhone || '',
    amount: Number(r.amount),
    paymentMethod: r.paymentMethod,
    accountTitle: r.accountTitle,
    accountNumber: r.accountNumber,
    bankName: r.bankName || undefined,
    status: r.status,
    adminNote: r.adminNote || undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    processedAt: r.processedAt ? new Date(r.processedAt).toISOString() : undefined,
  }));
}

export async function getWithdrawalsByUserId(userId: string): Promise<WithdrawalRequest[]> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM withdrawals WHERE userId = ? ORDER BY createdAt DESC', [userId]);
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.userName,
    userEmail: r.userEmail,
    userPhone: r.userPhone || '',
    amount: Number(r.amount),
    paymentMethod: r.paymentMethod,
    accountTitle: r.accountTitle,
    accountNumber: r.accountNumber,
    bankName: r.bankName || undefined,
    status: r.status,
    adminNote: r.adminNote || undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    processedAt: r.processedAt ? new Date(r.processedAt).toISOString() : undefined,
  }));
}

export async function requestWithdrawal(data: {
  userId: string;
  amount: number;
  paymentMethod: 'easypaisa' | 'jazzcash' | 'bank_transfer';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
}): Promise<WithdrawalRequest> {
  const user = await getUserById(data.userId);
  if (!user) throw new Error('User not found');

  if (data.amount < 200) {
    throw new Error('Minimum withdrawal amount is Rs. 200');
  }

  if (user.walletBalance < data.amount) {
    throw new Error('Insufficient wallet balance');
  }

  const p = getMySQLPool();
  const newWallet = user.walletBalance - data.amount;
  await p.query('UPDATE users SET walletBalance = ? WHERE id = ?', [newWallet, user.id]);

  const id = 'wdr-' + Date.now();
  const now = new Date();

  await p.query(
    `INSERT INTO withdrawals (id, userId, userName, userEmail, userPhone, amount, paymentMethod, accountTitle, accountNumber, bankName, status, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`,
    [
      id,
      user.id,
      user.name,
      user.email,
      user.phone || '',
      data.amount,
      data.paymentMethod,
      data.accountTitle,
      data.accountNumber,
      data.bankName || null,
      now,
    ]
  );

  return {
    id,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    userPhone: user.phone || '',
    amount: data.amount,
    paymentMethod: data.paymentMethod,
    accountTitle: data.accountTitle,
    accountNumber: data.accountNumber,
    bankName: data.bankName,
    status: 'pending',
    createdAt: now.toISOString(),
  };
}

export async function updateWithdrawalStatus(
  withdrawalId: string,
  status: WithdrawalStatus,
  adminNote?: string
): Promise<WithdrawalRequest | null> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM withdrawals WHERE id = ? LIMIT 1', [withdrawalId]);
  if (!rows || rows.length === 0) return null;
  const req = rows[0];

  const prevStatus = req.status;
  const now = new Date();

  // If rejected, refund money in MySQL
  if (status === 'rejected' && prevStatus !== 'rejected') {
    const user = await getUserById(req.userId);
    if (user) {
      const newWallet = user.walletBalance + Number(req.amount);
      await p.query('UPDATE users SET walletBalance = ? WHERE id = ?', [newWallet, user.id]);
    }
  }

  await p.query(
    'UPDATE withdrawals SET status = ?, adminNote = ?, processedAt = ? WHERE id = ?',
    [status, adminNote || req.adminNote || null, now, withdrawalId]
  );

  return {
    id: req.id,
    userId: req.userId,
    userName: req.userName,
    userEmail: req.userEmail,
    userPhone: req.userPhone || '',
    amount: Number(req.amount),
    paymentMethod: req.paymentMethod,
    accountTitle: req.accountTitle,
    accountNumber: req.accountNumber,
    bankName: req.bankName || undefined,
    status,
    adminNote: adminNote || req.adminNote || undefined,
    createdAt: req.createdAt ? new Date(req.createdAt).toISOString() : new Date().toISOString(),
    processedAt: now.toISOString(),
  };
}

// ---------------- SETTINGS (100% Direct MySQL) ----------------
export async function getSettings(): Promise<StoreSettings> {
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM settings WHERE id = "default" LIMIT 1');
  if (!rows || rows.length === 0) {
    return {
      storeName: 'Blackora',
      storeTagline: 'Timeless Elegance & Precision Luxury Timepieces',
      currency: 'Rs.',
      deliveryFee: 250,
      freeDeliveryThreshold: 5000,
      defaultReferralReward: 200,
      easyPaisaAccountTitle: 'Shumaila Kausar',
      easyPaisaAccountNumber: '03486611494',
      jazzCashAccountTitle: 'Shumaila Kausar',
      jazzCashAccountNumber: '03284217256',
      supportPhone: '+92 300 1234567',
      supportEmail: 'support@blackora.com',
      supportWhatsapp: '+92 300 1234567',
      adminUsername: 'admin',
      adminPassword: 'admin123',
    };
  }

  const s = rows[0];
  return {
    storeName: s.storeName || 'Blackora',
    storeTagline: s.storeTagline || '',
    currency: s.currency || 'Rs.',
    deliveryFee: Number(s.deliveryFee || 250),
    freeDeliveryThreshold: Number(s.freeDeliveryThreshold || 5000),
    defaultReferralReward: Number(s.defaultReferralReward || 200),
    easyPaisaAccountTitle: s.easyPaisaAccountTitle || 'Shumaila Kausar',
    easyPaisaAccountNumber: s.easyPaisaAccountNumber || '03486611494',
    jazzCashAccountTitle: s.jazzCashAccountTitle || 'Shumaila Kausar',
    jazzCashAccountNumber: s.jazzCashAccountNumber || '03284217256',
    supportPhone: s.supportPhone || '',
    supportEmail: s.supportEmail || '',
    supportWhatsapp: s.supportWhatsapp || '',
    adminUsername: s.adminUsername || 'admin',
    adminPassword: s.adminPassword || 'admin123',
  };
}

export async function updateSettings(updates: Partial<StoreSettings>): Promise<StoreSettings> {
  const current = await getSettings();
  const merged = { ...current, ...updates };

  const p = getMySQLPool();
  await p.query(
    `INSERT INTO settings (id, storeName, storeTagline, currency, deliveryFee, freeDeliveryThreshold, defaultReferralReward, easyPaisaAccountTitle, easyPaisaAccountNumber, jazzCashAccountTitle, jazzCashAccountNumber, supportPhone, supportEmail, supportWhatsapp, adminUsername, adminPassword)
     VALUES ('default', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE
       storeName=VALUES(storeName), storeTagline=VALUES(storeTagline), currency=VALUES(currency), deliveryFee=VALUES(deliveryFee), freeDeliveryThreshold=VALUES(freeDeliveryThreshold), defaultReferralReward=VALUES(defaultReferralReward), easyPaisaAccountTitle=VALUES(easyPaisaAccountTitle), easyPaisaAccountNumber=VALUES(easyPaisaAccountNumber), jazzCashAccountTitle=VALUES(jazzCashAccountTitle), jazzCashAccountNumber=VALUES(jazzCashAccountNumber), supportPhone=VALUES(supportPhone), supportEmail=VALUES(supportEmail), supportWhatsapp=VALUES(supportWhatsapp), adminUsername=VALUES(adminUsername), adminPassword=VALUES(adminPassword)`,
    [
      merged.storeName,
      merged.storeTagline,
      merged.currency,
      merged.deliveryFee,
      merged.freeDeliveryThreshold,
      merged.defaultReferralReward,
      merged.easyPaisaAccountTitle,
      merged.easyPaisaAccountNumber,
      merged.jazzCashAccountTitle,
      merged.jazzCashAccountNumber,
      merged.supportPhone,
      merged.supportEmail,
      merged.supportWhatsapp,
      merged.adminUsername,
      merged.adminPassword,
    ]
  );

  return merged;
}

// ---------------- SUPPORT MESSAGES & HELP CENTER (Direct MySQL) ----------------

async function ensureSupportMessagesTable() {
  const p = getMySQLPool();
  await p.query(`
    CREATE TABLE IF NOT EXISTS support_messages (
      id VARCHAR(191) PRIMARY KEY,
      userId VARCHAR(191) NULL,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50) NULL,
      subject VARCHAR(255) NOT NULL,
      message TEXT NOT NULL,
      status VARCHAR(50) NOT NULL DEFAULT 'pending',
      adminReply TEXT NULL,
      repliedAt DATETIME NULL,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

export async function getSupportMessages(): Promise<SupportMessage[]> {
  await ensureSupportMessagesTable();
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM support_messages ORDER BY createdAt DESC');
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId || undefined,
    name: r.name,
    email: r.email,
    phone: r.phone || undefined,
    subject: r.subject,
    message: r.message,
    status: r.status as SupportMessageStatus,
    adminReply: r.adminReply || undefined,
    repliedAt: r.repliedAt ? new Date(r.repliedAt).toISOString() : undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getSupportMessageById(id: string): Promise<SupportMessage | null> {
  await ensureSupportMessagesTable();
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>('SELECT * FROM support_messages WHERE id = ? LIMIT 1', [id]);
  if (!rows || rows.length === 0) return null;
  const r = rows[0];
  return {
    id: r.id,
    userId: r.userId || undefined,
    name: r.name,
    email: r.email,
    phone: r.phone || undefined,
    subject: r.subject,
    message: r.message,
    status: r.status as SupportMessageStatus,
    adminReply: r.adminReply || undefined,
    repliedAt: r.repliedAt ? new Date(r.repliedAt).toISOString() : undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  };
}

export async function getSupportMessagesByUserId(userId: string): Promise<SupportMessage[]> {
  await ensureSupportMessagesTable();
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>(
    'SELECT * FROM support_messages WHERE userId = ? ORDER BY createdAt DESC',
    [userId]
  );
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId || undefined,
    name: r.name,
    email: r.email,
    phone: r.phone || undefined,
    subject: r.subject,
    message: r.message,
    status: r.status as SupportMessageStatus,
    adminReply: r.adminReply || undefined,
    repliedAt: r.repliedAt ? new Date(r.repliedAt).toISOString() : undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function getSupportMessagesByEmail(email: string): Promise<SupportMessage[]> {
  await ensureSupportMessagesTable();
  const p = getMySQLPool();
  const [rows] = await p.query<any[]>(
    'SELECT * FROM support_messages WHERE LOWER(email) = LOWER(?) ORDER BY createdAt DESC',
    [email.trim()]
  );
  return rows.map((r) => ({
    id: r.id,
    userId: r.userId || undefined,
    name: r.name,
    email: r.email,
    phone: r.phone || undefined,
    subject: r.subject,
    message: r.message,
    status: r.status as SupportMessageStatus,
    adminReply: r.adminReply || undefined,
    repliedAt: r.repliedAt ? new Date(r.repliedAt).toISOString() : undefined,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
    updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : new Date().toISOString(),
  }));
}

export async function createSupportMessage(data: {
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}): Promise<SupportMessage> {
  await ensureSupportMessagesTable();
  const p = getMySQLPool();
  const id = 'ticket-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
  const now = new Date();

  await p.query(
    `INSERT INTO support_messages (id, userId, name, email, phone, subject, message, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
    [
      id,
      data.userId || null,
      data.name.trim(),
      data.email.trim().toLowerCase(),
      data.phone?.trim() || null,
      data.subject.trim(),
      data.message.trim(),
      now,
      now,
    ]
  );

  return {
    id,
    userId: data.userId || undefined,
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    phone: data.phone?.trim() || undefined,
    subject: data.subject.trim(),
    message: data.message.trim(),
    status: 'pending',
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function replySupportMessage(
  id: string,
  adminReply: string,
  status: SupportMessageStatus = 'replied'
): Promise<SupportMessage | null> {
  await ensureSupportMessagesTable();
  const existing = await getSupportMessageById(id);
  if (!existing) return null;

  const now = new Date();
  const p = getMySQLPool();

  await p.query(
    `UPDATE support_messages SET adminReply = ?, status = ?, repliedAt = ?, updatedAt = ?
     WHERE id = ?`,
    [adminReply.trim(), status, now, now, id]
  );

  return {
    ...existing,
    adminReply: adminReply.trim(),
    status,
    repliedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
}

export async function deleteSupportMessage(id: string): Promise<boolean> {
  await ensureSupportMessagesTable();
  const p = getMySQLPool();
  const [res]: any = await p.query('DELETE FROM support_messages WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

