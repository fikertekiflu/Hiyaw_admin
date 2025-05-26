"use client";

import React from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Project } from '@/types';
import ReactPlayer from 'react-player/lazy'; // For video playback
import { Badge } from '@/components/ui/badge'; // For category display

interface ProjectDetailModalProps {
  project: Project | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProjectDetailModal({ project, open, onOpenChange }: ProjectDetailModalProps) {
  if (!project) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl md:max-w-3xl lg:max-w-4xl bg-card text-card-foreground border-border max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl lg:text-3xl font-bold text-primary">{project.title}</DialogTitle>
          <div className="flex items-center gap-2 pt-1">
            <Badge variant="secondary" className="capitalize bg-secondary/10 text-secondary border-secondary/30">
                {project.category.replace(/-/g, ' ')}
            </Badge>
            <DialogDescription className="text-muted-foreground text-xs">
                Created: {project.createdAt ? new Date(project.createdAt).toLocaleDateString() : 'N/A'}
            </DialogDescription>
          </div>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            {project.video?.url && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg text-foreground mb-2">Project Video</h3>
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-border bg-muted/20">
                  <ReactPlayer 
                    url={project.video.url} 
                    controls 
                    width="100%" 
                    height="100%" 
                    onError={(e) => console.error('Video player error:', e)}
                  />
                </div>
              </div>
            )}
            {!project.video?.url && (
                 <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Project Video</h3>
                    <p className="text-sm text-muted-foreground">No video available for this project.</p>
                 </div>
            )}

            {project.description && (
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-1.5">Description</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{project.description}</p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="sm:justify-start p-6 pt-4 border-t border-border">
          <DialogClose asChild>
            <Button type="button" variant="outline" className="border-border">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}