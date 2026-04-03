import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Job, User, Favorite, Application, Alert } from '../models';

export interface JobSearchParams {
  q?: string;
  location?: string;
  page?: number;
  size?: number;
  contractType?: string;
  remote?: boolean;
  minSalary?: number;
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly baseUrl = '/api';

  constructor(private http: HttpClient) {}

  // Jobs
  jobs(params: JobSearchParams): Observable<Job[]> {
    let httpParams = new HttpParams();
    if (params.q) httpParams = httpParams.set('q', params.q);
    if (params.location) httpParams = httpParams.set('location', params.location);
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.size !== undefined) httpParams = httpParams.set('size', params.size.toString());
    return this.http.get<Job[]>(`${this.baseUrl}/jobs`, { params: httpParams });
  }

  job(id: string): Observable<Job> {
    return this.http.get<Job>(`${this.baseUrl}/jobs/${id}`);
  }

  jobSources(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/jobs/sources`);
  }

  // Favorites
  getFavorites(): Observable<Favorite[]> {
    return this.http.get<Favorite[]>(`${this.baseUrl}/favorites`);
  }

  addFavorite(jobData: Job): Observable<Favorite> {
    return this.http.post<Favorite>(`${this.baseUrl}/favorites`, { jobId: jobData.id, jobData });
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/favorites/${id}`);
  }

  // Applications
  getApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.baseUrl}/applications`);
  }

  createApplication(jobData: Job): Observable<Application> {
    return this.http.post<Application>(`${this.baseUrl}/applications`, { jobId: jobData.id, jobData });
  }

  updateApplicationStatus(id: number, status: string): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/applications/${id}/status`, { status });
  }

  updateApplicationNotes(id: number, notes: string): Observable<Application> {
    return this.http.put<Application>(`${this.baseUrl}/applications/${id}/notes`, { notes });
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/applications/${id}`);
  }

  // Alerts
  getAlerts(): Observable<Alert[]> {
    return this.http.get<Alert[]>(`${this.baseUrl}/alerts`);
  }

  createAlert(alert: Partial<Alert>): Observable<Alert> {
    return this.http.post<Alert>(`${this.baseUrl}/alerts`, alert);
  }

  updateAlert(id: number, alert: Partial<Alert>): Observable<Alert> {
    return this.http.put<Alert>(`${this.baseUrl}/alerts/${id}`, alert);
  }

  deleteAlert(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/alerts/${id}`);
  }

  // User Profile
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }

  updateProfile(user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/me`, user);
  }

  uploadCv(file: File): Observable<{ cvUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ cvUrl: string }>(`${this.baseUrl}/users/me/cv`, formData);
  }

  deleteAccount(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me`);
  }
}
