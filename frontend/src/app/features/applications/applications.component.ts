import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ApiService } from '../../core/services/api.service';

interface KanbanColumn {
  id: string;
  title: string;
  items: KanbanItem[];
  color: string;
}

interface KanbanItem {
  id: string;
  title: string;
  company: string;
  location: string;
  logoUrl: string;
  badge?: string;
  badgeClass?: string;
  dateLabel?: string;
  dateIcon?: string;
  salary?: string;
  recruiterAvatar?: string;
  savedDate?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, DragDropModule, RouterLink],
  template: `
    <div class="applications-page">
      <!-- Top Navigation -->
      <nav class="top-nav">
        <div class="nav-container">
          <div class="nav-brand">
            <span class="brand-logo">JobFinder</span>
            <div class="nav-links">
              <a href="#" class="nav-link">Find Jobs</a>
              <a href="#" class="nav-link">Companies</a>
              <a href="#" class="nav-link">Salaries</a>
              <a href="#" class="nav-link active">My Careers</a>
            </div>
          </div>
          <div class="nav-actions">
            <button class="icon-btn">
              <span class="material-symbols-outlined">notifications</span>
            </button>
            <div class="user-section">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100" alt="User" class="user-avatar" />
              <button class="icon-btn">
                <span class="material-symbols-outlined">account_circle</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-header">
          <h2 class="sidebar-brand">Career Architect</h2>
          <p class="sidebar-subtitle">Premium Member</p>
        </div>
        <nav class="sidebar-nav">
          <a href="#" class="nav-item">
            <span class="material-symbols-outlined">dashboard</span>
            <span>Dashboard</span>
          </a>
          <a routerLink="/applications" class="nav-item active">
            <span class="material-symbols-outlined">work_history</span>
            <span>Applications</span>
          </a>
          <a href="#" class="nav-item">
            <span class="material-symbols-outlined">bookmark</span>
            <span>Saved Jobs</span>
          </a>
          <a href="#" class="nav-item">
            <span class="material-symbols-outlined">chat</span>
            <span>Messages</span>
          </a>
          <a href="#" class="nav-item">
            <span class="material-symbols-outlined">settings</span>
            <span>Settings</span>
          </a>
        </nav>
        <div class="sidebar-tip">
          <p class="tip-title">Architect Tip</p>
          <p class="tip-text">Customize your Kanban to match your interview workflow.</p>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <header class="page-header">
          <div class="header-top">
            <nav class="breadcrumb">
              <span>Career</span>
              <span class="material-symbols-outlined">chevron_right</span>
              <span class="current">Applications Board</span>
            </nav>
          </div>
          <div class="header-main">
            <div class="header-info">
              <h1>Application Pipeline</h1>
              <p class="subtitle">Gérez vos opportunités professionnelles avec une précision d'architecte. Glissez-déposez pour mettre à jour votre progression.</p>
            </div>
            <div class="header-actions">
              <button class="btn-secondary">
                <span class="material-symbols-outlined">filter_list</span>
                Filtrer
              </button>
              <button class="btn-primary">
                <span class="material-symbols-outlined">add</span>
                Ajouter un job
              </button>
            </div>
          </div>
        </header>

        <!-- Kanban Board -->
        <div class="kanban-board">
          <div class="kanban-column" *ngFor="let column of columns">
            <div class="column-header">
              <div class="column-title">
                <span class="status-dot" [style.background]="column.color"></span>
                <h3>{{ column.title }}</h3>
                <span class="count">{{ column.items.length }}</span>
              </div>
              <button class="column-menu">
                <span class="material-symbols-outlined">more_horiz</span>
              </button>
            </div>

            <div class="column-content"
                 cdkDropList
                 [cdkDropListData]="column.items"
                 [id]="column.id"
                 (cdkDropListDropped)="drop($event)">
              
              <div class="kanban-card" *ngFor="let item of column.items" cdkDrag>
                <div class="drag-handle">
                  <span class="material-symbols-outlined">drag_indicator</span>
                </div>
                
                <div class="card-content" [routerLink]="['/jobs', item.id]">
                  <div class="card-badge-row" *ngIf="item.badge">
                    <span class="card-badge" [class]="item.badgeClass">{{ item.badge }}</span>
                  </div>
                  
                  <div class="company-row">
                    <img [src]="item.logoUrl" [alt]="item.company" class="company-logo" />
                    <div class="company-info">
                      <h4>{{ item.title }}</h4>
                      <p>{{ item.company }} • {{ item.location }}</p>
                    </div>
                  </div>
                  
                  <div class="card-footer">
                    <div class="date-info">
                      <span class="material-symbols-outlined">{{ item.dateIcon || 'schedule' }}</span>
                      <span>{{ item.dateLabel }}</span>
                    </div>
                    <div class="match-score" *ngIf="item.salary">
                      <span class="material-symbols-outlined" *ngIf="item.badgeClass === 'offer'">request_quote</span>
                      {{ item.salary }}
                    </div>
                    <img *ngIf="item.recruiterAvatar" [src]="item.recruiterAvatar" class="recruiter-avatar" alt="Recruiter" />
                  </div>
                </div>
              </div>

              <div class="empty-column" *ngIf="column.items.length === 0">
                <span class="material-symbols-outlined" *ngIf="column.id === 'negotiation'">handshake</span>
                <span class="material-symbols-outlined" *ngIf="column.id !== 'negotiation'">inbox</span>
                <p *ngIf="column.id === 'negotiation'">Aucun dossier en cours</p>
                <p *ngIf="column.id !== 'negotiation'">Aucun dossier</p>
              </div>
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
    .applications-page {
      min-height: 100vh;
      background: #f7f9fb;
    }

    .top-nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 50;
      background: rgba(247, 249, 251, 0.85);
      backdrop-filter: blur(12px);
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
    }

    .nav-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 3rem;
    }

    .brand-logo {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2563EB;
      letter-spacing: -0.02em;
    }

    .nav-links {
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

    .nav-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-section {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding-left: 1rem;
      border-left: 1px solid rgba(195, 198, 215, 0.3);
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
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
      opacity: 0.8;
    }

    .sidebar {
      width: 18rem;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: #f7f9fb;
      padding: 6rem 1.5rem 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      z-index: 40;
      display: none;
    }

    @media (min-width: 1024px) {
      .sidebar {
        display: flex;
      }
    }

    .sidebar-header {
      padding: 0 1rem 1rem;
    }

    .sidebar-brand {
      font-size: 1.25rem;
      font-weight: 700;
      color: #2563EB;
    }

    .sidebar-subtitle {
      font-size: 0.7rem;
      font-weight: 500;
      color: rgba(67, 70, 85, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.1em;
      margin-top: 0.25rem;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
      border-radius: 0.75rem;
      color: #94a3b8;
      text-decoration: none;
      font-weight: 500;
      font-size: 0.9rem;
      transition: all 0.2s;
    }

    .nav-item:hover {
      background: #e6e8ea;
      transform: translateX(4px);
    }

    .nav-item.active {
      background: white;
      color: #2563EB;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .sidebar-tip {
      margin-top: auto;
      padding: 1rem;
      background: rgba(37, 99, 235, 0.1);
      border-radius: 1rem;
    }

    .tip-title {
      font-size: 0.7rem;
      font-weight: 700;
      color: #2563EB;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }

    .tip-text {
      font-size: 0.75rem;
      color: #64748b;
      line-height: 1.5;
    }

    .main-content {
      padding: 6rem 2rem 2rem;
      min-height: 100vh;
    }

    @media (min-width: 1024px) {
      .main-content {
        margin-left: 18rem;
      }
    }

    .page-header {
      margin-bottom: 2.5rem;
    }

    .breadcrumb {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: rgba(67, 70, 85, 0.6);
      margin-bottom: 1rem;
    }

    .breadcrumb .current {
      color: #2563EB;
    }

    .header-main {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .header-info h1 {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1E293B;
      letter-spacing: -0.02em;
    }

    .subtitle {
      color: #64748b;
      max-width: 600px;
      line-height: 1.6;
      margin-top: 0.5rem;
    }

    .header-actions {
      display: flex;
      gap: 0.75rem;
    }

    .btn-secondary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.25rem;
      background: #f2f4f6;
      border: none;
      border-radius: 0.75rem;
      font-weight: 600;
      color: #1E293B;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 0.875rem;
    }

    .btn-secondary:hover {
      background: #e6e8ea;
    }

    .btn-primary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.5rem;
      background: linear-gradient(135deg, #2563EB, #2563eb);
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      color: white;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.2);
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .btn-primary:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .kanban-board {
      display: flex;
      gap: 1.5rem;
      overflow-x: auto;
      padding-bottom: 2rem;
      -webkit-overflow-scrolling: touch;
    }

    .kanban-board::-webkit-scrollbar {
      height: 8px;
    }

    .kanban-board::-webkit-scrollbar-track {
      background: transparent;
    }

    .kanban-board::-webkit-scrollbar-thumb {
      background: #e0e3e5;
      border-radius: 10px;
    }

    .kanban-column {
      flex-shrink: 0;
      width: 20rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .column-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 0.5rem;
    }

    .column-title {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }

    .column-title h3 {
      font-size: 0.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #1E293B;
    }

    .count {
      padding: 0.25rem 0.5rem;
      background: #e6e8ea;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 700;
    }

    .column-menu {
      width: 2rem;
      height: 2rem;
      border: none;
      background: transparent;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: rgba(67, 70, 85, 0.4);
      transition: all 0.2s;
    }

    .column-menu:hover {
      background: #e6e8ea;
      color: #64748b;
    }

    .column-content {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      min-height: 200px;
    }

    .kanban-card {
      background: white;
      padding: 1.25rem;
      border-radius: 1.25rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s;
      position: relative;
      border: 1px solid rgba(195, 198, 215, 0.1);
      cursor: pointer;
    }

    .kanban-card:hover {
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    }

    .kanban-card:hover .drag-handle {
      opacity: 1;
    }

    .kanban-card.cdk-drag-preview {
      box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
    }

    .kanban-card.cdk-drag-placeholder {
      opacity: 0.3;
    }

    .drag-handle {
      position: absolute;
      top: 1rem;
      right: 1rem;
      opacity: 0;
      color: rgba(67, 70, 85, 0.4);
      cursor: grab;
      transition: opacity 0.2s;
    }

    .card-badge-row {
      margin-bottom: 1rem;
    }

    .card-badge {
      padding: 0.25rem 0.5rem;
      border-radius: 0.5rem;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .card-badge.interview {
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
    }

    .card-badge.offer {
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
    }

    .card-badge.important {
      background: rgba(186, 26, 26, 0.1);
      color: #ba1a1a;
    }

    .card-badge.success {
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
    }

    .company-row {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .company-logo {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 0.75rem;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    .company-info h4 {
      font-size: 1rem;
      font-weight: 700;
      color: #1E293B;
      line-height: 1.3;
      margin-bottom: 0.25rem;
    }

    .company-info p {
      font-size: 0.75rem;
      font-weight: 500;
      color: #64748b;
    }

    .card-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .date-info {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      color: rgba(67, 70, 85, 0.6);
      font-size: 0.7rem;
      font-weight: 500;
    }

    .date-info .material-symbols-outlined {
      font-size: 1rem;
    }

    .match-score {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      font-weight: 700;
      color: #10B981;
      font-size: 0.7rem;
    }

    .match-score .material-symbols-outlined {
      font-size: 1rem;
    }

    .recruiter-avatar {
      width: 1.5rem;
      height: 1.5rem;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-column {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      border: 2px dashed rgba(195, 198, 215, 0.3);
      border-radius: 1.25rem;
      color: #c3c6d7;
      text-align: center;
      opacity: 0.6;
    }

    .empty-column .material-symbols-outlined {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .empty-column p {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .cdk-drop-list-dragging .kanban-card:not(.cdk-drag-placeholder) {
      transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
    }

    .footer {
      background: #f7f9fb;
      border-top: 1px solid #f1f5f9;
      padding: 3rem 2rem;
    }

    @media (min-width: 1024px) {
      .footer {
        margin-left: 18rem;
      }
    }

    .footer-container {
      max-width: 1400px;
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
      color: #1E293B;
    }

    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }

      .header-main {
        flex-direction: column;
        align-items: flex-start;
      }
    }
  `]
})
export class ApplicationsComponent implements OnInit {
  columns: KanbanColumn[] = [
    { 
      id: 'saved', 
      title: 'Sauvegardée', 
      items: [
        { id: '1', title: 'Senior UX Designer', company: 'Google', location: 'Paris', logoUrl: 'https://logo.clearbit.com/google.com', badge: '95% Match', badgeClass: 'success', savedDate: '12 Oct.', dateIcon: 'calendar_today' },
        { id: '2', title: 'Product Architect', company: 'Stripe', location: 'Remote', logoUrl: 'https://logo.clearbit.com/stripe.com', badge: 'Priorité importante', badgeClass: 'important', savedDate: '10 Oct.', dateIcon: 'calendar_today' }
      ], 
      color: '#94a3b8' 
    },
    { 
      id: 'applied', 
      title: 'Postulée', 
      items: [
        { id: '3', title: 'Creative Lead', company: 'Airbnb', location: 'Berlin', logoUrl: 'https://logo.clearbit.com/airbnb.com', dateLabel: 'Postulé il y a 2j', dateIcon: 'schedule' }
      ], 
      color: '#2563EB' 
    },
    { 
      id: 'interview', 
      title: 'Entretien', 
      items: [
        { id: '4', title: 'Principal Designer', company: 'Figma', location: 'London', logoUrl: 'https://logo.clearbit.com/figma.com', badge: "Demain à 14:00", badgeClass: 'interview', dateLabel: 'Google Meet', dateIcon: 'video_call', recruiterAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50' }
      ], 
      color: '#10B981' 
    },
    { 
      id: 'offer', 
      title: 'Offre', 
      items: [
        { id: '5', title: 'Design System lead', company: 'Spotify', location: 'Stockholm', logoUrl: 'https://logo.clearbit.com/spotify.com', badge: 'Félicitations!', badgeClass: 'offer', salary: '85k€ + Equity', dateIcon: 'request_quote' }
      ], 
      color: '#003ea8' 
    },
    { 
      id: 'negotiation', 
      title: 'Négociation', 
      items: [], 
      color: '#545f73' 
    },
    { 
      id: 'rejected', 
      title: 'Refusée', 
      items: [
        { id: '6', title: 'VR UI Designer', company: 'Meta', location: 'Menlo Park', logoUrl: 'https://logo.clearbit.com/meta.com', dateLabel: 'Refusé le 5 Oct.', dateIcon: 'cancel', badge: 'Refusé le 5 Oct.', badgeClass: 'important' }
      ], 
      color: '#ba1a1a' 
    }
  ];

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadApplications();
  }

  loadApplications(): void {
    this.api.getApplications().subscribe({
      next: (applications) => {
        this.columns.forEach(col => col.items = []);
        applications.forEach((app: any) => {
          const column = this.columns.find(c => c.id === this.mapStatusToColumn(app.status));
          if (column) {
            column.items.push({
              id: app.id,
              title: app.jobData?.title || 'Unknown Position',
              company: app.jobData?.company || 'Unknown',
              location: app.jobData?.location || '',
              logoUrl: app.jobData?.logoUrl || 'https://via.placeholder.com/40',
              dateLabel: this.formatDate(app.appliedAt || app.savedAt)
            });
          }
        });
      }
    });
  }

  mapStatusToColumn(status: string): string {
    const mapping: Record<string, string> = {
      'SAVED': 'saved',
      'APPLIED': 'applied',
      'INTERVIEW': 'interview',
      'OFFER': 'offer',
      'ACCEPTED': 'offer',
      'REJECTED': 'rejected'
    };
    return mapping[status] || 'saved';
  }

  mapColumnToStatus(columnId: string): string {
    const mapping: Record<string, string> = {
      'saved': 'SAVED',
      'applied': 'APPLIED',
      'interview': 'INTERVIEW',
      'offer': 'OFFER',
      'negotiation': 'OFFER',
      'rejected': 'REJECTED'
    };
    return mapping[columnId] || 'SAVED';
  }

  drop(event: CdkDragDrop<KanbanItem[]>): void {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const item = event.previousContainer.data[event.previousIndex];
      const newStatus = this.mapColumnToStatus(event.container.id);
      
      this.api.updateApplicationStatus(+item.id, newStatus).subscribe({
        next: () => {
          transferArrayItem(
            event.previousContainer.data,
            event.container.data,
            event.previousIndex,
            event.currentIndex
          );
        }
      });
    }
  }

  formatDate(dateStr: string): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
  }
}
