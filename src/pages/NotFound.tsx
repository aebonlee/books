import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NotFound() {
  const { language } = useLanguage();
  const ko = language === 'ko';
  return (
    <>
      <SEOHead title="404" />
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <h1 className="text-6xl font-bold text-gray-900">404</h1>
        <p className="mt-4 text-xl text-gray-600">{ko ? '페이지를 찾을 수 없습니다' : 'Page not found'}</p>
        <Link to="/" className="mt-8 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          {ko ? '홈으로 돌아가기' : 'Back to Home'}
        </Link>
      </div>
    </>
  );
}
