import { z } from "zod";

const API_BASE = import.meta.env.VITE_API_URL;

// Types
export type JobStatus = "pending" | "processing" | "generated" | "sent" | "failed";

export interface Job {
  _id: string;
  prompt: string;
  recipient: string;
  generatedContent: string;
  status: JobStatus;
  error: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateJobResponse {
  id: string;
  status: JobStatus;
}

// Validation
export const createJobSchema = z.object({
  prompt: z.string().trim().min(1, "Prompt jest wymagany").max(2000, "Prompt może mieć maks. 2000 znaków"),
  recipient: z.string().trim().email("Podaj poprawny adres email").max(255, "Email za długi"),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

// API functions
export async function createJob(data: CreateJobInput): Promise<CreateJobResponse> {
  const res = await fetch(`${API_BASE}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Błąd: ${res.status}`);
  return res.json();
}

export async function getJob(id: string): Promise<Job> {
  const res = await fetch(`${API_BASE}/jobs/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`Błąd: ${res.status}`);
  return res.json();
}

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${API_BASE}/jobs`);
  if (!res.ok) throw new Error(`Błąd: ${res.status}`);
  return res.json();
}
