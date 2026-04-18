import { Link } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  BookOpen,
  Tablet,
  Presentation,
  FileText,
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

const services = [
  {
    icon: Tablet,
    titleKo: '전자책 제작',
    titleEn: 'E-Book Production',
    descriptionKo: 'PDF, ePub 등 다양한 전자책 포맷으로 변환 및 제작',
    descriptionEn: 'Convert and produce e-books in PDF, ePub, and various formats',
  },
  {
    icon: BookOpen,
    titleKo: '인터랙티브 교재',
    titleEn: 'Interactive Textbooks',
    descriptionKo: '멀티미디어, 퀴즈, 시뮬레이션이 포함된 디지털 교재',
    descriptionEn: 'Digital textbooks with multimedia, quizzes, and simulations',
  },
  {
    icon: Presentation,
    titleKo: '강의 자료 제작',
    titleEn: 'Lecture Material Design',
    descriptionKo: '슬라이드, 실습 자료, 프로젝트 가이드 디자인',
    descriptionEn: 'Design slides, hands-on materials, and project guides',
  },
  {
    icon: FileText,
    titleKo: '출판 컨설팅',
    titleEn: 'Publishing Consulting',
    descriptionKo: '교재 기획부터 출판까지 전 과정 컨설팅',
    descriptionEn: 'End-to-end consulting from textbook planning to publication',
  },
];

const features = [
  { ko: '전문 디자인 팀 보유', en: 'Professional design team' },
  { ko: '빠른 제작 일정', en: 'Fast turnaround' },
  { ko: '다양한 디지털 포맷 지원', en: 'Multiple digital format support' },
  { ko: '맞춤형 인터랙티브 콘텐츠', en: 'Custom interactive content' },
  { ko: 'ISBN 발급 지원', en: 'ISBN registration support' },
  { ko: '인쇄 및 디지털 동시 출판', en: 'Print & digital simultaneous publishing' },
];

export default function EPublishing() {
  const { t, language } = useLanguage();
  const ko = language === 'ko';

  return (
    <>
      <SEOHead
        title={ko ? '전자출판 안내' : 'E-Publishing Guide'}
        description={ko ? '전자출판, 교재 제작, 디지털 콘텐츠 서비스 안내' : 'E-publishing, textbook production, digital content services'}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-600 to-purple-700 py-20 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {ko ? '전자출판 서비스' : 'E-Publishing Services'}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-indigo-100">
            {ko
              ? '전문적인 전자출판, 교재 제작, 디지털 콘텐츠 제작 서비스를 제공합니다'
              : 'We provide professional e-publishing, textbook production, and digital content creation services'}
          </p>
          <Link
            to="/custom-order"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-white px-8 py-3 text-sm font-semibold text-indigo-700 shadow-lg transition-all hover:bg-indigo-50"
          >
            {ko ? '제작 의뢰하기' : 'Submit Request'}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Services */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          {ko ? '서비스 안내' : 'Our Services'}
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((svc, i) => {
            const Icon = svc.icon;
            return (
              <div
                key={i}
                className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm transition-all hover:shadow-md hover:-translate-y-1"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-indigo-100">
                  <Icon className="h-7 w-7 text-indigo-600" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">
                  {ko ? svc.titleKo : svc.titleEn}
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {ko ? svc.descriptionKo : svc.descriptionEn}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            {ko ? '왜 드림아이티비즈인가?' : 'Why DreamIT Biz?'}
          </h2>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg bg-white p-4 shadow-sm">
                <CheckCircle className="h-5 w-5 shrink-0 text-green-500" />
                <span className="text-sm font-medium text-gray-700">
                  {ko ? feat.ko : feat.en}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {ko ? '맞춤 제작이 필요하신가요?' : 'Need custom content?'}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-gray-600">
          {ko
            ? '교재, 전자출판, 교육 자료의 맞춤 제작을 의뢰하세요. 빠르고 전문적인 서비스를 제공합니다.'
            : 'Request custom-made textbooks, e-publications, and educational materials. We provide fast and professional services.'}
        </p>
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            to="/custom-order"
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-indigo-700"
          >
            {ko ? '제작 의뢰하기' : 'Submit Request'}
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-8 py-3 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-50"
          >
            {ko ? '카탈로그 보기' : 'View Catalog'}
          </Link>
        </div>
      </section>
    </>
  );
}
