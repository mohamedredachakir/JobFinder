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
      background: #f7f9fb;
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
      color: #1E293B;
      margin-bottom: 0.5rem;
    }

    .header-content p {
      color: #64748b;
    }

    .export-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: white;
      border: 1px solid #c3c6d7;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #1E293B;
      cursor: pointer;
      transition: all 0.2s;
    }

    .export-btn:hover {
      background: #f2f4f6;
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
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: all 0.2s;
    }

    .favorite-card:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
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
      color: #2563EB;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
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
      color: #64748b;
      transition: all 0.2s;
    }

    .remove-btn:hover {
      background: #ffdad6;
      color: #ba1a1a;
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
      border-radius: 0.75rem;
      background: #f2f4f6;
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
      color: #1E293B;
      margin-bottom: 0.25rem;
    }

    .job-info .company {
      font-weight: 500;
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .job-info .location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.85rem;
      color: #64748b;
    }

    .job-info .location .material-symbols-outlined {
      font-size: 1rem;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-top: 1px solid #e6e8ea;
    }

    .salary {
      font-weight: 700;
      color: #10B981;
    }

    .saved-date {
      font-size: 0.75rem;
      color: #64748b;
    }

    .card-actions {
      padding: 0 1.25rem 1.25rem;
    }

    .btn-apply {
      display: block;
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #2563EB, #2563EB);
      color: white;
      text-align: center;
      font-weight: 700;
      border-radius: 0.75rem;
      transition: all 0.2s;
      text-decoration: none;
    }

    .btn-apply:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.3);
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 1.5rem;
    }

    .empty-state .material-symbols-outlined {
      font-size: 4rem;
      color: #c3c6d7;
      margin-bottom: 1rem;
    }

    .empty-state h3 {
      font-size: 1.5rem;
      color: #1E293B;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: #64748b;
      margin-bottom: 1.5rem;
    }

    .btn-primary {
      display: inline-flex;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #2563EB, #2563EB);
      color: white;
      font-weight: 700;
      border-radius: 0.75rem;
      transition: all 0.2s;
      text-decoration: none;
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
      background: linear-gradient(90deg, #f2f4f6 25%, #e6e8ea 50%, #f2f4f6 75%);
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      border-radius: 1.5rem;
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
