import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
}

export function SEOHead({ title, description }: SEOHeadProps) {
  useEffect(() => {
    const base = '드림아이티비즈 출판';
    document.title = title ? `${title} | ${base}` : `DreamIT Books | ${base}`;
    if (description) {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', description);
    }
  }, [title, description]);

  return null;
}

export default SEOHead;
