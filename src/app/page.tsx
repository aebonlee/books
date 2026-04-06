'use client';

import { useEffect } from 'react';

export default function RootPage() {
  useEffect(() => {
    window.location.replace('/ko');
  }, []);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <meta httpEquiv="refresh" content="0; url=/ko/" />
      <p>
        Redirecting... <a href="/ko/">Click here</a>
      </p>
    </div>
  );
}
