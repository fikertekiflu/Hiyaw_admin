// src/components/forms/ProjectForm.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { projectSchema, PROJECT_CATEGORIES } from '@/lib/validators';
import { ProjectFormData, Project } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UploadCloud, X, Video } from 'lucide-react';
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ReactPlayer from 'react-player/lazy';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ProjectFormProps {
  initialData?: Project | null;
  onFormSubmitSuccess?: () => void;
}

export default function ProjectForm({ initialData, onFormSubmitSuccess }: ProjectFormProps) {
  const [videoPreview, setVideoPreview] = useState<string | null>(initialData?.video?.url || null);
  const [newVideoFile, setNewVideoFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData?._id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    control, // For Select component
    trigger,
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      category: PROJECT_CATEGORIES[0], // Default to the first category
      description: '',
      videoFile: null,
    },
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      reset({
        title: initialData.title,
        category: initialData.category as typeof PROJECT_CATEGORIES[number], // Cast to ensure type match
        description: initialData.description || '',
        videoFile: null,
      });
      setVideoPreview(initialData.video?.url || null);
      setNewVideoFile(null);
    } else {
      reset({ title: '', category: PROJECT_CATEGORIES[0], description: '', videoFile: null });
      setVideoPreview(null);
      setNewVideoFile(null);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, reset, isEditMode]);

  const onDropVideo = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setNewVideoFile(file);
      setVideoPreview(URL.createObjectURL(file));
      setValue("videoFile", file, { shouldValidate: true });
    }
  }, [setValue]);

  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps, isDragActive: isVideoDragActive } = useDropzone({
    onDrop: onDropVideo,
    accept: { 'video/*': ['.mp4', '.webm', '.ogg', '.mov', '.mkv'] }, // More specific video types
    multiple: false,
  });

  useEffect(() => {
    return () => {
      if (videoPreview && videoPreview.startsWith('blob:')) {
        URL.revokeObjectURL(videoPreview);
      }
    };
  }, [videoPreview]);

  const removeVideo = () => {
    if (videoPreview && videoPreview.startsWith('blob:')) {
      URL.revokeObjectURL(videoPreview);
    }
    setNewVideoFile(null);
    setVideoPreview(isEditMode ? initialData?.video?.url || null : null); // Revert to initial or clear
    setValue("videoFile", null, { shouldValidate: true });
  };

  const processSubmit = async (data: ProjectFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('category', data.category);
    if (data.description) {
      formData.append('description', data.description);
    }

    if (newVideoFile) { // Only append if a new video file was selected
      formData.append('videoFile', newVideoFile, newVideoFile.name);
    }
    // If isEditMode and newVideoFile is null, no 'videoFile' is appended.
    // Backend should keep existing video.

    const url = isEditMode
        ? `${API_BASE_URL}/projects/${initialData!._id}`
        : `${API_BASE_URL}/projects`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      
      toast.success(`Project ${isEditMode ? 'updated' : 'created'} successfully!`);
      if (!isEditMode) {
        reset();
        setVideoPreview(null);
      }
      setNewVideoFile(null); // Clear new file after submission
      if (onFormSubmitSuccess) onFormSubmitSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'create'} project.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card text-card-foreground rounded-xl border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {isEditMode ? `Edit Project: ${initialData?.title}` : 'Add New Project'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isEditMode ? "Update the project details below. Adding a new video will replace the current one." : "Fill in the details to create a new Hiyaw project."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Project Title</Label>
            <Input id="title" {...register('title')} className="bg-input text-foreground border-border focus:ring-ring" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-foreground">Category</Label>
            <Controller
              control={control}
              name="category"
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full bg-input text-foreground border-border focus:ring-ring">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover text-popover-foreground">
                    {PROJECT_CATEGORIES.map(cat => (
                      <SelectItem key={cat} value={cat} className="capitalize hover:bg-accent/50 focus:bg-accent/50">
                        {cat.replace(/-/g, ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description (Optional)</Label>
            <Textarea id="description" {...register('description')} placeholder="Briefly describe the project..." className="bg-input text-foreground border-border focus:ring-ring min-h-[100px]" rows={4} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="videoFile-dropzone" className="text-foreground">
              Project Video {isEditMode && videoPreview && !videoPreview.startsWith('blob:') && "(Current video shown. Upload new to replace.)"}
            </Label>
            <div
              {...getVideoRootProps()}
              className={cn(
                "mt-1 flex flex-col justify-center items-center w-full min-h-[10rem] px-6 py-4 border-2 border-border border-dashed rounded-md cursor-pointer transition-colors",
                isVideoDragActive ? "border-primary bg-primary/10" : "hover:border-primary/70"
              )}
            >
              <input {...getVideoInputProps()} id="videoFile-dropzone" />
              {videoPreview ? (
                <div className="relative group w-full max-w-md aspect-video">
                   <ReactPlayer
                        url={videoPreview}
                        width="100%"
                        height="100%"
                        controls
                        onError={(e) => { console.error('Video Error:', e); setVideoPreview(null); toast.error("Error loading video preview.");}}
                    />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity z-10"
                    onClick={(e) => { e.stopPropagation(); removeVideo(); }}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove video</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-1 text-center">
                  <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                  {isVideoDragActive ? (
                    <p className="text-sm text-primary">Drop the video here ...</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-primary">Click to upload</span> or drag & drop video
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">MP4, WEBM, OGG, MOV, MKV up to 50MB</p>
                </div>
              )}
            </div>
            {errors.videoFile && <p className="text-sm text-destructive">{errors.videoFile.message as string}</p>}
          </div>
        </CardContent>
        <CardFooter className="pt-6">
          <Button type="submit" size="lg" className="w-full shadow-soft hover:shadow-medium" disabled={isLoading}>
            {isLoading ? "Submitting..." : (isEditMode ? 'Update Project' : 'Create Project')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
