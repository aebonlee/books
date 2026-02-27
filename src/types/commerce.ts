// 장바구니
export interface CartItem {
  slug: string;
  title: string;
  titleEn?: string;
  coverImage: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

// 인증
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token?: string;
}

// 주문
export interface OrderItem {
  slug: string;
  title: string;
  price: number;
  quantity: number;
}

export interface OrderRequest {
  items: OrderItem[];
  buyer: {
    name: string;
    email: string;
    phone: string;
  };
  paymentMethod: PaymentMethod;
}

export interface OrderResponse {
  orderId: string;
  merchantUid: string;
  amount: number;
  status: 'pending' | 'paid' | 'failed' | 'cancelled';
  pgData?: {
    pg: string;
    payMethod: string;
    merchantUid: string;
    amount: number;
    name: string;
    buyerName: string;
    buyerEmail: string;
    buyerTel: string;
  };
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'virtual_account';

export interface PaymentVerifyRequest {
  orderId: string;
  impUid: string;
  merchantUid: string;
}

export interface PaymentVerifyResponse {
  success: boolean;
  orderId: string;
  status: 'paid' | 'failed';
  message?: string;
}

// 구매 내역
export interface PurchaseRecord {
  id: string;
  orderId: string;
  slug: string;
  title: string;
  coverImage: string;
  purchasedAt: string;
  price: number;
  status: 'active' | 'refunded';
}

export interface PurchaseListResponse {
  purchases: PurchaseRecord[];
  total: number;
}
