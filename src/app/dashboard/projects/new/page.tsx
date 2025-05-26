"use client";

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import ProjectForm from '@/components/forms/ProjectForm';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/projects'); 
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Add New Hiyaw Project"
        description="Showcase a new animation project by filling out the details below."
      />
      <div className="max-w-3xl w-full mx-auto">
        <ProjectForm onFormSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}