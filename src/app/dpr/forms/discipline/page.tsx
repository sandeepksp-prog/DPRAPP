"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DynamicDisciplineForm from '@/components/dpr/DynamicDisciplineForm';
import { DISCIPLINE_SCHEMAS } from '@/lib/form-schemas';

function DisciplineFormWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const type = searchParams.get('type') || 'Unknown';
  const schemeId = searchParams.get('schemeId');

  const fields = DISCIPLINE_SCHEMAS[type] || [];

  return (
    <DynamicDisciplineForm 
      title={type}
      schemeId={schemeId}
      fields={fields}
      onBack={() => router.back()}
    />
  );
}

export default function DisciplinePage() {
  return (
    <Suspense fallback={<div className="p-10 font-bold text-center">Loading Form...</div>}>
      <DisciplineFormWrapper />
    </Suspense>
  );
}
