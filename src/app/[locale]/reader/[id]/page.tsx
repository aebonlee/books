'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { PdfViewer } from '@/components/reader/pdf-viewer';
import { EpubReader } from '@/components/reader/epub-reader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function ReaderPage() {
  const params = useParams();
  const locale = useLocale();
  const id = params.id as string;

  // In production, fetch book data and determine content type
  // For demo, use URL params to determine type
  const [contentType] = useState<'pdf' | 'epub'>('pdf');

  // Demo URLs - in production these would come from API
  const contentUrl = `/content/${id}.${contentType}`;

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Back Button */}
      <div className="mb-4">
        <Link href={`/books/${id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {locale === 'ko' ? '도서로 돌아가기' : 'Back to Book'}
          </Button>
        </Link>
      </div>

      {/* Viewer */}
      {contentType === 'pdf' ? (
        <PdfViewer url={contentUrl} title={id} />
      ) : (
        <EpubReader url={contentUrl} title={id} />
      )}
    </div>
  );
}
