import { getSupabase } from '@/lib/supabase';
import type { PurchaseRecord } from '@/types/commerce';

export async function getPurchases(userId: string): Promise<PurchaseRecord[]> {
  const client = getSupabase();

  if (!client) {
    // Fallback: localStorage (개발)
    const orders = JSON.parse(localStorage.getItem('dreamitbiz_orders') || '[]');
    return orders
      .filter((o: Record<string, unknown>) => o.payment_status === 'paid')
      .map((o: Record<string, string>) => ({
        id: o.id,
        orderId: o.id,
        orderNumber: o.order_number,
        title: o.user_name,
        purchasedAt: o.paid_at || o.created_at,
        price: Number(o.total_amount),
        status: 'active' as const,
      }));
  }

  const { data, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false });

  if (error) return [];
  return (data || []).flatMap((order) =>
    (order.order_items || []).map((item: Record<string, unknown>) => ({
      id: `${order.id}-${item.id}`,
      orderId: order.id as string,
      orderNumber: order.order_number as string,
      slug: '', // 주문 항목에 slug 매핑 필요 시 확장
      title: item.product_title as string,
      coverImage: '',
      purchasedAt: (order.paid_at || order.created_at) as string,
      price: item.unit_price as number,
      status: 'active' as const,
    })),
  );
}
