"use client";

import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import DynamicDisciplineForm from '@/components/dpr/DynamicDisciplineForm';
import { ISSUE_SCHEMA } from '@/lib/form-schemas';

function IssueFormWrapper() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const schemeId = searchParams.get('schemeId');

  return (
    <DynamicDisciplineForm 
      title="Issue Report"
      schemeId={schemeId}
      fields={ISSUE_SCHEMA}
      onBack={() => router.back()}
      skipManpower={true}
    />
  );
}

export default function IssuePage() {
  return (
    <Suspense fallback={<div className="p-10 font-bold text-center">Loading Issue Form...</div>}>
      <IssueFormWrapper />
    </Suspense>
  );
}
