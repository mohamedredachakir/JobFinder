import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Job } from '../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="jobs-page">
      <!-- Top Navigation -->
      <header class="top-header">
        <div class="header-container">
          <div class="header-brand">
            <span class="brand">JobFinder</span>
            <nav class="header-nav">
              <a routerLink="/jobs" class="nav-link active">Find Jobs</a>
              <a href="#" class="nav-link">Companies</a>
              <a href="#" class="nav-link">Salaries</a>
              <a href="#" class="nav-link">My Careers</a>
            </nav>
          </div>
          <div class="header-search">
            <div class="search-input-wrapper">
              <span class="material-symbols-outlined search-icon">search</span>
              <input 
                type="text" 
                [(ngModel)]="q" 
                placeholder="Search job title, keywords..."
                (keyup.enter)="search()"
              />
            </div>
          </div>
          <div class="header-actions">
            <button class="icon-btn">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <div class="avatar">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" alt="User" />
            </div>
          </div>
        </div>
      </header>

      <main class="main-content">
        <div class="content-wrapper">
          <!-- Filter Sidebar -->
          <aside class="filters-sidebar">
            <div class="filter-section">
              <h3 class="filter-title">Filters</h3>
              
              <!-- Contract Type -->
              <div class="filter-group">
                <label class="filter-label">Contract Type</label>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="contractTypes.fulltime" (change)="search()" />
                    <span>Full-time (CDI)</span>
                  </label>
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="contractTypes.cdd" (change)="search()" />
                    <span>Contract (CDD)</span>
                  </label>
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="contractTypes.internship" (change)="search()" />
                    <span>Internship</span>
                  </label>
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="contractTypes.freelance" (change)="search()" />
                    <span>Freelance</span>
                  </label>
                </div>
              </div>

              <!-- Salary Range -->
              <div class="filter-group">
                <label class="filter-label">Salary Range (Annual)</label>
                <div class="salary-slider">
                  <input type="range" min="30000" max="200000" step="5000" [(ngModel)]="minSalary" (change)="search()" />
                  <div class="salary-values">
                    <span>$30k</span>
                    <span>{{ minSalary >= 200000 ? '$200k+' : '$' + (minSalary / 1000) + 'k+' }}</span>
                    <span>$200k</span>
                  </div>
                </div>
              </div>

              <!-- Remote Options -->
              <div class="filter-group">
                <label class="filter-label">Remote Options</label>
                <div class="filter-options">
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="remoteOptions.remoteOnly" (change)="search()" />
                    <span>Remote Only</span>
                  </label>
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="remoteOptions.hybrid" (change)="search()" />
                    <span>Hybrid</span>
                  </label>
                  <label class="filter-option">
                    <input type="checkbox" [(ngModel)]="remoteOptions.onsite" (change)="search()" />
                    <span>On-site</span>
                  </label>
                </div>
              </div>

              <button class="reset-btn" (click)="resetFilters()">Reset All Filters</button>
            </div>
          </aside>

          <!-- Results Section -->
          <div class="results-section">
            <!-- Header -->
            <div class="results-header">
              <div class="results-info">
                <h1>{{ q || 'Product Design Roles' }}</h1>
                <p>Showing {{ jobs.length }} job results in San Francisco, CA</p>
              </div>
              <div class="sort-dropdown">
                <span class="sort-label">Sort by:</span>
                <select [(ngModel)]="sortBy" (change)="search()">
                  <option value="relevance">Relevance</option>
                  <option value="date">Newest First</option>
                  <option value="salary_high">Salary: High to Low</option>
                </select>
              </div>
            </div>

            <!-- Job Cards -->
            <div class="jobs-grid" *ngIf="!loading; else loadingTemplate">
              <div class="job-card" *ngFor="let job of jobs" [routerLink]="['/jobs', job.id]">
                <div class="job-logo">
                  <img [src]="job.logoUrl || 'https://via.placeholder.com/48'" [alt]="job.company" />
                </div>
                <div class="job-content">
                  <div class="job-header">
                    <div class="job-title-row">
                      <h3>{{ job.title }}</h3>
                      <span class="match-badge" *ngIf="job.matchScore">{{ job.matchScore }}% Match</span>
                      <span class="new-badge" *ngIf="isNew(job.postedAt)">New</span>
                    </div>
                    <button class="bookmark-btn" (click)="toggleBookmark($event, job)">
                      <span class="material-symbols-outlined">bookmark</span>
                    </button>
                  </div>
                  <p class="job-company">{{ job.company }} • {{ job.location }}</p>
                  <div class="job-tags">
                    <span class="tag" *ngIf="job.category">{{ job.category }}</span>
                    <span class="tag" *ngIf="job.skills && job.skills.length">{{ job.skills[0] }}</span>
                    <span class="tag" *ngIf="job.contractType">{{ job.contractType }}</span>
                  </div>
                  <div class="job-footer">
                    <div class="job-salary" *ngIf="job.salaryMin">
                      <span class="salary-value">\${{ formatSalary(job.salaryMin) }} – \${{ formatSalary(job.salaryMax || job.salaryMin) }}</span>
                      <span class="salary-period">/ year</span>
                    </div>
                    <div class="job-actions">
                      <button class="action-btn quick-view" (click)="quickView($event, job)">Quick View</button>
                      <button class="action-btn primary" (click)="apply($event, job)">Apply Now</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Empty State -->
              <div class="no-results" *ngIf="jobs.length === 0">
                <span class="material-symbols-outlined">work_off</span>
                <h3>No jobs found</h3>
                <p>Try adjusting your search criteria</p>
              </div>
            </div>

            <!-- Loading Template -->
            <ng-template #loadingTemplate>
              <div class="loading-grid">
                <div class="skeleton-card" *ngFor="let i of [1,2,3,4,5,6]"></div>
              </div>
            </ng-template>

            <!-- Pagination -->
            <div class="pagination" *ngIf="jobs.length > 0">
              <button class="page-btn" (click)="prevPage()" [disabled]="page === 0">
                <span class="material-symbols-outlined">chevron_left</span>
              </button>
              <button class="page-btn active">1</button>
              <button class="page-btn">2</button>
              <button class="page-btn">3</button>
              <span class="page-dots">...</span>
              <button class="page-btn">12</button>
              <button class="page-btn">
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <p class="copyright">© 2024 JobFinder Architect. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .jobs-page {
      min-height: 100vh;
      background: #f7f9fb;
    }

    .top-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(247, 249, 251, 0.85);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
    }

    .header-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 3rem;
      flex-shrink: 0;
    }

    .brand {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2563EB;
      letter-spacing: -0.02em;
    }

    .header-nav {
      display: flex;
      gap: 2rem;
    }

    .nav-link {
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
      transition: color 0.2s;
    }

    .nav-link:hover {
      color: #2563EB;
    }

    .nav-link.active {
      color: #2563EB;
      border-bottom: 2px solid #2563EB;
      padding-bottom: 2px;
    }

    .header-search {
      flex: 1;
      max-width: 32rem;
      display: none;
    }

    @media (min-width: 1024px) {
      .header-search {
        display: block;
      }
    }

    .search-input-wrapper {
      position: relative;
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }

    .search-input-wrapper input {
      width: 100%;
      height: 2.75rem;
      padding: 0 1rem 0 3rem;
      background: #f2f4f6;
      border: none;
      border-radius: 999px;
      font-size: 0.875rem;
    }

    .search-input-wrapper input:focus {
      outline: none;
      box-shadow: 0 0 0 2px #2563EB;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .icon-btn {
      width: 2.5rem;
      height: 2.5rem;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      background: #e6e8ea;
    }

    .avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid #dbe1ff;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .main-content {
      padding-top: 5rem;
      padding-bottom: 5rem;
    }

    .content-wrapper {
      max-width: 1440px;
      margin: 0 auto;
      padding: 2rem;
      display: flex;
      gap: 2rem;
    }

    .filters-sidebar {
      width: 280px;
      flex-shrink: 0;
      display: none;
    }

    @media (min-width: 768px) {
      .filters-sidebar {
        display: block;
      }
    }

    .filter-section {
      position: sticky;
      top: 7rem;
      background: white;
      border-radius: 1.5rem;
      padding: 1.5rem;
      box-shadow: 0 4px 16px -4px rgba(25, 28, 30, 0.06);
    }

    .filter-title {
      font-size: 0.7rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-bottom: 1.5rem;
    }

    .filter-group {
      margin-bottom: 2rem;
    }

    .filter-label {
      display: block;
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.75rem;
    }

    .filter-options {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .filter-option {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: #1E293B;
      font-weight: 500;
      transition: color 0.2s;
    }

    .filter-option:hover {
      color: #2563EB;
    }

    .filter-option input {
      accent-color: #2563EB;
      width: 1.25rem;
      height: 1.25rem;
    }

    .salary-slider {
      padding: 0 0.5rem;
    }

    .salary-slider input {
      width: 100%;
      accent-color: #2563EB;
      height: 0.375rem;
      cursor: pointer;
    }

    .salary-values {
      display: flex;
      justify-content: space-between;
      margin-top: 0.75rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
    }

    .reset-btn {
      width: 100%;
      padding: 0.75rem;
      background: #e6e8ea;
      border: none;
      border-radius: 0.75rem;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1E293B;
      cursor: pointer;
      transition: background 0.2s;
    }

    .reset-btn:hover {
      background: #d8dadc;
    }

    .results-section {
      flex: 1;
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .results-info h1 {
      font-size: 1.75rem;
      font-weight: 600;
      color: #1E293B;
      margin-bottom: 0.25rem;
    }

    .results-info p {
      color: #64748b;
      font-size: 0.9rem;
    }

    .sort-dropdown {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #f2f4f6;
      border-radius: 0.75rem;
    }

    .sort-label {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #94a3b8;
    }

    .sort-dropdown select {
      border: none;
      background: transparent;
      font-size: 0.9rem;
      font-weight: 600;
      color: #2563EB;
      cursor: pointer;
    }

    .sort-dropdown select:focus {
      outline: none;
    }

    .jobs-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .job-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.04);
      cursor: pointer;
      transition: all 0.3s;
    }

    .job-card:hover {
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.08);
    }

    .job-logo {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      background: #f0f4ff;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .job-logo img {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: contain;
    }

    .job-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .job-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .job-title-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }

    .job-title-row h3 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1E293B;
      transition: color 0.2s;
    }

    .job-card:hover .job-title-row h3 {
      color: #2563EB;
    }

    .match-badge {
      padding: 0.25rem 0.75rem;
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
    }

    .new-badge {
      padding: 0.25rem 0.75rem;
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
    }

    .bookmark-btn {
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #94a3b8;
      transition: all 0.2s;
    }

    .bookmark-btn:hover {
      color: #ba1a1a;
    }

    .job-company {
      font-weight: 500;
      color: #64748b;
      font-size: 0.9rem;
    }

    .job-tags {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .tag {
      padding: 0.4rem 0.75rem;
      background: #eceef0;
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 999px;
    }

    .job-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 0.5rem;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .job-salary {
      display: flex;
      align-items: baseline;
      gap: 0.25rem;
    }

    .salary-value {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1E293B;
    }

    .salary-period {
      font-size: 0.75rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .job-actions {
      display: flex;
      gap: 0.75rem;
    }

    .action-btn {
      padding: 0.6rem 1.5rem;
      border-radius: 0.75rem;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .action-btn.quick-view {
      background: transparent;
      color: #2563EB;
      border: none;
    }

    .action-btn.quick-view:hover {
      background: rgba(0, 74, 198, 0.05);
    }

    .action-btn.primary {
      background: linear-gradient(135deg, #2563EB, #2563eb);
      color: white;
      border: none;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.2);
    }

    .action-btn.primary:hover {
      transform: scale(1.02);
      box-shadow: 0 6px 16px rgba(0, 74, 198, 0.3);
    }

    .no-results {
      text-align: center;
      padding: 4rem 2rem;
      color: #64748b;
    }

    .no-results .material-symbols-outlined {
      font-size: 4rem;
      color: #c3c6d7;
      margin-bottom: 1rem;
    }

    .no-results h3 {
      font-size: 1.5rem;
      color: #1E293B;
      margin-bottom: 0.5rem;
    }

    .loading-grid {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .skeleton-card {
      height: 160px;
      background: linear-gradient(90deg, #f2f4f6 25%, #e6e8ea 50%, #f2f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 1.5rem;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }

    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin-top: 3rem;
    }

    .page-btn {
      width: 2.5rem;
      height: 2.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.9rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .page-btn:hover:not(:disabled) {
      background: #e6e8ea;
    }

    .page-btn.active {
      background: #2563EB;
      color: white;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.2);
    }

    .page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .page-dots {
      color: #94a3b8;
      padding: 0 0.5rem;
    }

    .footer {
      background: #f7f9fb;
      border-top: 1px solid #f1f5f9;
      padding: 3rem 2rem;
    }

    .footer-container {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1.5rem;
    }

    .copyright {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .footer-links {
      display: flex;
      gap: 2rem;
    }

    .footer-links a {
      font-size: 0.75rem;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      text-decoration: none;
      transition: color 0.2s;
    }

    .footer-links a:hover {
      color: #2563EB;
    }

    @media (max-width: 768px) {
      .header-nav {
        display: none;
      }

      .content-wrapper {
        flex-direction: column;
      }

      .filters-sidebar {
        width: 100%;
      }

      .filter-section {
        position: static;
      }

      .job-card {
        flex-direction: column;
      }

      .job-footer {
        flex-direction: column;
        align-items: flex-start;
      }

      .job-actions {
        width: 100%;
      }

      .action-btn {
        flex: 1;
      }
    }
  `]
})
export class JobsListComponent implements OnInit {
  q = '';
  location = '';
  jobs: Job[] = [];
  loading = true;
  page = 0;
  sortBy = 'relevance';
  minSalary = 80000;

  contractTypes = {
    fulltime: true,
    cdd: false,
    internship: false,
    freelance: false
  };

  remoteOptions = {
    remoteOnly: false,
    hybrid: true,
    onsite: false
  };

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.q = params['q'] || '';
      this.location = params['location'] || '';
      this.search();
    });
  }

  search(): void {
    this.loading = true;
    const params: any = {};
    if (this.q) params.q = this.q;
    if (this.location) params.location = this.location;
    params.page = this.page;
    params.size = 20;

    this.api.jobs(params).subscribe({
      next: (data) => {
        this.jobs = data;
        this.loading = false;
      },
      error: () => {
        this.jobs = [];
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.contractTypes = {
      fulltime: false,
      cdd: false,
      internship: false,
      freelance: false
    };
    this.remoteOptions = {
      remoteOnly: false,
      hybrid: false,
      onsite: false
    };
    this.minSalary = 80000;
    this.search();
  }

  prevPage(): void {
    if (this.page > 0) {
      this.page--;
      this.search();
    }
  }

  isNew(postedAt: string): boolean {
    if (!postedAt) return false;
    const posted = new Date(postedAt);
    const now = new Date();
    const diff = (now.getTime() - posted.getTime()) / (1000 * 60 * 60 * 24);
    return diff < 3;
  }

  formatSalary(amount: number): string {
    return amount ? amount.toLocaleString() : '0';
  }

  toggleBookmark(event: Event, job: Job): void {
    event.stopPropagation();
    event.preventDefault();
  }

  quickView(event: Event, job: Job): void {
    event.stopPropagation();
    event.preventDefault();
  }

  apply(event: Event, job: Job): void {
    event.stopPropagation();
    event.preventDefault();
  }
}
