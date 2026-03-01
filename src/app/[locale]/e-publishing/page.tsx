import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import {
  FileText,
  BookOpen,
  Image as ImageIcon,
  Presentation,
  Sparkles,
  MessageSquare,
  ClipboardList,
  Hammer,
  CheckCircle,
  Package,
  ArrowRight,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return {
    title: locale === 'ko' ? '전자출판 안내' : 'E-Publishing Guide',
    description:
      locale === 'ko'
        ? '전자출판 제작 절차, 이용 가능 기능, 신청 방법을 안내합니다.'
        : 'Learn about our e-publishing process, features, and how to request.',
  };
}

const steps = [
  {
    icon: MessageSquare,
    titleKo: '상담',
    titleEn: 'Consultation',
    descKo: '프로젝트 목표와 요구사항을 파악하고, 최적의 전자출판 방식을 제안합니다.',
    descEn: 'We understand your project goals and suggest the best e-publishing approach.',
  },
  {
    icon: ClipboardList,
    titleKo: '기획',
    titleEn: 'Planning',
    descKo: '콘텐츠 구조, 디자인 방향, 인터랙티브 요소를 설계합니다.',
    descEn: 'We design the content structure, visual direction, and interactive elements.',
  },
  {
    icon: Hammer,
    titleKo: '제작',
    titleEn: 'Production',
    descKo: '전문 디자이너와 개발자가 고품질 전자출판물을 제작합니다.',
    descEn: 'Our designers and developers create high-quality digital publications.',
  },
  {
    icon: CheckCircle,
    titleKo: '검수',
    titleEn: 'Review',
    descKo: '고객 피드백을 반영하여 완성도를 높이고, 최종 확인합니다.',
    descEn: 'We incorporate your feedback and perform final quality checks.',
  },
  {
    icon: Package,
    titleKo: '납품',
    titleEn: 'Delivery',
    descKo: '완성된 콘텐츠를 다양한 포맷으로 전달하고, 플랫폼 게시를 지원합니다.',
    descEn: 'We deliver the content in multiple formats and support platform publishing.',
  },
];

const features = [
  {
    icon: FileText,
    titleKo: 'PDF 뷰어',
    titleEn: 'PDF Viewer',
    descKo: '고해상도 PDF를 온라인에서 바로 열람할 수 있는 뷰어를 제공합니다.',
    descEn: 'View high-resolution PDFs directly online with our built-in viewer.',
  },
  {
    icon: BookOpen,
    titleKo: 'EPUB 리더',
    titleEn: 'EPUB Reader',
    descKo: '반응형 전자책 리더로 어떤 기기에서든 최적화된 독서 경험을 제공합니다.',
    descEn: 'A responsive e-book reader optimized for any device.',
  },
  {
    icon: ImageIcon,
    titleKo: '갤러리',
    titleEn: 'Gallery',
    descKo: '이미지 기반 콘텐츠를 라이트박스 갤러리로 직관적으로 감상할 수 있습니다.',
    descEn: 'Browse image-based content through an intuitive lightbox gallery.',
  },
  {
    icon: Presentation,
    titleKo: '보고서 뷰어',
    titleEn: 'Report Viewer',
    descKo: '슬라이드 형식의 연구보고서를 온라인에서 프레젠테이션처럼 확인합니다.',
    descEn: 'View slide-based research reports like a presentation online.',
  },
  {
    icon: Sparkles,
    titleKo: '인터랙티브 콘텐츠',
    titleEn: 'Interactive Content',
    descKo: '동영상, 애니메이션, 퀴즈 등 참여형 콘텐츠를 제작할 수 있습니다.',
    descEn: 'Create engaging content with video, animation, quizzes, and more.',
  },
];

export default async function EPublishingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const ko = locale === 'ko';

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Hero */}
      <section className="mb-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          {ko ? '전자출판 안내' : 'E-Publishing Guide'}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
          {ko
            ? '디지털 시대에 맞는 전문적인 전자출판 서비스를 제공합니다.'
            : 'We provide professional e-publishing services for the digital era.'}
          <br />
          {ko
            ? 'PDF, EPUB, 인터랙티브 콘텐츠까지 — 아이디어를 현실로 만들어 드립니다.'
            : 'From PDF and EPUB to interactive content — we bring your ideas to life.'}
        </p>
      </section>

      {/* 전자출판이란 */}
      <section className="mb-16">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">
          {ko ? '전자출판이란?' : 'What is E-Publishing?'}
        </h2>
        <div className="rounded-xl bg-blue-50 p-6 sm:p-8">
          <p className="text-gray-700 leading-relaxed">
            {ko
              ? '전자출판(E-Publishing)은 기존의 종이 인쇄물을 디지털 형태로 변환하거나, 처음부터 디지털 환경에 최적화된 콘텐츠를 기획·제작하는 것을 말합니다.'
              : 'E-Publishing refers to converting traditional print materials into digital formats, or creating content optimized for digital environments from the start.'}
            <br />
            {ko
              ? 'PDF, EPUB, 웹 기반 인터랙티브 콘텐츠 등 다양한 형태로 제작할 수 있으며, 온라인 배포와 열람이 용이하여 접근성과 활용도가 높습니다.'
              : 'It encompasses various formats including PDF, EPUB, and web-based interactive content, offering greater accessibility and usability through easy online distribution and viewing.'}
          </p>
        </div>
      </section>

      {/* 제작 절차 */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          {ko ? '제작 절차' : 'Production Process'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={i}
                className="relative rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm"
              >
                <div className="mb-3 flex items-center justify-center">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                    {i + 1}
                  </span>
                </div>
                <Icon className="mx-auto mb-3 h-8 w-8 text-blue-600" />
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {ko ? step.titleKo : step.titleEn}
                </h3>
                <p className="text-sm text-gray-600">
                  {ko ? step.descKo : step.descEn}
                </p>
                {i < steps.length - 1 && (
                  <ArrowRight className="absolute -right-3 top-1/2 hidden h-6 w-6 -translate-y-1/2 text-gray-300 lg:block" />
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 이용 가능 기능 */}
      <section className="mb-16">
        <h2 className="mb-8 text-2xl font-bold text-gray-900">
          {ko ? '이용 가능 기능' : 'Available Features'}
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-gray-900">
                  {ko ? feat.titleKo : feat.titleEn}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {ko ? feat.descKo : feat.descEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center text-white sm:p-12">
        <h2 className="text-2xl font-bold sm:text-3xl">
          {ko ? '전자출판을 시작해 보세요' : 'Get Started with E-Publishing'}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-blue-100">
          {ko
            ? '맞춤 제작 의뢰를 통해 프로젝트를 시작하거나, 갤러리에서 제작 사례를 확인해 보세요.'
            : 'Start your project with a custom request, or explore our gallery for examples.'}
        </p>
        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/custom-order"
            className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 font-semibold text-blue-700 shadow transition-colors hover:bg-blue-50"
          >
            {ko ? '맞춤 제작 의뢰' : 'Custom Request'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/category/digital"
            className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10"
          >
            {ko ? '갤러리 보기' : 'View Gallery'}
          </Link>
        </div>
      </section>
    </div>
  );
}
