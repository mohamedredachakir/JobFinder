export interface Job {
  id: string;
  sourceId: string;
  source: string;
  title: string;
  company: string;
  location: string;
  country: string;
  remote: boolean | null;
  contractType: string;
  description: string;
  category: string;
  applyUrl: string;
  logoUrl: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency: string;
  tags: string[];
  postedAt: string;
  expiresAt: string | null;
  matchScore?: number;
  type?: string;
  skills?: string[];
  workMode?: string;
  salary?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  cvUrl: string | null;
  preferredLocation: string | null;
  preferredSector: string | null;
  preferredSalary: number | null;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface Favorite {
  id: number;
  jobId: string;
  jobData: Job;
  savedAt: string;
}

export interface Application {
  id: number;
  jobId: string;
  jobData: Job;
  status: ApplicationStatus;
  notes: string | null;
  appliedAt: string;
  interviewDate: string | null;
  updatedAt: string;
  savedAt?: string;
}

export type ApplicationStatus = 'SAVED' | 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'ACCEPTED' | 'REJECTED';

export interface Alert {
  id: number;
  keywords: string;
  location: string | null;
  contractType: string | null;
  minSalary: number | null;
  frequency: AlertFrequency;
  isActive: boolean;
  lastSentAt: string | null;
  createdAt: string;
}

export type AlertFrequency = 'IMMEDIATE' | 'DAILY' | 'WEEKLY';

export interface DashboardStats {
  jobsViewed: number;
  applicationsCount: number;
  interviewsCount: number;
  pendingCount: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
