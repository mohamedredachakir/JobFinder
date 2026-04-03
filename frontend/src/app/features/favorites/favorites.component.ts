import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Favorite } from '../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="favorites-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Mes Favoris</h1>
          <p>Gérez vos offres sauvegardées</p>
        </div>
        <button class="export-btn" (click)="exportCSV()">
          <span class="material-symbols-outlined">download</span>
          Exporter CSV
        </button>
      </header>

      <div class="favorites-content" *ngIf="!loading; else loadingTemplate">
        <div class="favorites-grid" *ngIf="favorites.length > 0; else emptyTemplate">
          <div class="favorite-card" *ngFor="let fav of favorites">
            <div class="card-header">
              <div class="source-badge">{{ fav.jobData?.source }}</div>
              <button class="remove-btn" (click)="removeFavorite(fav.id)">
                <span class="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div class="card-body" [routerLink]="['/jobs', fav.jobData?.id]">
              <div class="company-logo">
                <img [src]="fav.jobData?.logoUrl || 'https://via.placeholder.com/48'" [alt]="fav.jobData?.company" />
              </div>
              <div class="job-info">
                <h3>{{ fav.jobData?.title }}</h3>
                <p class="company">{{ fav.jobData?.company }}</p>
                <p class="location">
                  <span class="material-symbols-outlined">location_on</span>
                  {{ fav.jobData?.location }}
                </p>
              </div>
            </div>
            
            <div class="card-footer">
              <div class="salary" *ngIf="fav.jobData?.salaryMin">
                {{ fav.jobData?.salaryMin | currency:'EUR':'symbol':'1.0-0' }}
              </div>
              <span class="saved-date">Sauvé le {{ formatDate(fav.savedAt) }}</span>
            </div>
            
            <div class="card-actions">
              <a [href]="fav.jobData?.applyUrl" target="_blank" class="btn-apply">Postuler</a>
            </div>
          </div>
        </div>

        <ng-template #emptyTemplate>
          <div class="empty-state">
            <span class="material-symbols-outlined">bookmark_border</span>
            <h3>Aucun favori</h3>
            <p>Commencez à sauvegarder des offres qui vous intéressent</p>
            <a routerLink="/jobs" class="btn-primary">Rechercher des jobs</a>
          </div>
        </ng-template>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3,4]"></div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .favorites-page {
      min-height: 100vh;
      background: var(--surface);
      padding: 2rem;
    }

    .page-header {
      max-width: 1200px;
      margin: 0 auto 2rem;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      flex-wrap: wrap;
      gap: 1rem;
    }

    .header-content h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--on-surface);
      margin-bottom: 0.5rem;
    }

    .header-content p {
      color: var(--on-surface-variant);
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: var(--surface-container-lowest);
      border: 1px solid var(--outline-variant);
      border-radius: var(--radius-md);
      font-weight: 600;
      color: var(--on-surface);
      cursor: pointer;
      transition: all var(--transition-base);
    }

    .export-btn:hover {
      background: var(--surface-container-high);
    }

    .favorites-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .favorites-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .favorite-card {
      background: var(--surface-container-lowest);
      border-radius: var(--radius-xl);
      box-shadow: var(--shadow-md);
      overflow: hidden;
      transition: all var(--transition-base);
    }

    .favorite-card:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
    }

    .source-badge {
      padding: 0.25rem 0.75rem;
      background: rgba(0, 74, 198, 0.1);
      color: var(--primary);
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: var(--radius-full);
    }

    .remove-btn {
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--on-surface-variant);
      transition: all var(--transition-fast);
    }

    .remove-btn:hover {
      background: var(--error-container);
      color: var(--error);
    }

    .card-body {
      padding: 0 1.25rem 1rem;
      display: flex;
      gap: 1rem;
      cursor: pointer;
    }

    .company-logo {
      width: 3.5rem;
      height: 3.5rem;
      border-radius: var(--radius-md);
      background: var(--surface-container-low);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .company-logo img {
      width: 2rem;
      height: 2rem;
      object-fit: contain;
    }

    .job-info h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--on-surface);
      margin-bottom: 0.25rem;
    }

    .job-info .company {
      font-weight: 500;
      color: var(--on-surface-variant);
      margin-bottom: 0.5rem;
    }

    .job-info .location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: var(--on-surface-variant);
    }

    .job-info .location .material-symbols-outlined {
      font-size: 1rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-top: 1px solid var(--outline-variant);
    }

    .salary {
      font-weight: 700;
      color: var(--tertiary);
    }

    .saved-date {
      font-size: 0.75rem;
      color: var(--on-surface-variant);
    }

    .card-actions {
      padding: 0 1.25rem 1.25rem;
    }

    .btn-apply {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, var(--primary), var(--primary-container));
      color: var(--on-primary);
      text-align: center;
      font-weight: 700;
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .btn-apply:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: var(--surface-container-lowest);
      border-radius: var(--radius-xl);
    }

    .empty-state .material-symbols-outlined {
      font-size: 4rem;
      color: var(--outline-variant);
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: var(--on-surface);
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: var(--on-surface-variant);
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      display: inline-flex;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, var(--primary), var(--primary-container));
      color: var(--on-primary);
      font-weight: 700;
      border-radius: var(--radius-md);
      transition: all var(--transition-base);
    }

    .btn-primary:hover {
      transform: scale(1.02);
    }

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 1.5rem;
    }

    .skeleton-card {
      height: 280px;
      background: linear-gradient(90deg, var(--surface-container-low) 25%, var(--surface-container-high) 50%, var(--surface-container-low) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: var(--radius-xl);
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
  `]
})
export class FavoritesComponent implements OnInit {
  favorites: Favorite[] = [];
  loading = true;

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadFavorites();
  }

  loadFavorites(): void {
    this.api.getFavorites().subscribe({
      next: (data) => {
        this.favorites = data;
        this.loading = false;
      },
      error: () => {
        this.favorites = [];
        this.loading = false;
      }
    });
  }

  removeFavorite(id: number): void {
    this.api.removeFavorite(id).subscribe({
      next: () => {
        this.favorites = this.favorites.filter(f => f.id !== id);
      }
    });
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  }

  exportCSV(): void {
    const headers = ['Title', 'Company', 'Location', 'Salary', 'Source', 'Saved Date'];
    const rows = this.favorites.map(f => [
      f.jobData?.title || '',
      f.jobData?.company || '',
      f.jobData?.location || '',
      f.jobData?.salaryMin ? `${f.jobData.salaryMin}` : '',
      f.jobData?.source || '',
      this.formatDate(f.savedAt)
    ]);

    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jobfinder-favorites.csv';
    a.click();
  }
}
