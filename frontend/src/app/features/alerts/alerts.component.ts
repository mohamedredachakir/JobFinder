import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Alert } from '../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="alerts-page">
      <header class="page-header">
        <div class="header-content">
          <h1>Mes Alertes</h1>
          <p>Configurez des alertes pour ne manquer aucune opportunité</p>
        </div>
        <button class="btn-primary" (click)="showCreateModal = true">
          <span class="material-symbols-outlined">add</span>
          Nouvelle alerte
        </button>
      </header>

      <!-- Create Alert Modal -->
      <div class="modal-overlay" *ngIf="showCreateModal" (click)="showCreateModal = false">
        <div class="modal" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h2>Créer une alerte</h2>
            <button class="close-btn" (click)="showCreateModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
          </div>
          <form class="modal-form" (ngSubmit)="createAlert()">
            <div class="form-group">
              <label>Mots-clés</label>
              <input type="text" [(ngModel)]="newAlert.keywords" name="keywords" placeholder="Développeur, Designer..." />
            </div>
            <div class="form-group">
              <label>Localisation</label>
              <input type="text" [(ngModel)]="newAlert.location" name="location" placeholder="Paris, Remote..." />
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Type de contrat</label>
                <select [(ngModel)]="newAlert.contractType" name="contractType">
                  <option value="">Tous</option>
                  <option value="CDI">CDI</option>
                  <option value="CDD">CDD</option>
                  <option value="Freelance">Freelance</option>
                  <option value="Stage">Stage</option>
                </select>
              </div>
              <div class="form-group">
                <label>Salaire minimum</label>
                <input type="number" [(ngModel)]="newAlert.minSalary" name="minSalary" placeholder="40000" />
              </div>
            </div>
            <div class="form-group">
              <label>Fréquence</label>
              <div class="frequency-options">
                <label class="freq-option" [class.active]="newAlert.frequency === 'IMMEDIATE'">
                  <input type="radio" [(ngModel)]="newAlert.frequency" name="frequency" value="IMMEDIATE" />
                  <span>Immédiat</span>
                </label>
                <label class="freq-option" [class.active]="newAlert.frequency === 'DAILY'">
                  <input type="radio" [(ngModel)]="newAlert.frequency" name="frequency" value="DAILY" />
                  <span>Quotidien</span>
                </label>
                <label class="freq-option" [class.active]="newAlert.frequency === 'WEEKLY'">
                  <input type="radio" [(ngModel)]="newAlert.frequency" name="frequency" value="WEEKLY" />
                  <span>Hebdomadaire</span>
                </label>
              </div>
            </div>
            <button type="submit" class="btn-submit">Créer l'alerte</button>
          </form>
        </div>
      </div>

      <!-- Alerts List -->
      <div class="alerts-content" *ngIf="!loading; else loadingTemplate">
        <div class="alerts-grid" *ngIf="alerts.length > 0; else emptyTemplate">
          <div class="alert-card" *ngFor="let alert of alerts" [class.inactive]="!alert.isActive">
            <div class="alert-header">
              <div class="alert-status" [class.active]="alert.isActive">
                <span class="material-symbols-outlined">{{ alert.isActive ? 'notifications_active' : 'notifications_off' }}</span>
              </div>
              <div class="alert-actions">
                <button class="toggle-btn" (click)="toggleAlert(alert)">
                  {{ alert.isActive ? 'Désactiver' : 'Activer' }}
                </button>
                <button class="delete-btn" (click)="deleteAlert(alert.id)">
                  <span class="material-symbols-outlined">delete</span>
                </button>
              </div>
            </div>
            
            <div class="alert-body">
              <h3>{{ alert.keywords || 'Toutes offres' }}</h3>
              <p class="alert-location" *ngIf="alert.location">
                <span class="material-symbols-outlined">location_on</span>
                {{ alert.location }}
              </p>
              <div class="alert-meta">
                <span class="meta-item" *ngIf="alert.contractType">
                  {{ alert.contractType }}
                </span>
                <span class="meta-item" *ngIf="alert.minSalary">
                  Min: {{ alert.minSalary | currency:'EUR':'symbol':'1.0-0' }}
                </span>
              </div>
            </div>
            
            <div class="alert-footer">
              <div class="frequency-badge">
                <span class="material-symbols-outlined">{{ getFrequencyIcon(alert.frequency) }}</span>
                {{ getFrequencyLabel(alert.frequency) }}
              </div>
              <span class="last-sent" *ngIf="alert.lastSentAt">
                Dernier envoi: {{ formatDate(alert.lastSentAt) }}
              </span>
            </div>
          </div>
        </div>

        <ng-template #emptyTemplate>
          <div class="empty-state">
            <span class="material-symbols-outlined">notifications_none</span>
            <h3>Aucune alerte</h3>
            <p>Créer une alerte pour recevoir les meilleures offres par email</p>
            <button class="btn-primary" (click)="showCreateModal = true">
              <span class="material-symbols-outlined">add</span>
              Créer une alerte
            </button>
          </div>
        </ng-template>
      </div>

      <ng-template #loadingTemplate>
        <div class="loading-grid">
          <div class="skeleton-card" *ngFor="let i of [1,2,3]"></div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .alerts-page {
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

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: linear-gradient(135deg, #2563EB, #2563EB);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.3);
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 1rem;
    }

    .modal {
      background: white;
      border-radius: 1.5rem;
      width: 100%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid #e6e8ea;
    }

    .modal-header h2 {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .close-btn {
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
    }

    .close-btn:hover {
      background: #f2f4f6;
    }

    .modal-form {
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-size: 0.8rem;
      font-weight: 600;
      color: #1E293B;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .form-group input,
    .form-group select {
      padding: 0.875rem 1rem;
      border: 1px solid #c3c6d7;
      border-radius: 0.75rem;
      font-size: 1rem;
      background: white;
      color: #1E293B;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #2563EB;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
    }

    .frequency-options {
      display: flex;
      gap: 0.5rem;
    }

    .freq-option {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #c3c6d7;
      border-radius: 0.75rem;
      text-align: center;
      cursor: pointer;
      transition: all 0.2s;
    }

    .freq-option input {
      display: none;
    }

    .freq-option.active {
      background: #2563EB;
      border-color: #2563EB;
      color: white;
    }

    .btn-submit {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2563EB, #2563EB);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-submit:hover {
      transform: scale(1.02);
    }

    /* Alerts Grid */
    .alerts-content {
      max-width: 1200px;
      margin: 0 auto;
    }

    .alerts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .alert-card {
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: all 0.2s;
    }

    .alert-card:hover {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
    }

    .alert-card.inactive {
      opacity: 0.7;
    }

    .alert-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      border-bottom: 1px solid #e6e8ea;
    }

    .alert-status {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      background: #f2f4f6;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #64748b;
    }

    .alert-status.active {
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
    }

    .alert-actions {
      display: flex;
      gap: 0.5rem;
    }

    .toggle-btn {
      padding: 0.4rem 0.75rem;
      background: transparent;
      border: 1px solid #c3c6d7;
      border-radius: 0.5rem;
      font-size: 0.75rem;
      font-weight: 600;
      color: #64748b;
      cursor: pointer;
      transition: all 0.2s;
    }

    .toggle-btn:hover {
      background: #f2f4f6;
    }

    .delete-btn {
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

    .delete-btn:hover {
      background: #ffdad6;
      color: #ba1a1a;
    }

    .alert-body {
      padding: 1.25rem;
    }

    .alert-body h3 {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1E293B;
      margin-bottom: 0.5rem;
    }

    .alert-location {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.9rem;
      color: #64748b;
      margin-bottom: 0.75rem;
    }

    .alert-meta {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }

    .meta-item {
      padding: 0.25rem 0.75rem;
      background: #f2f4f6;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
    }

    .alert-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      background: #f2f4f6;
    }

    .frequency-badge {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 600;
      color: #2563EB;
    }

    .last-sent {
      font-size: 0.7rem;
      color: #64748b;
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

    .loading-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
    }

    .skeleton-card {
      height: 200px;
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
export class AlertsComponent implements OnInit {
  alerts: Alert[] = [];
  loading = true;
  showCreateModal = false;
  newAlert = {
    keywords: '',
    location: '',
    contractType: '',
    minSalary: null as number | null,
    frequency: 'DAILY' as 'IMMEDIATE' | 'DAILY' | 'WEEKLY'
  };

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.api.getAlerts().subscribe({
      next: (data) => {
        this.alerts = data;
        this.loading = false;
      },
      error: () => {
        this.alerts = [];
        this.loading = false;
      }
    });
  }

  createAlert(): void {
    this.api.createAlert(this.newAlert).subscribe({
      next: (alert) => {
        this.alerts.push(alert);
        this.showCreateModal = false;
        this.resetForm();
      }
    });
  }

  toggleAlert(alert: Alert): void {
    this.api.updateAlert(alert.id, { ...alert, isActive: !alert.isActive }).subscribe({
      next: (updated) => {
        const index = this.alerts.findIndex(a => a.id === updated.id);
        if (index !== -1) {
          this.alerts[index] = updated;
        }
      }
    });
  }

  deleteAlert(id: number): void {
    this.api.deleteAlert(id).subscribe({
      next: () => {
        this.alerts = this.alerts.filter(a => a.id !== id);
      }
    });
  }

  resetForm(): void {
    this.newAlert = {
      keywords: '',
      location: '',
      contractType: '',
      minSalary: null,
      frequency: 'DAILY'
    };
  }

  getFrequencyIcon(frequency: string): string {
    switch (frequency) {
      case 'IMMEDIATE': return 'bolt';
      case 'DAILY': return 'today';
      case 'WEEKLY': return 'date_range';
      default: return 'notifications';
    }
  }

  getFrequencyLabel(frequency: string): string {
    switch (frequency) {
      case 'IMMEDIATE': return 'Immédiat';
      case 'DAILY': return 'Quotidien';
      case 'WEEKLY': return 'Hebdomadaire';
      default: return frequency;
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
}
