'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useAuth } from '@/contexts/auth-context';
import { useCart } from '@/contexts/cart-context';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { OrderSummary } from './order-summary';
import { LoginModal } from './login-modal';
import { createOrder, verifyPayment, getLastBuyerPhone } from '@/lib/api';
import { requestPayment } from '@/lib/payment/pg-bridge';
import type { PaymentMethod } from '@/types/commerce';
import { CreditCard, Loader2, ShieldCheck } from 'lucide-react';

const BUYER_STORAGE_KEY = 'dreamitbiz_checkout_buyer';

export function PaymentForm() {
  const locale = useLocale();
  const router = useRouter();
  const { user, profile, isLoggedIn } = useAuth();
  const { items, clearCart } = useCart();
  const { toast } = useToast();

  const [loginOpen, setLoginOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [paymentMethod] = useState<PaymentMethod>('card');
  const [agreed, setAgreed] = useState(false);
  const pendingSubmit = useRef(false);

  // 1) sessionStorage에서 주문자 정보 복원 (OAuth 리다이렉트 후)
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(BUYER_STORAGE_KEY);
      if (saved) {
        const data = JSON.parse(saved);
        if (data.name) setBuyerName(data.name);
        if (data.email) setBuyerEmail(data.email);
        if (data.phone) setBuyerPhone(data.phone);
        if (data.agreed) setAgreed(true);
        sessionStorage.removeItem(BUYER_STORAGE_KEY);
      }
    } catch { /* ignore */ }
  }, []);

  // 2) Supabase 사용자 정보로 빈 필드 자동 채우기
  useEffect(() => {
    if (user || profile) {
      const name = profile?.display_name || user?.user_metadata?.full_name || '';
      const email = profile?.email || user?.email || '';
      const phone = user?.phone || user?.user_metadata?.phone || '';
      setBuyerName((prev) => prev || name);
      setBuyerEmail((prev) => prev || email);
      if (phone) setBuyerPhone((prev) => prev || phone);

      // 이전 주문에서 전화번호 가져오기
      if (!phone && user?.id) {
        getLastBuyerPhone(user.id).then((p) => {
          if (p) setBuyerPhone((prev) => prev || p);
        });
      }
    }
  }, [user, profile]);

  // 3) 이메일 로그인 후 자동 재제출 — buyerEmail이 채워진 후에만 실행
  useEffect(() => {
    if (isLoggedIn && pendingSubmit.current && buyerEmail) {
      pendingSubmit.current = false;
      const form = document.getElementById('checkout-form') as HTMLFormElement;
      form?.requestSubmit();
    }
  }, [isLoggedIn, buyerEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // OAuth 리다이렉트에 대비해 주문자 정보를 sessionStorage에 저장
      try {
        sessionStorage.setItem(BUYER_STORAGE_KEY, JSON.stringify({
          name: buyerName,
          email: buyerEmail,
          phone: buyerPhone,
          agreed,
        }));
      } catch { /* ignore */ }
      pendingSubmit.current = true;
      setLoginOpen(true);
      return;
    }

    if (items.length === 0) return;

    setLoading(true);
    try {
      // 1. 주문 생성
      const order = await createOrder({
        items: items.map((i) => ({
          slug: i.slug,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
        buyer: { name: buyerName, email: buyerEmail, phone: buyerPhone },
        paymentMethod,
      });

      // 2. PG 결제 팝업
      if (order.pgData) {
        const pgResult = await requestPayment(order.pgData);

        // 3. 결제 검증 (Supabase Edge Function)
        const verification = await verifyPayment(pgResult.imp_uid, order.orderId);

        if (verification.verified) {
          clearCart();
          // 결제 완료 시 sessionStorage 정리
          try { sessionStorage.removeItem(BUYER_STORAGE_KEY); } catch { /* ignore */ }
          router.push(`/checkout/success?orderId=${order.orderId}`);
          return;
        }
        throw new Error('Payment verification failed');
      }

      clearCart();
      try { sessionStorage.removeItem(BUYER_STORAGE_KEY); } catch { /* ignore */ }
      router.push(`/checkout/success?orderId=${order.orderId}`);
    } catch (err) {
      toast(
        err instanceof Error
          ? err.message
          : locale === 'ko'
            ? '결제 처리 중 오류가 발생했습니다'
            : 'An error occurred during payment',
        'error',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form id="checkout-form" onSubmit={handleSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {locale === 'ko' ? '주문자 정보' : 'Buyer Information'}
            </h2>
            <Separator className="my-4" />
            <div className="space-y-4">
              <div>
                <Label htmlFor="buyerName">{locale === 'ko' ? '이름' : 'Name'}</Label>
                <Input id="buyerName" value={buyerName} onChange={(e) => setBuyerName(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="buyerEmail">{locale === 'ko' ? '이메일' : 'Email'}</Label>
                <Input id="buyerEmail" type="email" value={buyerEmail} onChange={(e) => setBuyerEmail(e.target.value)} required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="buyerPhone">{locale === 'ko' ? '연락처' : 'Phone'}</Label>
                <Input id="buyerPhone" type="tel" value={buyerPhone} onChange={(e) => setBuyerPhone(e.target.value)} required placeholder="010-0000-0000" className="mt-1" />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {locale === 'ko' ? '결제 수단' : 'Payment Method'}
            </h2>
            <Separator className="my-4" />
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-center gap-3">
                <CreditCard className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-gray-900">{locale === 'ko' ? '카드 결제' : 'Credit Card'}</p>
                  <p className="text-sm text-gray-500">{locale === 'ko' ? '신용카드/체크카드로 결제합니다' : 'Pay with credit or debit card'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1 h-4 w-4 rounded border-gray-300" />
            <label htmlFor="agree" className="text-sm text-gray-600">
              {locale === 'ko' ? '주문 내용을 확인하였으며, 결제에 동의합니다' : 'I have reviewed my order and agree to proceed with payment'}
            </label>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading || !agreed || items.length === 0}>
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ShieldCheck className="mr-2 h-4 w-4" />}
            {locale === 'ko' ? '결제하기' : 'Pay Now'}
          </Button>
        </div>

        <div className="lg:col-span-2">
          <OrderSummary />
        </div>
      </form>

      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} onSuccess={() => setLoginOpen(false)} />
    </>
  );
}
