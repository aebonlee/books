// 장바구니
export interface CartItem {
  slug: string;
  title: string;
  titleEn?: string;
  coverImage: string;
  price: number;
  quantity: number;
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
    merchantUid: string;
    amount: number;
    name: string;
    buyerName: string;
    buyerEmail: string;
    buyerTel: string;
  };
}

export type PaymentMethod = 'card' | 'bank_transfer' | 'virtual_account';

// 구매 내역
export interface PurchaseRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  slug: string;
  title: string;
  coverImage: string;
  purchasedAt: string;
  price: number;
  status: 'active' | 'refunded';
}
