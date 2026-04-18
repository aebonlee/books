import { Suspense } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PaymentSuccess } from '@/components/commerce/payment-success';
import { Loader2 } from 'lucide-react';
import { SEOHead } from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

function SuccessContent() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId') || '';

  return <PaymentSuccess orderId={orderId} />;
}

export default function CheckoutSuccessPage() {
  const { language } = useLanguage();
  const ko = language === 'ko';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <SEOHead title={ko ? '결제 완료' : 'Payment Complete'} />
      <Suspense
        fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        }
      >
        <SuccessContent />
      </Suspense>
    </div>
  );
}
