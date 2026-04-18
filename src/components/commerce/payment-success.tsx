import { useLanguage } from '@/contexts/LanguageContext';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle, BookOpen, ArrowLeft } from 'lucide-react';

interface PaymentSuccessProps {
  orderId: string;
}

export function PaymentSuccess({ orderId }: PaymentSuccessProps) {
  const { language } = useLanguage();

  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        {language === 'ko' ? '결제가 완료되었습니다!' : 'Payment Complete!'}
      </h1>
      <p className="mt-2 text-gray-600">
        {language === 'ko'
          ? '구매해주셔서 감사합니다. 내 서재에서 구매한 도서를 확인하세요.'
          : 'Thank you for your purchase. Check your library for the purchased books.'}
      </p>
      <p className="mt-4 text-sm text-gray-500">
        {language === 'ko' ? '주문번호' : 'Order ID'}: {orderId}
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link to="/library">
          <Button>
            <BookOpen className="mr-2 h-4 w-4" />
            {language === 'ko' ? '내 서재로 가기' : 'Go to Library'}
          </Button>
        </Link>
        <Link to="/catalog">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === 'ko' ? '계속 둘러보기' : 'Continue Browsing'}
          </Button>
        </Link>
      </div>
    </div>
  );
}
