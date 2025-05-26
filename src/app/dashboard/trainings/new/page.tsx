"use client";

import React from 'react';
import PageHeader from '@/components/shared/PageHeader';
import TrainingSessionForm from '@/components/forms/TrainingSessionForm';
import { useRouter } from 'next/navigation';

export default function NewTrainingPage() {
  const router = useRouter();

  const handleSuccess = () => {
    router.push('/dashboard/trainings'); 
  };

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Create New Training Session"
        description="Fill out the form below to add a new training session to the Hiyaw platform."
      />
      <div className="max-w-3xl w-full mx-auto">
        <TrainingSessionForm onFormSubmitSuccess={handleSuccess} />
      </div>
    </div>
  );
}