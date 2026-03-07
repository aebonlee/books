export default function NotFound() {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-white font-sans antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-6xl font-bold text-gray-900">404</h1>
          <p className="mt-4 text-xl text-gray-600">
            페이지를 찾을 수 없습니다
          </p>
          <p className="mt-2 text-gray-500">
            Page not found
          </p>
          <a
            href="/ko"
            className="mt-8 inline-flex items-center rounded-md bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기 / Back to Home
          </a>
        </div>
      </body>
    </html>
  );
}
