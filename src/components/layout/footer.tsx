import { useTranslations, useLocale } from 'next-intl';
import { siteConfig } from '@/config/site';
import { footerNav } from '@/config/navigation';
import { BookOpen } from 'lucide-react';

export function Footer() {
  const t = useTranslations('footer');
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <span className="font-bold text-gray-900">
                {locale === 'ko' ? siteConfig.nameKo : siteConfig.name}
              </span>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              {locale === 'ko' ? siteConfig.descriptionKo : siteConfig.description}
            </p>
          </div>

          {/* About Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('about')}</h3>
            <ul className="mt-3 space-y-2">
              {footerNav.about.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {locale === 'ko' ? item.titleKo : item.titleEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{t('support')}</h3>
            <ul className="mt-3 space-y-2">
              {footerNav.support.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-blue-600"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {locale === 'ko' ? item.titleKo : item.titleEn}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 pt-8">
          <p className="text-center text-sm text-gray-400">
            {t('copyright', { year: year.toString() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
