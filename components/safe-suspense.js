import React from 'react';
import { IS_SSR } from 'jotai-query-toolkit';

export function SafeSuspense({ fallback, children }) {
  if (IS_SSR) return <>{fallback}</>;
  return <React.Suspense fallback={fallback}>{children}</React.Suspense>;
}
