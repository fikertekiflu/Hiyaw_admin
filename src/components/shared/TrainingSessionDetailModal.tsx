
"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TrainingSession, TrainingSessionImage } from '@/types';
import Link from 'next/link';
import { Link as LinkIconFromLucide } from 'lucide-react';

interface TrainingSessionDetailModalProps {
  session: TrainingSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TrainingSessionDetailModal({ session, open, onOpenChange }: TrainingSessionDetailModalProps) {
  if (!session) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-card text-card-foreground border-border max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl font-bold text-primary">{session.title}</DialogTitle>
          <DialogDescription className="text-muted-foreground pt-1">
            Created: {session.createdAt ? new Date(session.createdAt).toLocaleDateString() : 'N/A'}
            {session.updatedAt && session.createdAt !== session.updatedAt && (
              <span className="ml-2 text-xs">(Updated: {new Date(session.updatedAt).toLocaleDateString()})</span>
            )}
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="space-y-6 p-6">
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{session.description}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-lg text-foreground mb-1.5">Google Link</h3>
              <Link 
                href={session.google_link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-sm text-primary hover:text-primary/80 underline flex items-center gap-1.5 font-medium"
              >
                <LinkIconFromLucide className="h-4 w-4" /> {session.google_link}
              </Link>
            </div>

            {session.images && session.images.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg text-foreground mb-2">Images</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {session.images.map((image: TrainingSessionImage, index: number) => (
                    <div key={image.cloudinary_id || index} className="aspect-video rounded-lg overflow-hidden border border-border shadow-soft">
                      <img 
                        src={image.url} 
                        alt={`${session.title} image ${index + 1}`} 
                        className="object-cover w-full h-full"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null; 
                            target.src = '[https://placehold.co/400x300/7F7F7F/FFFFFF?text=Image+Load+Error](https://placehold.co/400x300/7F7F7F/FFFFFF?text=Image+Load+Error)';
                          }
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
            {(!session.images || session.images.length === 0) && (
                 <div>
                    <h3 className="font-semibold text-lg text-foreground mb-2">Images</h3>
                    <p className="text-sm text-muted-foreground">No images available for this session.</p>
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
