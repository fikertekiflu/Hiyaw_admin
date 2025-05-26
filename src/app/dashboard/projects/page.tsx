"use client"; 

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose 
} from "@/components/ui/dialog"; 
import { 
  PlusCircle, Edit3, Trash2, Search, Video as VideoIcon, Loader2, AlertTriangle, Eye, FolderKanban
} from 'lucide-react'; // Changed Image to VideoIcon
import Link from 'next/link'; 
import PageHeader from '@/components/shared/PageHeader';
import { Project } from '@/types'; 
import { Input } from '@/components/ui/input';
import { toast } from "sonner";
import ProjectForm from '@/components/forms/ProjectForm'; 
import { ScrollArea } from "@/components/ui/scroll-area"; 
import { useRouter } from 'next/navigation'; 
import ProjectDetailModal from '@/components/shared/ProjectDetailModal';
import { Badge } from '@/components/ui/badge';
import ReactPlayer from 'react-player/lazy';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProjectForView, setSelectedProjectForView] = useState<Project | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProjectForEdit, setSelectedProjectForEdit] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const router = useRouter();

  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/projects`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch projects');
      }
      const result = await response.json();
      setProjects(result.data || []);
    } catch (err: any) {
      console.error("Fetch error:", err);
      setError(err.message || 'An unexpected error occurred.');
      toast.error(err.message || 'Failed to load projects.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleViewProject = (project: Project) => {
    setSelectedProjectForView(project);
    setIsViewModalOpen(true);
  };

  const handleEditProject = (project: Project) => {
    setSelectedProjectForEdit(project); 
    setIsEditModalOpen(true);
  };
  
  const handleFormSubmitSuccess = () => {
    setIsEditModalOpen(false); 
    setSelectedProjectForEdit(null);
    fetchProjects(); 
  };

  const handleDeleteProject = async (projectId: string | undefined) => {
    if (!projectId) {
      toast.error("Invalid project ID for deletion.");
      return;
    }
    // eslint-disable-next-line no-restricted-globals
    if (!confirm("Are you sure you want to delete this project? This will also delete its video from Cloudinary.")) {
      return;
    }

    toast.promise(
      fetch(`${API_BASE_URL}/projects/${projectId}`, { method: 'DELETE' }),
      {
        loading: 'Deleting project...',
        success: async (response) => {
          if (!response.ok) {
            const errorData = await response.json().catch(() => ({ message: 'Failed to delete project and parse error' }));
            throw new Error(errorData.message || 'Failed to delete project');
          }
          fetchProjects(); 
          return 'Project deleted successfully!';
        },
        error: (err: any) => { 
            console.error("Delete error:", err);
            return err.message || 'Failed to delete project.';
        },
      }
    );
  };

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex flex-col gap-8">
        <PageHeader title="Animation Projects" description="Manage all Hiyaw animation projects.">
          <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
            <Link href="/dashboard/projects/new"><PlusCircle className="mr-2 h-5 w-5" /> Add New Project</Link>
          </Button>
        </PageHeader>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-4 text-lg text-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col gap-8">
         <PageHeader title="Animation Projects" description="Manage all Hiyaw animation projects.">
          <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
            <Link href="/dashboard/projects/new"><PlusCircle className="mr-2 h-5 w-5" /> Add New Project</Link>
          </Button>
        </PageHeader>
        <Card className="bg-destructive/10 text-destructive-foreground rounded-xl shadow-soft border-destructive">
          <CardContent className="py-12 flex flex-col items-center justify-center text-center">
            <AlertTriangle className="h-16 w-16 text-destructive mb-4" />
            <h3 className="text-xl font-semibold mb-2">Error Loading Projects</h3>
            <p className="mb-4">{error}</p>
            <Button onClick={fetchProjects} variant="destructive">Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader title="Animation Projects" description="Browse, manage, and showcase all Hiyaw animation projects.">
        <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
          <Link href="/dashboard/projects/new"><PlusCircle className="mr-2 h-5 w-5" /> Add New Project</Link>
        </Button>
      </PageHeader>

      <Card className="bg-card text-card-foreground rounded-xl shadow-soft border-border">
        <CardHeader><CardTitle className="text-xl text-foreground">Filter & Search Projects</CardTitle></CardHeader>
        <CardContent>
            <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative flex-1 w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input type="search" placeholder="Search by title or category..." className="pl-10 w-full bg-input text-foreground border-border focus:ring-ring" />
                </div>
                <Button variant="outline" className="w-full sm:w-auto border-border hover:bg-accent/10">Apply Filters</Button>
            </div>
        </CardContent>
      </Card>

      {projects.length === 0 ? (
        <Card className="bg-card text-card-foreground rounded-xl shadow-soft border-border">
          <CardContent className="py-16 flex flex-col items-center justify-center text-center">
            <FolderKanban className="h-20 w-20 text-muted-foreground mb-6" />
            <h3 className="text-2xl font-semibold mb-3 text-foreground">No Projects Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md">Showcase Hiyaw's animations by adding the first project.</p>
            <Button asChild size="lg" className="shadow-soft hover:shadow-medium transition-shadow">
              <Link href="/dashboard/projects/new"><PlusCircle className="mr-2 h-5 w-5" /> Add First Project</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Card 
              key={project._id} 
              className="flex flex-col bg-card text-card-foreground shadow-medium hover:shadow-card-hover transform hover:-translate-y-1.5 transition-all duration-300 ease-in-out rounded-xl overflow-hidden border-border hover:border-primary/50 group"
            >
              <div className="aspect-video w-full bg-muted/20 flex items-center justify-center text-muted-foreground overflow-hidden">
                {project.video?.url ? (
                  // Simple placeholder for video, actual player in modal
                  <div className="w-full h-full flex items-center justify-center bg-black relative">
                     <VideoIcon className="h-16 w-16 text-white/70" />
                     <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-white text-xs">Video Available</div>
                  </div>
                ) : (
                  <VideoIcon className="h-16 w-16" />
                )}
              </div>
              <CardHeader className="flex-grow pt-5 pb-2 px-5">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold leading-tight mb-1 text-foreground group-hover:text-primary transition-colors">
                    {project.title}
                    </CardTitle>
                    <Badge variant="secondary" className="capitalize text-xs bg-secondary/10 text-secondary border-secondary/30 whitespace-nowrap">
                        {project.category.replace(/-/g, ' ')}
                    </Badge>
                </div>
                {project.description && (
                    <CardDescription className="text-sm text-muted-foreground line-clamp-2 h-[2.5rem] mt-1">
                        {project.description}
                    </CardDescription>
                )}
              </CardHeader>
              <CardFooter className="border-t border-border/50 pt-3 pb-3 px-5 flex items-center justify-between gap-2.5">
                <Button variant="ghost" size="sm" className="text-xs text-primary hover:text-primary/80 px-2" onClick={() => handleViewProject(project)}>
                  <Eye className="mr-1.5 h-3.5 w-3.5" /> View
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs" onClick={() => handleEditProject(project)}>
                    <Edit3 className="mr-1.5 h-3.5 w-3.5" /> Edit
                  </Button>
                  <Button variant="destructive" size="sm" className="text-xs" onClick={() => handleDeleteProject(project._id)}>
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <ProjectDetailModal 
        project={selectedProjectForView} 
        open={isViewModalOpen} 
        onOpenChange={setIsViewModalOpen} 
      />
      {selectedProjectForEdit && (
        <Dialog open={isEditModalOpen} onOpenChange={(open) => {
          if (!open) setSelectedProjectForEdit(null); 
          setIsEditModalOpen(open);
        }}>
          <DialogContent className="sm:max-w-2xl bg-card text-card-foreground border-border max-h-[90vh] flex flex-col p-0">
            <DialogHeader className="p-6 pb-4 border-b border-border">
              <DialogTitle className="text-2xl text-primary">Edit Project</DialogTitle>
              <DialogDescription className="text-muted-foreground pt-1">
                Update the details for "{selectedProjectForEdit.title}".
              </DialogDescription>
            </DialogHeader>
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-6">
                <ProjectForm 
                  initialData={selectedProjectForEdit} 
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
