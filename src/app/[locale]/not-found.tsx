import { Link } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale();
  const isKo = locale === 'ko';

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-xl text-gray-600">
        {isKo ? '페이지를 찾을 수 없습니다' : 'Page not found'}
      </p>
      <p className="mt-2 text-gray-500">
        {isKo
          ? '요청하신 페이지가 존재하지 않거나 이동되었습니다.'
          : 'The page you are looking for does not exist or has been moved.'}
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
      >
        {isKo ? '홈으로 돌아가기' : 'Back to Home'}
      </Link>
    </div>
  );
}
