import { CategoryInfo } from '@/types/book';

export const categories: CategoryInfo[] = [
  {
    slug: 'publications',
    nameKo: '간행물',
    nameEn: 'Publications',
    descriptionKo: '학술 저널, 연구 보고서, 기술 문서',
    descriptionEn: 'Academic journals, research reports, technical documents',
    icon: 'BookOpen',
    color: 'bg-blue-500',
  },
  {
    slug: 'news',
    nameKo: '뉴스기사',
    nameEn: 'News Articles',
    descriptionKo: 'IT 산업 뉴스, 기술 트렌드, 업계 동향',
    descriptionEn: 'IT industry news, tech trends, industry updates',
    icon: 'Newspaper',
    color: 'bg-green-500',
  },
  {
    slug: 'textbooks',
    nameKo: '교재',
    nameEn: 'Textbooks',
    descriptionKo: '대학 교재, 전문 서적, 학습 도서',
    descriptionEn: 'University textbooks, professional books, learning materials',
    icon: 'GraduationCap',
    color: 'bg-purple-500',
  },
  {
    slug: 'lectures',
    nameKo: '강의안',
    nameEn: 'Lecture Notes',
    descriptionKo: '강의 자료, 프레젠테이션, 학습 가이드',
    descriptionEn: 'Lecture materials, presentations, study guides',
    icon: 'Presentation',
    color: 'bg-orange-500',
  },
  {
    slug: 'workbooks',
    nameKo: '실습교재',
    nameEn: 'Workbooks',
    descriptionKo: '실습 과제, 프로젝트 가이드, 코딩 연습',
    descriptionEn: 'Hands-on exercises, project guides, coding practice',
    icon: 'Code',
    color: 'bg-red-500',
  },
  {
    slug: 'digital',
    nameKo: '디지털교과서',
    nameEn: 'Digital Textbooks',
    descriptionKo: '인터랙티브 디지털 교과서, 멀티미디어 학습',
    descriptionEn: 'Interactive digital textbooks, multimedia learning',
    icon: 'Tablet',
    color: 'bg-indigo-500',
  },
];

export function getCategoryBySlug(slug: string): CategoryInfo | undefined {
  return categories.find((cat) => cat.slug === slug);
}

export function getCategoryName(slug: string, locale: string): string {
  const category = getCategoryBySlug(slug);
  if (!category) return slug;
  return locale === 'ko' ? category.nameKo : category.nameEn;
}
