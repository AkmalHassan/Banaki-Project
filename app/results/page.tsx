import { Suspense } from 'react';
import ResultsClientWrapper from './ResultsClientWrapper';

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <ResultsClientWrapper />
    </Suspense>
  );
}
