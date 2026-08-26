export type ProductCategory = 'men' | 'women' | 'unisex' | 'accessories';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: ProductCategory;
  price: number;
  originalPrice?: number;
  // Admin-only fields (hidden from public users)
  stock: number;
  commissionAmount: number; // Profit/Reward allocated for referrer when this product is bought
  images: string[];
  specs: {
    caseDiameter?: string;
    caseThickness?: string;
    dialColor?: string;
    movement?: string;
    strapMaterial?: string;
    waterResistance?: string;
    glassType?: string;
  };
  featured?: boolean;
  bestSeller?: boolean;
  isNewArrival?: boolean;
  rating?: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string; // Plain/Hashed
  phone?: string;
  role: 'customer' | 'admin';
  referralCode: string; // e.g. "BLK-USER123"
  isSeller: boolean; // unlocked if has >= 1 delivered order
  walletBalance: number; // Current earned withdrawable money (Rs.)
  pendingBalance: number; // Commissions in transit from undelivered orders
  totalEarned: number; // Lifetime earnings
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  commissionAmount: number; // Snapshot of commission at order time
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'easypaisa' | 'jazzcash';
export type PaymentStatus = 'pending_verification' | 'approved' | 'paid' | 'rejected';

export interface Order {
  id: string;
  orderNumber: string; // e.g. "BLK-8921"
  userId?: string; // Optional if guest or logged in
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  address: string;
  postalCode?: string;
  notes?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionId?: string; // For EasyPaisa / JazzCash proof
  referralCodeUsed?: string;
  referrerUserId?: string;
  totalCommissionEarned: number; // Total commission attached to this order
  commissionPaid: boolean; // True once credited upon 'delivered'
  status: OrderStatus;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type WithdrawalStatus = 'pending' | 'processing' | 'approved' | 'rejected';

export interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  amount: number;
  paymentMethod: 'easypaisa' | 'jazzcash' | 'bank_transfer';
  accountTitle: string;
  accountNumber: string;
  bankName?: string;
  status: WithdrawalStatus;
  adminNote?: string;
  createdAt: string;
  processedAt?: string;
}

export interface StoreSettings {
  storeName: string;
  storeTagline: string;
  currency: string;
  deliveryFee: number;
  freeDeliveryThreshold: number; // Orders above this get free delivery
  defaultReferralReward: number; // Fallback reward if not set on product
  easyPaisaAccountTitle: string;
  easyPaisaAccountNumber: string;
  jazzCashAccountTitle: string;
  jazzCashAccountNumber: string;
  supportPhone: string;
  supportEmail: string;
  supportWhatsapp: string;
  adminUsername: string;
  adminPassword: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type SupportMessageStatus = 'pending' | 'in_progress' | 'replied' | 'closed';

export interface SupportMessage {
  id: string;
  userId?: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: SupportMessageStatus;
  adminReply?: string;
  repliedAt?: string;
  createdAt: string;
  updatedAt: string;
}
