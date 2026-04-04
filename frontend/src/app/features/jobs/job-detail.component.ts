import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { Job } from '../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="job-detail-page" *ngIf="job; else loadingTemplate">
      <!-- Header -->
      <header class="header">
        <div class="header-container">
          <a routerLink="/jobs" class="back-link">
            <span class="material-symbols-outlined">arrow_back</span>
            Back to jobs
          </a>
        </div>
      </header>

      <main class="main-content">
        <div class="content-container">
          <!-- Job Header -->
          <div class="job-header-card">
            <div class="job-main">
              <div class="job-logo">
                <img [src]="job.logoUrl || 'https://via.placeholder.com/64'" [alt]="job.company" />
              </div>
              <div class="job-info">
                <h1>{{ job.title }}</h1>
                <p class="company-name">{{ job.company }}</p>
                <div class="job-meta">
                  <span class="meta-item">
                    <span class="material-symbols-outlined">location_on</span>
                    {{ job.location }}
                  </span>
                  <span class="meta-item" *ngIf="job.remote">
                    <span class="material-symbols-outlined">home_work</span>
                    Remote
                  </span>
                  <span class="meta-item">
                    <span class="material-symbols-outlined">schedule</span>
                    {{ getTimeAgo(job.postedAt) }}
                  </span>
                </div>
              </div>
            </div>
            <div class="job-actions">
              <button class="btn-secondary" (click)="share()">
                <span class="material-symbols-outlined">share</span>
                Partager
              </button>
              <button class="btn-secondary" (click)="saveToFavorites()" [class.saved]="isSaved">
                <span class="material-symbols-outlined">{{ isSaved ? 'bookmark' : 'bookmark_border' }}</span>
                {{ isSaved ? 'Sauvegarde' : 'Sauvegarder' }}
              </button>
              <a [href]="job.applyUrl" target="_blank" class="btn-primary">
                <span class="material-symbols-outlined">open_in_new</span>
                Postuler
              </a>
            </div>
          </div>

          <div class="job-content-grid">
            <!-- Main Content -->
            <div class="job-main-content">
              <!-- Description -->
              <section class="content-section">
                <h2>Description</h2>
                <div class="description" [innerHTML]="job.description"></div>
              </section>

              <!-- Tags -->
              <section class="content-section" *ngIf="job.tags && job.tags.length">
                <h2>Competences</h2>
                <div class="tags-list">
                  <span class="tag" *ngFor="let tag of job.tags">{{ tag }}</span>
                </div>
              </section>
            </div>

            <!-- Sidebar -->
            <aside class="job-sidebar">
              <!-- Salary Card -->
              <div class="sidebar-card salary-card" *ngIf="job.salaryMin">
                <h3>Salaire</h3>
                <div class="salary-range">
                  <span class="salary-value">{{ formatSalary(job.salaryMin) }}</span>
                  <span class="salary-separator">-</span>
                  <span class="salary-value">{{ formatSalary(job.salaryMax || job.salaryMin) }}</span>
                </div>
                <p class="salary-period">Par an</p>
              </div>

              <!-- Job Info Card -->
              <div class="sidebar-card info-card">
                <h3>Details</h3>
                <div class="info-list">
                  <div class="info-item" *ngIf="job.contractType">
                    <span class="info-label">Type de contrat</span>
                    <span class="info-value">{{ job.contractType }}</span>
                  </div>
                  <div class="info-item" *ngIf="job.category">
                    <span class="info-label">Secteur</span>
                    <span class="info-value">{{ job.category }}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">Source</span>
                    <span class="info-value source-badge">{{ job.source }}</span>
                  </div>
                </div>
              </div>

              <!-- Company Card -->
              <div class="sidebar-card company-card">
                <h3>Entreprise</h3>
                <div class="company-info">
                  <img [src]="job.logoUrl || 'https://via.placeholder.com/48'" [alt]="job.company" class="company-logo" />
                  <div>
                    <p class="company-name">{{ job.company }}</p>
                    <p class="company-location">{{ job.location }}</p>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </div>

    <ng-template #loadingTemplate>
      <div class="loading-state">
        <div class="loading-spinner"></div>
        <p>Chargement...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .job-detail-page {
      min-height: 100vh;
      background: #F8FAFC;
    }

    .header {
      background: white;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      padding: 1rem 2rem;
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .back-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }

    .back-link:hover {
      color: #2563EB;
    }

    .main-content {
      padding: 2rem;
    }

    .content-container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .job-header-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .job-main {
      display: flex;
      gap: 1.5rem;
      flex: 1;
    }

    .job-logo {
      width: 5rem;
      height: 5rem;
      border-radius: 1rem;
      background: #f0f4ff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .job-logo img {
      width: 3rem;
      height: 3rem;
      object-fit: contain;
    }

    .job-info h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 0.5rem;
    }

    .company-name {
      font-size: 1.1rem;
      color: #64748b;
      margin-bottom: 1rem;
    }

    .job-meta {
      display: flex;
      gap: 1.5rem;
      flex-wrap: wrap;
    }

    .meta-item {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .meta-item .material-symbols-outlined {
      font-size: 1.1rem;
    }

    .job-actions {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #f2f4f6;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #1E293B;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-secondary:hover {
      background: #e6e8ea;
    }

    .btn-secondary.saved {
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #2563EB, #2563eb);
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      color: white;
      text-decoration: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.2);
      transition: all 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 6px 16px rgba(0, 74, 198, 0.3);
    }

    .job-content-grid {
      display: grid;
      grid-template-columns: 1fr 320px;
      gap: 2rem;
    }

    .content-section {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      margin-bottom: 1.5rem;
    }

    .content-section h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 1rem;
    }

    .description {
      color: #64748b;
      line-height: 1.8;
      white-space: pre-wrap;
    }

    .tags-list {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.5rem 1rem;
      background: #eceef0;
      color: #64748b;
      font-size: 0.85rem;
      font-weight: 500;
      border-radius: 999px;
    }

    .job-sidebar {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .sidebar-card {
      background: white;
      border-radius: 1.5rem;
      padding: 1.5rem;
    }

    .sidebar-card h3 {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
      margin-bottom: 1rem;
    }

    .salary-card .salary-range {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .salary-value {
      font-size: 1.75rem;
      font-weight: 700;
      color: #2563EB;
    }

    .salary-separator {
      font-size: 1.25rem;
      color: #94a3b8;
    }

    .salary-period {
      text-align: center;
      color: #94a3b8;
      font-size: 0.85rem;
      margin-top: 0.5rem;
    }

    .info-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .info-label {
      color: #94a3b8;
      font-size: 0.9rem;
    }

    .info-value {
      font-weight: 600;
      color: #1E293B;
    }

    .source-badge {
      padding: 0.25rem 0.75rem;
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
      border-radius: 999px;
      font-size: 0.75rem;
    }

    .company-info {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .company-logo {
      width: 3rem;
      height: 3rem;
      border-radius: 0.75rem;
      object-fit: contain;
    }

    .company-info .company-name {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .company-location {
      font-size: 0.85rem;
      color: #94a3b8;
    }

    .loading-state {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      color: #64748b;
    }

    .loading-spinner {
      width: 40px;
      height: 40px;
      border: 3px solid #e6e8ea;
      border-top-color: #2563EB;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @media (max-width: 900px) {
      .job-content-grid {
        grid-template-columns: 1fr;
      }

      .job-header-card {
        flex-direction: column;
      }

      .job-main {
        flex-direction: column;
      }
    }
  `]
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  isSaved = false;
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private api: ApiService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.api.job(id).subscribe({
        next: (data) => {
          this.job = data;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  getTimeAgo(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
    
    if (diff < 1) return "Aujourd'hui";
    if (diff < 7) return `Il y a ${Math.floor(diff)} jours`;
    if (diff < 30) return `Il y a ${Math.floor(diff / 7)} semaines`;
    return `Il y a ${Math.floor(diff / 30)} mois`;
  }

  formatSalary(amount: number): string {
    if (!amount) return '0';
    const symbol = this.job?.salaryCurrency === 'USD' ? '$' : '€';
    return symbol + amount.toLocaleString();
  }

  saveToFavorites(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth/login']);
      return;
    }
    if (this.job) {
      this.api.addFavorite(this.job).subscribe({
        next: () => this.isSaved = true,
        error: (err) => {
          if (err.error?.message === 'Job already in favorites') {
            this.isSaved = true;
          }
        }
      });
    }
  }

  share(): void {
    if (navigator.share) {
      navigator.share({
        title: this.job?.title,
        text: `Check out this job: ${this.job?.title} at ${this.job?.company}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  }
}
