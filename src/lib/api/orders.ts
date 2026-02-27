import type {
  OrderRequest,
  OrderResponse,
  PaymentVerifyRequest,
  PaymentVerifyResponse,
} from '@/types/commerce';
import { apiClient } from './client';
import { siteConfig } from '@/config/site';

export async function createOrder(
  data: OrderRequest,
): Promise<OrderResponse> {
  return apiClient.post<OrderResponse>(
    siteConfig.api.endpoints.orders,
    data,
  );
}

export async function verifyPayment(
  data: PaymentVerifyRequest,
): Promise<PaymentVerifyResponse> {
  return apiClient.post<PaymentVerifyResponse>(
    siteConfig.api.endpoints.ordersVerify,
    data,
  );
}
