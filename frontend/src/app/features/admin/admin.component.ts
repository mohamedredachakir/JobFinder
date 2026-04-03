import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="admin-page">
      <header class="page-header">
        <h1>Administration</h1>
        <p>Panneau de gestion et monitoring</p>
      </header>

      <div class="admin-content">
        <!-- Stats Overview -->
        <div class="stats-grid">
          <div class="stat-card">
            <span class="material-symbols-outlined">group</span>
            <div class="stat-info">
              <p class="stat-value">{{ stats.users }}</p>
              <p class="stat-label">Utilisateurs</p>
            </div>
          </div>
          <div class="stat-card">
            <span class="material-symbols-outlined">bookmark</span>
            <div class="stat-info">
              <p class="stat-value">{{ stats.favorites }}</p>
              <p class="stat-label">Favoris</p>
            </div>
          </div>
          <div class="stat-card">
            <span class="material-symbols-outlined">work_history</span>
            <div class="stat-info">
              <p class="stat-value">{{ stats.applications }}</p>
              <p class="stat-label">Candidatures</p>
            </div>
          </div>
          <div class="stat-card">
            <span class="material-symbols-outlined">notifications</span>
            <div class="stat-info">
              <p class="stat-value">{{ stats.alerts }}</p>
              <p class="stat-label">Alertes</p>
            </div>
          </div>
        </div>

        <!-- API Sources -->
        <div class="section-card">
          <h2>Sources d'API</h2>
          <div class="api-sources">
            <div class="api-source" *ngFor="let source of apiSources">
              <div class="source-header">
                <span class="source-name">{{ source.name }}</span>
                <span class="status-badge" [class.active]="source.status === 'active'">
                  {{ source.status === 'active' ? 'Actif' : 'Inactif' }}
                </span>
              </div>
              <div class="source-stats">
                <span>{{ source.calls }} appels</span>
                <span>{{ source.quota }}</span>
              </div>
              <div class="source-bar">
                <div class="bar-fill" [style.width.%]="source.usage"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="section-card">
          <h2>Activité récente</h2>
          <div class="activity-list">
            <div class="activity-item" *ngFor="let activity of recentActivity">
              <div class="activity-icon">
                <span class="material-symbols-outlined">{{ activity.icon }}</span>
              </div>
              <div class="activity-info">
                <p class="activity-text">{{ activity.text }}</p>
                <p class="activity-time">{{ activity.time }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Links -->
        <div class="section-card">
          <h2>Liens rapides</h2>
          <div class="quick-links">
            <a routerLink="/swagger-ui" class="quick-link">
              <span class="material-symbols-outlined">api</span>
              <span>Swagger UI</span>
            </a>
            <a routerLink="/dashboard" class="quick-link">
              <span class="material-symbols-outlined">dashboard</span>
              <span>Dashboard</span>
            </a>
            <a routerLink="/jobs" class="quick-link">
              <span class="material-symbols-outlined">work</span>
              <span>Jobs</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      min-height: 100vh;
      background: var(--surface);
      padding: 2rem;
    }

    .page-header {
      max-width: 1200px;
      margin: 0 auto 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: var(--on-surface);
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: var(--on-surface-variant);
    }

    .admin-content {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }

    .stat-card {
      background: var(--surface-container-lowest);
      border-radius: var(--radius-xl);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      box-shadow: var(--shadow-md);
    }

    .stat-card .material-symbols-outlined {
      font-size: 2.5rem;
      color: var(--primary);
    }

    .stat-value {
      font-size: 2rem;
      font-weight: 700;
      color: var(--on-surface);
    }

    .stat-label {
      font-size: 0.85rem;
      color: var(--on-surface-variant);
    }

    .section-card {
      background: var(--surface-container-lowest);
      border-radius: var(--radius-xl);
      padding: 2rem;
      box-shadow: var(--shadow-md);
    }

    .section-card h2 {
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--on-surface);
      margin-bottom: 1.5rem;
    }

    .api-sources {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .api-source {
      padding: 1rem;
      background: var(--surface-container-low);
      border-radius: var(--radius-md);
    }

    .source-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .source-name {
      font-weight: 600;
    }

    .status-badge {
      padding: 0.25rem 0.75rem;
      border-radius: var(--radius-full);
      font-size: 0.7rem;
      font-weight: 700;
      background: var(--error-container);
      color: var(--error);
    }

    .status-badge.active {
      background: rgba(0, 98, 66, 0.1);
      color: var(--tertiary);
    }

    .source-stats {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--on-surface-variant);
      margin-bottom: 0.5rem;
    }

    .source-bar {
      height: 4px;
      background: var(--outline-variant);
      border-radius: 2px;
      overflow: hidden;
    }

    .bar-fill {
      height: 100%;
      background: var(--primary);
      border-radius: 2px;
    }

    .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .activity-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.75rem;
      background: var(--surface-container-low);
      border-radius: var(--radius-md);
    }

    .activity-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: var(--primary-fixed);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--primary);
    }

    .activity-text {
      font-weight: 500;
      color: var(--on-surface);
    }

    .activity-time {
      font-size: 0.75rem;
      color: var(--on-surface-variant);
    }

    .quick-links {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .quick-link {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: var(--surface-container-low);
      border-radius: var(--radius-md);
      font-weight: 600;
      color: var(--on-surface);
      transition: all var(--transition-base);
    }

    .quick-link:hover {
      background: var(--primary);
      color: var(--on-primary);
    }

    @media (max-width: 900px) {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 600px) {
      .stats-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  stats = {
    users: 1247,
    favorites: 3891,
    applications: 2156,
    alerts: 892
  };

  apiSources = [
    { name: 'Adzuna', status: 'active', calls: 12450, quota: '250 req/jour', usage: 65 },
    { name: 'JSearch (RapidAPI)', status: 'active', calls: 8920, quota: '500 req/mois', usage: 42 },
    { name: 'The Muse', status: 'active', calls: 25600, quota: 'Illimité', usage: 0 }
  ];

  recentActivity = [
    { icon: 'person_add', text: 'Nouvel utilisateur inscrit: marie.dupont@email.com', time: 'Il y a 5 minutes' },
    { icon: 'bookmark', text: 'Nouveau favori ajouté: Développeur Full Stack', time: 'Il y a 12 minutes' },
    { icon: 'send', text: 'Candidature soumise: Google France', time: 'Il y a 25 minutes' },
    { icon: 'notifications_active', text: 'Alerte déclenchée: 3 nouveaux jobs "React"', time: 'Il y a 1 heure' }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {}
}
