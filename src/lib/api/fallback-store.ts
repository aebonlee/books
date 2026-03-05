/** Supabase 미연결 시 사용하는 인메모리 주문 저장소 (개발/데모용) */
export interface FallbackOrder {
  id: string;
  order_number: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  created_at: string;
  paid_at?: string;
}

export const fallbackOrders: FallbackOrder[] = [];
