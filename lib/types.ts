export type Audience = "women" | "men" | "girls" | "unisex";

export type Category =
  | "co-ord-sets"
  | "tracksuits"
  | "hoodies"
  | "sweatshirts"
  | "tops";

export type Badge = "new" | "bestseller" | "sale";

export type ShippingMethod = "standard" | "express";

export type PaymentMethod = "cod" | "card" | "bank";

export type OrderStatus =
  | "pending_confirmation"
  | "confirmed"
  | "packed"
  | "dispatched"
  | "delivered"
  | "completed"
  | "cancelled"
  | "returned"
  | "exchange_requested"
  | "refunded"
  | "failed_delivery"
  | "rto";

export type PaymentStatus = "unpaid" | "pending" | "paid" | "failed";

export type Zone = "metro" | "major" | "rest";

export type ImageAsset = {
  src: string;
  alt: string;
};

export type Variant = {
  id: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  stock: number;
};

export type Review = {
  id: string;
  productHandle: string;
  author: string;
  rating: number;
  text: string;
  verified: boolean;
  status: "pending" | "published" | "rejected";
  createdAt: string;
};

export type Product = {
  id: string;
  handle: string;
  title: string;
  category: Category;
  audience: Audience;
  price: number;
  compareAtPrice?: number;
  fabric: string;
  care: string;
  fitNotes: string;
  modelInfo: string;
  description: string;
  details: string[];
  badges: Badge[];
  images: ImageAsset[];
  variants: Variant[];
  sales30d: number;
  createdAt: string;
  reviews: Review[];
};

export type RawLine = {
  variantId: string;
  qty: number;
};

export type RawCart = {
  lines: RawLine[];
  promoCode?: string;
};

export type PricedLine = {
  variantId: string;
  sku: string;
  productHandle: string;
  productTitle: string;
  size: string;
  color: string;
  colorHex: string;
  image: string;
  unitPrice: number;
  qty: number;
  lineTotal: number;
  stock: number;
};

export type PricedCart = {
  lines: PricedLine[];
  subtotal: number;
  discount: number;
  promoCode?: string;
  promoError?: string;
  count: number;
  freeShippingRemaining: number;
};

export type Address = {
  id: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  landmark?: string;
};

export type Session = {
  name: string;
  phone: string;
  email?: string;
  addresses: Address[];
};

export type ReturnRequest = {
  type: "exchange" | "refund";
  reason: string;
  notes: string;
  status: "requested" | "approved" | "rejected" | "completed";
  createdAt: string;
};

export type Order = {
  id: string;
  idempotencyKey: string;
  payToken: string;
  createdAt: string;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  shippingMethod: ShippingMethod;
  customer: {
    fullName: string;
    phone: string;
    email?: string;
    province: string;
    city: string;
    address: string;
    landmark?: string;
    notes?: string;
  };
  lines: PricedLine[];
  totals: {
    subtotal: number;
    discount: number;
    shipping: number;
    codFee: number;
    total: number;
    promoCode?: string;
  };
  eta: string;
  codConfirmed: boolean;
  courier?: string;
  trackingNo?: string;
  receiptFile?: string;
  internalNotes?: string;
  returnRequest?: ReturnRequest;
};

export type CheckoutResult =
  | { ok: true; orderId: string; next: string }
  | { ok: false; message?: string; fields?: Record<string, string> };
