import { getSupabase } from '@/lib/supabase';
import { fallbackOrders } from '@/lib/api/fallback-store';
import type { OrderRequest, OrderResponse } from '@/types/commerce';

/** 마지막 주문의 전화번호 조회 (자동 채우기용) */
export async function getLastBuyerPhone(userId: string): Promise<string> {
  const client = getSupabase();
  if (!client) return '';
  const { data } = await client
    .from('orders')
    .select('user_phone')
    .eq('user_id', userId)
    .not('user_phone', 'is', null)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data?.user_phone || '';
}

export async function createOrder(data: OrderRequest): Promise<OrderResponse> {
  const client = getSupabase();

  const orderNumber = `BO-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const totalAmount = data.items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!client) {
    // Fallback: 인메모리 저장 (개발/데모)
    const order = {
      id: crypto.randomUUID(),
      order_number: orderNumber,
      user_email: data.buyer.email,
      user_name: data.buyer.name,
      user_phone: data.buyer.phone,
      total_amount: totalAmount,
      payment_method: data.paymentMethod,
      payment_status: 'pending' as const,
      created_at: new Date().toISOString(),
    };
    fallbackOrders.push(order);

    return {
      orderId: order.id,
      merchantUid: orderNumber,
      amount: totalAmount,
      status: 'pending',
      pgData: {
        merchantUid: orderNumber,
        amount: totalAmount,
        name: data.items.map((i) => i.title).join(', '),
        buyerName: data.buyer.name,
        buyerEmail: data.buyer.email,
        buyerTel: data.buyer.phone,
      },
    };
  }

  // Supabase에 주문 저장
  const orderPayload: Record<string, unknown> = {
    order_number: orderNumber,
    user_email: data.buyer.email,
    user_name: data.buyer.name,
    user_phone: data.buyer.phone,
    total_amount: totalAmount,
    payment_method: data.paymentMethod,
  };

  const { error: orderError } = await client
    .from('orders')
    .insert(orderPayload);

  if (orderError) throw orderError;

  // 주문 항목 저장 (별도 조회 후 삽입 — bare INSERT 후 id를 모르므로)
  if (data.items.length > 0) {
    try {
      const { data: row } = await client
        .from('orders')
        .select('id')
        .eq('order_number', orderNumber)
        .maybeSingle();
      if (row?.id) {
        await client.from('order_items').insert(
          data.items.map((item) => ({
            order_id: row.id,
            product_title: item.title,
            quantity: item.quantity,
            unit_price: item.price,
            subtotal: item.price * item.quantity,
          })),
        );
      }
    } catch { /* order_items 실패해도 결제 진행 */ }
  }

  return {
    orderId: orderNumber,
    merchantUid: orderNumber,
    amount: totalAmount,
    status: 'pending',
    pgData: {
      merchantUid: orderNumber,
      amount: totalAmount,
      name: data.items.map((i) => i.title).join(', '),
      buyerName: data.buyer.name,
      buyerEmail: data.buyer.email,
      buyerTel: data.buyer.phone,
    },
  };
}

export async function verifyPayment(paymentId: string, orderId: string) {
  const client = getSupabase();

  if (!client) {
    // Fallback: 자동 승인 (개발)
    const idx = fallbackOrders.findIndex((o) => o.id === orderId);
    if (idx >= 0) {
      fallbackOrders[idx].payment_status = 'paid';
      fallbackOrders[idx].paid_at = new Date().toISOString();
    }
    return { verified: true };
  }

  // Supabase Edge Function 호출
  const { data, error } = await client.functions.invoke('verify-payment', {
    body: { paymentId, orderId },
  });

  if (error) throw error;
  return data;
}
