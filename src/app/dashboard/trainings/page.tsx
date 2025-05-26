// src/app/(dashboard)/trainings/page.tsx
"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose 
} from "@/components/ui/dialog"; 
import { 
  PlusCircle, Edit3, Trash2, ExternalLink, Search, Image as ImageIcon, Link as LinkIconFromLucide, Loader2, AlertTriangle, Presentation, Eye
} from 'lucide-react';
import Link from 'next/link'; 
import PageHeader from '@/components/shared/PageHeader';
import { TrainingSession, TrainingSessionImage } from '@/types'; 
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import TrainingSessionForm from '@/components/forms/TrainingSessionForm'; 
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { useRouter } from 'next/navigation'; 

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import TrainingSessionDetailModal from '@/components/shared/TrainingSessionDetailModal';


export default function TrainingsListPage() {
  const [sessions, setSessions] = useState<TrainingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSessionForView, setSelectedSessionForView] = useState<TrainingSession | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSessionForEdit, setSelectedSessionForEdit] = useState<TrainingSession | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();


  const fetchTrainings = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/trainings`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch training sessions');
      }
      const result = await response.json();
      setSessions(result.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'Failed to load trainings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrainings();
  }, [fetchTrainings]);

  const handleViewSession = (session: TrainingSession) => {
    setSelectedSessionForView(session);
    setIsViewModalOpen(true);
  };

  const handleEditSession = (session: TrainingSession) => {
    setSelectedSessionForEdit(session); 
    setIsEditModalOpen(true);
  };
  
  const handleFormSubmitSuccess = () => {
    setIsEditModalOpen(false); 
    setSelectedSessionForEdit(null);
    fetchTrainings(); 
  };

  const handleDeleteTraining = async (sessionId: string | undefined) => {
    if (!sessionId) {
      toast.error("Invalid session ID for deletion.");
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this training session?")) {
      return;
    }

    toast.promise(
      fetch(`${API_BASE_URL}/trainings/${sessionId}`, { method: 'DELETE' }),
      {
        loading: 'Deleting training session...',
        success: async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to delete session and parse error' }));
            throw new Error(errorData.message || 'Failed to delete session');
          }
          fetchTrainings(); 
          return 'Training session deleted successfully!';
        },
        error: (err: any) => { 
            console.error("Delete error:", err);
            return err.message || 'Failed to delete session.';
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader
          title="Training Sessions"
          description="Browse, manage, and update all available training sessions for the Hiyaw community."
        >
          <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
            <Link href="/dashboard/trainings/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Training
            </Link>
          </Button>
        </PageHeader>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-foreground">Loading training sessions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
         <PageHeader
          title="Training Sessions"
          description="Browse, manage, and update all available training sessions for the Hiyaw community."
        >
          <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
            <Link href="/dashboard/trainings/new">
              <PlusCircle className="mr-2 h-5 w-5" /> Add New Training
            </Link>
          </Button>
        </PageHeader>
        <Card className="bg-destructive/10 text-destructive-foreground rounded-xl shadow-soft border-destructive">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Trainings</h3>
            <p className="mb-4">{error}</p>
            <Button onClick={fetchTrainings} variant="destructive">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Training Sessions"
        description="Browse, manage, and update all available training sessions for the Hiyaw community."
      >
        <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
          <Link href="/dashboard/trainings/new">
            <PlusCircle className="mr-2 h-5 w-5" /> Add New Training
          </Link>
        </Button>
      </PageHeader>

      <Card className="bg-card text-card-foreground rounded-xl shadow-soft border-border">
        <CardHeader>
            <CardTitle className="text-xl text-foreground">Filter & Search</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        type="search" 
                        placeholder="Search by title or description..." 
                        className="pl-10 w-full bg-input text-foreground border-border focus:ring-ring" 
                    />
                </div>
                <Button variant="outline" className="w-full sm:w-auto border-border hover:bg-accent/10">Apply Filters</Button>
            </div>
        </CardContent>
      </Card>

      {sessions.length === 0 ? (
        <Card className="bg-card text-card-foreground rounded-xl shadow-soft border-border">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <Presentation className="h-20 w-20 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-3 text-foreground">No Training Sessions Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              It looks like there are no training sessions available at the moment. Why not add the first one?
            </p>
            <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
              <Link href="/dashboard/trainings/new">
                <PlusCircle className="mr-2 h-5 w-5" /> Add First Training
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {sessions.map((session) => (
            <Card 
              key={session._id} 
              className="flex flex-col bg-card text-card-foreground shadow-medium hover:shadow-card-hover transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out rounded-xl overflow-hidden border-border hover:border-primary/50 group"
            >
              <div className="aspect-video w-full bg-muted/20 flex items-center justify-center text-muted-foreground overflow-hidden">
                {session.images && session.images.length > 0 && session.images[0].url ? (
                  <img 
                    src={session.images[0].url} 
                    alt={session.title} 
                    className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = 'https://placehold.co/600x400/7F7F7F/FFFFFF?text=Image+Error';
                      }
                    }
                  />
                ) : (
                  <ImageIcon className="h-16 w-16" />
                )}
              </div>
              <CardHeader className="flex-grow pt-5 pb-2 px-5">
                <CardTitle className="text-lg font-semibold leading-tight mb-1.5 text-foreground group-hover:text-primary transition-colors">
                   {session.title}
                </CardTitle>
                <CardDescription className="text-sm text-muted-foreground line-clamp-3 h-[3.75rem]">
                  {session.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="py-3 px-5">
                <Link 
                  href={session.google_link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-xs text-primary hover:text-primary/80 underline flex items-center gap-1.5 font-semibold"
                >
                  <LinkIconFromLucide className="h-4 w-4" />
                  Access Material/Session
                </Link>
              </CardContent>
              <CardFooter className="border-t border-border/50 pt-3 pb-3 px-5 flex items-center justify-between gap-2.5">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 px-2" onClick={() => handleViewSession(session)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEditSession(session)}>
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="text-xs"
                    onClick={() => handleDeleteTraining(session._id)}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <TrainingSessionDetailModal 
        session={selectedSessionForView} 
        open={isViewModalOpen} 
        onOpenChange={setIsViewModalOpen} 
      />
      {selectedSessionForEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) setSelectedSessionForEdit(null); 
          setIsEditModalOpen(open);
        }}>
          <DialogContent className="sm:max-w-2xl bg-card text-card-foreground border-border max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-4 border-b border-border">
              <DialogTitle className="text-2xl text-primary">Edit Training Session</DialogTitle>
              <DialogDescription className="text-muted-foreground pt-1">
                Update the details for "{selectedSessionForEdit.title}".
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-6">
                <TrainingSessionForm 
                  initialData={selectedSessionForEdit} 
                  onFormSubmitSuccess={handleFormSubmitSuccess} 
                />
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}