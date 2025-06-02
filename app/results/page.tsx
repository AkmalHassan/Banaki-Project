import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically load the ResultsClient component (client-only)
const ResultsClient = dynamic(() => import('./ResultsClient'), {
  ssr: false, // ⛔ disable SSR for this client-only page
});

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ResultsClient />
    </Suspense>
  );
}
