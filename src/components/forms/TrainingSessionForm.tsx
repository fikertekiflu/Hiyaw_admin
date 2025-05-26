// src/components/forms/TrainingSessionForm.tsx
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { trainingSessionSchema } from '@/lib/validators';
import { TrainingSessionFormData, TrainingSession } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { UploadCloud, Link as LinkIconFromLucide, X } from 'lucide-react';
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface TrainingSessionFormProps {
  initialData?: TrainingSession | null;
  onFormSubmitSuccess?: () => void;
}

export default function TrainingSessionForm({ initialData, onFormSubmitSuccess }: TrainingSessionFormProps) {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [newlyAddedFiles, setNewlyAddedFiles] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!initialData?._id;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger, // To manually trigger validation
  } = useForm<TrainingSessionFormData>({
    resolver: zodResolver(trainingSessionSchema),
    defaultValues: {
      title: '',
      description: '',
      google_link: '',
      images: null,
    },
  });

  // Effect to populate form and previews when initialData changes (for edit mode)
  useEffect(() => {
    if (isEditMode && initialData) {
      reset({ // Reset form with initialData
        title: initialData.title,
        description: initialData.description,
        google_link: initialData.google_link,
        images: null, // `images` in RHF is for NEW files only
      });
      setImagePreviews(initialData.images?.map(img => img.url) || []);
      setNewlyAddedFiles([]); // Clear any new files when initialData loads
    } else { // For create mode or when initialData is cleared
      reset({ title: '', description: '', google_link: '', images: null });
      setImagePreviews([]);
      setNewlyAddedFiles([]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData, reset, isEditMode]); // Rerun when initialData or isEditMode changes


  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      // In edit mode, new files mean replacement. Clear old "new" files and their previews.
      // Previews will now only show newly added files.
      // Existing image previews (from initialData) are cleared from UI to indicate replacement.
      const currentNewFiles = isEditMode ? acceptedFiles : [...newlyAddedFiles, ...acceptedFiles];
      setNewlyAddedFiles(currentNewFiles);

      const newBlobPreviews = currentNewFiles.map(file => URL.createObjectURL(file));
      // If editing, show ONLY new previews. If creating, append.
      setImagePreviews(isEditMode ? newBlobPreviews : prev => [...prev, ...newBlobPreviews]);
      
      const dataTransfer = new DataTransfer();
      currentNewFiles.forEach(file => dataTransfer.items.add(file));
      setValue("images", dataTransfer.files, { shouldValidate: true });
    }
  }, [setValue, newlyAddedFiles, isEditMode]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/gif': [], 'image/webp': [] },
    multiple: true,
  });

  // Cleanup blob URLs
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) {
          URL.revokeObjectURL(url);
        }
      });
      // Also cleanup newlyAddedFiles if they are blob urls (though they are File objects)
      // The previews array is the source of blob URLs.
    };
  }, [imagePreviews]);

  const removeImagePreview = (indexToRemove: number) => {
    const removedPreviewUrl = imagePreviews[indexToRemove];
    
    // Update previews
    const updatedPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);
    setImagePreviews(updatedPreviews);

    // If the removed preview was a blob URL (a newly added file), remove it from newlyAddedFiles
    if (removedPreviewUrl.startsWith('blob:')) {
      const updatedNewFiles = newlyAddedFiles.filter(file => URL.createObjectURL(file) !== removedPreviewUrl);
      setNewlyAddedFiles(updatedNewFiles);
      URL.revokeObjectURL(removedPreviewUrl); // Clean up blob

      // Update react-hook-form's 'images' field
      const dataTransfer = new DataTransfer();
      updatedNewFiles.forEach(file => dataTransfer.items.add(file));
      setValue("images", dataTransfer.files.length > 0 ? dataTransfer.files : null, { shouldValidate: true });
    }
    // Note: We are not directly modifying initialData.images here.
    // The backend logic (replace all if new files are sent) handles existing images.
    trigger("images");
  };

  const handleClearNewImages = () => {
    newlyAddedFiles.forEach(file => URL.revokeObjectURL(URL.createObjectURL(file))); // Clean up blobs
    setNewlyAddedFiles([]);
    setImagePreviews(initialData?.images?.map(img => img.url) || []); // Revert to showing existing images
    setValue("images", null, { shouldValidate: true }); // Clear RHF images field
  };


  const processSubmit = async (data: TrainingSessionFormData) => {
    setIsLoading(true);
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('google_link', data.google_link);

    if (newlyAddedFiles.length > 0) {
      newlyAddedFiles.forEach((file) => {
        formData.append('images', file, file.name); // Backend expects 'images'
      });
    }
    // If isEditMode and newlyAddedFiles is empty, no 'images' field is appended.
    // Backend should keep existing images.

    const url = isEditMode
        ? `${API_BASE_URL}/trainings/${initialData!._id}`
        : `${API_BASE_URL}/trainings`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, { method, body: formData });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Something went wrong');
      
      toast.success(`Training session ${isEditMode ? 'updated' : 'posted'} successfully!`);
      if (!isEditMode) {
        reset(); // Full reset for create mode
        setImagePreviews([]);
      }
      setNewlyAddedFiles([]); // Clear new files for both modes
      if (onFormSubmitSuccess) onFormSubmitSuccess();
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || `Failed to ${isEditMode ? 'update' : 'post'} training session.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-xl bg-card text-card-foreground rounded-xl border-border">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          {isEditMode ? `Edit: ${initialData?.title}` : 'Add New Training Session'}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {isEditMode ? "Update the details below. Adding new images will replace all existing ones." : "Fill in the details below."}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(processSubmit)}>
        <CardContent className="space-y-6">
          {/* Title, Description, Google Link fields */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-foreground">Title</Label>
            <Input id="title" {...register('title')} className="bg-input text-foreground border-border focus:ring-ring" />
            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">Description</Label>
            <Textarea id="description" {...register('description')} className="bg-input text-foreground border-border focus:ring-ring min-h-[120px]" rows={5} />
            {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="google_link" className="text-foreground">Google Link</Label>
            <div className="flex items-center space-x-2">
              <LinkIconFromLucide className="h-5 w-5 text-muted-foreground" />
              <Input id="google_link" type="url" {...register('google_link')} className="bg-input text-foreground border-border focus:ring-ring" />
            </div>
            {errors.google_link && <p className="text-sm text-destructive">{errors.google_link.message}</p>}
          </div>

          {/* Image Upload Section */}
          <div className="space-y-2">
            <Label htmlFor="images-dropzone" className="text-foreground">
              Session Images
              {isEditMode && <span className="text-xs text-muted-foreground ml-2">(Adding new images will replace current set)</span>}
            </Label>
            <div
              {...getRootProps()}
              className={cn(
                "mt-1 flex justify-center items-center w-full min-h-[8rem] px-6 py-4 border-2 border-border border-dashed rounded-md cursor-pointer transition-colors",
                isDragActive ? "border-primary bg-primary/10" : "hover:border-primary/70"
              )}
            >
              <input {...getInputProps()} id="images-dropzone" />
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-semibold text-primary">Click to upload</span> or drag & drop
                </p>
                <p className="text-xs text-muted-foreground">PNG, JPG, GIF, WEBP up to 5MB each. Multiple images allowed.</p>
              </div>
            </div>
            {errors.images && <p className="text-sm text-destructive">{errors.images.message as string}</p>}

            {imagePreviews.length > 0 && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                    <p className="text-sm font-medium text-foreground">
                        {isEditMode && !newlyAddedFiles.length ? "Current Images:" : "Image Previews:"}
                    </p>
                    {isEditMode && newlyAddedFiles.length > 0 && (
                        <Button type="button" variant="outline" size="sm" onClick={handleClearNewImages} className="text-xs">
                            Clear New & Revert to Original
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {imagePreviews.map((previewUrl, index) => (
                    <div key={previewUrl + index} className="relative group aspect-video rounded-md overflow-hidden border border-border shadow-sm">
                      <img src={previewUrl} alt={`Preview ${index + 1}`} className="object-cover w-full h-full" />
                      {/* Only allow removing newly added (blob) images or if explicitly designed for existing */}
                      {previewUrl.startsWith('blob:') && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6 opacity-70 group-hover:opacity-100 transition-opacity z-10"
                          onClick={() => removeImagePreview(index)}
                        >
                          <X className="h-3.5 w-3.5" />
                          <span className="sr-only">Remove image {index + 1}</span>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-6">
          <Button type="submit" size="lg" className="w-full shadow-soft hover:shadow-medium" disabled={isLoading}>
            {isLoading ? "Submitting..." : (isEditMode ? 'Update Session' : 'Post Training Session')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}