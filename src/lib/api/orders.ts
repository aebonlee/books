import { getSupabase } from '@/lib/supabase';
import type { OrderRequest, OrderResponse } from '@/types/commerce';

export async function createOrder(data: OrderRequest): Promise<OrderResponse> {
  const client = getSupabase();

  const orderNumber = `BO-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const totalAmount = data.items.reduce((s, i) => s + i.price * i.quantity, 0);

  if (!client) {
    // Fallback: localStorage 저장 (개발/데모)
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
    const orders = JSON.parse(localStorage.getItem('dreamitbiz_orders') || '[]');
    orders.push(order);
    localStorage.setItem('dreamitbiz_orders', JSON.stringify(orders));

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
  const session = await client.auth.getSession();
  const userId = session.data.session?.user?.id;

  const orderPayload: Record<string, unknown> = {
    order_number: orderNumber,
    user_email: data.buyer.email,
    user_name: data.buyer.name,
    user_phone: data.buyer.phone,
    total_amount: totalAmount,
    payment_method: data.paymentMethod,
  };
  if (userId) orderPayload.user_id = userId;

  const { data: order, error: orderError } = await client
    .from('orders')
    .insert(orderPayload)
    .select()
    .single();

  if (orderError) throw orderError;

  // 주문 항목 저장
  if (data.items.length > 0) {
    await client.from('order_items').insert(
      data.items.map((item) => ({
        order_id: order.id,
        product_title: item.title,
        quantity: item.quantity,
        unit_price: item.price,
        subtotal: item.price * item.quantity,
      })),
    );
  }

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

export async function verifyPayment(paymentId: string, orderId: string) {
  const client = getSupabase();

  if (!client) {
    // Fallback: 자동 승인 (개발)
    const orders = JSON.parse(localStorage.getItem('dreamitbiz_orders') || '[]');
    const idx = orders.findIndex((o: { id: string }) => o.id === orderId);
    if (idx >= 0) {
      orders[idx].payment_status = 'paid';
      orders[idx].paid_at = new Date().toISOString();
      localStorage.setItem('dreamitbiz_orders', JSON.stringify(orders));
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
