"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DynamicDisciplineForm from '@/components/dpr/DynamicDisciplineForm';
import { TPI_SCHEMA } from '@/lib/form-schemas';

function TPIFormWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const schemeId = searchParams.get('schemeId');

  return (
    <DynamicDisciplineForm 
      title="TPI Inspection"
      schemeId={schemeId}
      fields={TPI_SCHEMA}
      onBack={() => router.back()}
    />
  );
}

export default function TPIPage() {
  return (
    <Suspense fallback={<div className="p-10 font-bold text-center">Loading TPI Form...</div>}>
      <TPIFormWrapper />
    </Suspense>
  );
}
