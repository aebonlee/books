import { getSupabase } from '@/lib/supabase';
import { fallbackOrders } from '@/lib/api/fallback-store';
import type { PurchaseRecord } from '@/types/commerce';

export async function getPurchases(userId: string): Promise<PurchaseRecord[]> {
  const client = getSupabase();

  if (!client) {
    // Fallback: 인메모리 (개발)
    return fallbackOrders
      .filter((o) => o.payment_status === 'paid')
      .map((o) => ({
        id: o.id,
        orderId: o.id,
        orderNumber: o.order_number,
        slug: '',
        title: o.user_name,
        coverImage: '',
        purchasedAt: o.paid_at || o.created_at,
        price: o.total_amount,
        status: 'active' as const,
      }));
  }

  const { data, error } = await client
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .eq('payment_status', 'paid')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch purchases:', error.message);
    return [];
  }
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
