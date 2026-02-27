import type { PurchaseListResponse } from '@/types/commerce';
import { apiClient } from './client';
import { siteConfig } from '@/config/site';

export async function getPurchases(): Promise<PurchaseListResponse> {
  return apiClient.get<PurchaseListResponse>(
    siteConfig.api.endpoints.purchases,
  );
}

export async function checkOwnership(
  slug: string,
): Promise<{ owned: boolean }> {
  return apiClient.get<{ owned: boolean }>(
    `${siteConfig.api.endpoints.purchases}/${slug}`,
  );
}
