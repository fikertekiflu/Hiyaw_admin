import { z } from 'zod';

const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
const MAX_VIDEO_FILE_SIZE = 50 * 1024 * 1024; // 50MB for video example
const ACCEPTED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/ogg", "video/quicktime", "video/x-matroska"];


export const trainingSessionSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }).max(100, { message: "Title must be 100 characters or less." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters long." }).max(1000, { message: "Description must be 1000 characters or less." }),
  google_link: z.string().url({ message: "Please enter a valid URL for the Google link." }),
  images: z.instanceof(FileList)
    .refine(files => files.length > 0, "At least one image is required.") 
    .refine(files => Array.from(files).every(file => file.size <= MAX_IMAGE_FILE_SIZE), `Each image must be 5MB or less.`)
    .refine(files => Array.from(files).every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)), "Only .jpg, .jpeg, .png, .webp and .gif formats are supported.")
    .optional() 
    .nullable(),
});

// Project Schema
export const PROJECT_CATEGORIES = [
    "storytelling", 
    "social-awareness", 
    "mental-health", 
    "cultural-heritage", 
    "tutorial", 
    "showcase",
    "experimental",
    "short-film"
] as const;


export const projectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters.").max(150, "Title must be 150 characters or less."),
  category: z.enum(PROJECT_CATEGORIES, {
    errorMap: () => ({ message: "Please select a valid category." }),
  }),
  description: z.string().max(2000, "Description must be 2000 characters or less.").optional().nullable(),
  videoFile: z.instanceof(File)
    .refine(file => file.size <= MAX_VIDEO_FILE_SIZE, `Max video size is 50MB.`)
    .refine(file => ACCEPTED_VIDEO_TYPES.includes(file.type), "Only .mp4, .webm, .ogg, .mov, .mkv formats are supported.")
    // Make videoFile optional for edit mode, but required for create mode (handled in form logic)
    .optional()
    .nullable(),
});