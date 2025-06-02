'use client';

import dynamic from 'next/dynamic';

// Dynamic import with ssr: false — now valid because it's in a Client Component
const ResultsClient = dynamic(() => import('./ResultsClient'), {
  ssr: false,
});

export default function ResultsClientWrapper() {
  return <ResultsClient />;
}
