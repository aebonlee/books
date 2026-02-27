'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PdfViewer } from '@/components/reader/pdf-viewer';
import { EpubReader } from '@/components/reader/epub-reader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export function ReaderClient({ id }: { id: string }) {
  const locale = useLocale();
  const [contentType] = useState<'pdf' | 'epub'>('pdf');
  const contentUrl = `/content/${id}.${contentType}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Link href={`/books/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === 'ko' ? '도서로 돌아가기' : 'Back to Book'}
          </Button>
        </Link>
      </div>

      {contentType === 'pdf' ? (
        <PdfViewer url={contentUrl} title={id} />
      ) : (
        <EpubReader url={contentUrl} title={id} />
      )}
    </div>
  );
}
