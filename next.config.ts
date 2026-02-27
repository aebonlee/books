import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// Velite integration: build content at startup (compatible with Turbopack)
// In Next.js 16, process.argv no longer contains 'dev' during next dev;
// use NODE_ENV to detect development mode instead.
const isDev = process.env.NODE_ENV === 'development';
const isBuild = process.argv.includes('build');
if (!process.env.VELITE_STARTED && (isDev || isBuild)) {
  process.env.VELITE_STARTED = '1';
  import('velite').then((m) => m.build({ watch: isDev, clean: !isDev }));
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.dreamitbiz.com',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
