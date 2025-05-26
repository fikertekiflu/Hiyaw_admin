export interface TrainingSessionImage {
  url: string;
  cloudinary_id: string;
}

export interface TrainingSession {
  _id?: string;
  title: string;
  description: string;
  images?: TrainingSessionImage[]; // Array of images from backend
  google_link: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TrainingSessionFormData {
  title: string;
  description: string;
  google_link: string;
  images?: FileList | null; 
}

// Project Types
export interface ProjectVideo {
  url: string;
  cloudinary_id: string;
}

export interface Project {
  _id?: string;
  title: string;
  category: string; // e.g., 'storytelling', 'social-awareness', 'mental-health', 'cultural-heritage'
  video?: ProjectVideo; // Single video object
  description?: string; // Optional description for project
  createdAt?: string;
  updatedAt?: string;
}

export interface ProjectFormData {
  title: string;
  category: string;
  videoFile?: File | null; // Single video file for upload
  description?: string;
}