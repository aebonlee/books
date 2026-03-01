import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';
import {
  BookOpen,
  Newspaper,
  GraduationCap,
  Presentation,
  Code,
  Tablet,
} from 'lucide-react';
import type { CategoryInfo } from '@/types/book';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Newspaper,
  GraduationCap,
  Presentation,
  Code,
  Tablet,
};

interface CategoryCardProps {
  category: CategoryInfo;
  locale?: string;
  bookCount?: number;
}

export function CategoryCard({ category, locale = 'ko', bookCount }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || BookOpen;

  return (
    <Link href={`/category/${category.slug}`}>
      <Card className="group h-full transition-all hover:shadow-md hover:-translate-y-0.5">
        <CardContent className="flex items-center gap-4 p-5 sm:flex-col sm:text-center sm:p-6">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${category.color} text-white`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <div className="sm:flex sm:flex-col sm:items-center">
            <h3 className="text-sm font-semibold text-gray-900 group-hover:text-blue-600">
              {locale === 'ko' ? category.nameKo : category.nameEn}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500">
              {locale === 'ko' ? category.descriptionKo : category.descriptionEn}
            </p>
          </div>
          {bookCount !== undefined && (
            <span className="mt-2 text-xs text-gray-400">
              {bookCount} {locale === 'ko' ? '권' : 'books'}
            </span>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}
