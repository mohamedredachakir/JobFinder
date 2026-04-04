import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard-page">
      <!-- Sidebar -->
      <aside class="sidebar">
        <div class="sidebar-brand">
          <span class="brand">Career Architect</span>
          <p class="user-level">Premium Member</p>
        </div>
        <nav class="sidebar-nav">
          <a routerLink="/dashboard" class="nav-item active">
            <span class="material-symbols-outlined">dashboard</span>
            <span class="nav-text">Dashboard</span>
          </a>
          <a routerLink="/jobs" class="nav-item">
            <span class="material-symbols-outlined">search</span>
            <span class="nav-text">Find Jobs</span>
          </a>
          <a routerLink="/applications" class="nav-item">
            <span class="material-symbols-outlined">work_history</span>
            <span class="nav-text">Applications</span>
          </a>
          <a routerLink="/favorites" class="nav-item">
            <span class="material-symbols-outlined">bookmark</span>
            <span class="nav-text">Saved Jobs</span>
          </a>
          <a routerLink="/alerts" class="nav-item">
            <span class="material-symbols-outlined">notifications</span>
            <span class="nav-text">Job Alerts</span>
          </a>
          <a routerLink="/profile" class="nav-item">
            <span class="material-symbols-outlined">settings</span>
            <span class="nav-text">Profile</span>
          </a>
          <a routerLink="/admin" class="nav-item" *ngIf="isAdmin">
            <span class="material-symbols-outlined">admin_panel_settings</span>
            <span class="nav-text">Admin Panel</span>
          </a>
        </nav>
        <div class="sidebar-footer">
          <button class="post-job-btn">Post a Job</button>
          <button class="logout-btn" (click)="logout()">Logout</button>
        </div>
      </aside>

      <!-- Main Content -->
      <main class="main-content">
        <!-- Top Header -->
        <header class="top-header">
          <div class="header-container">
            <h1 class="page-title">Dashboard</h1>
            <div class="header-nav">
              <nav class="header-links">
                <a routerLink="/jobs" class="header-link">Find Jobs</a>
                <a href="#" class="header-link">Companies</a>
                <a href="#" class="header-link">Salaries</a>
                <a href="#" class="header-link">My Careers</a>
              </nav>
              <div class="header-actions">
                <button class="notif-btn">
                  <span class="material-symbols-outlined">notifications</span>
                </button>
                <div class="user-avatar">
                  <img [src]="getUserAvatar()" alt="User" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div class="dashboard-content">
          <!-- Hero Section -->
          <section class="hero-section">
            <div class="hero-text">
              <h2>Hello, {{ getUserName() }}. <span class="muted">Ready for your next move?</span></h2>
              <p>Your career trajectory is showing significant growth this week. You have {{ interviewsCount }} interviews scheduled and {{ newMatches }} new matches based on your profile.</p>
            </div>
            <div class="match-score-card">
              <div class="match-icon">
                <span class="material-symbols-outlined">trending_up</span>
              </div>
              <div class="match-info">
                <p class="match-label">Match Score Avg</p>
                <p class="match-value">94% <span class="trend">+2%</span></p>
              </div>
            </div>
          </section>

          <!-- KPI Grid -->
          <section class="kpi-grid">
            <div class="kpi-card">
              <span class="material-symbols-outlined kpi-icon">visibility</span>
              <p class="kpi-value">{{ jobsViewed }}</p>
              <p class="kpi-label">Offres vues</p>
            </div>
            <div class="kpi-card">
              <span class="material-symbols-outlined kpi-icon primary">send</span>
              <p class="kpi-value">{{ applicationsCount }}</p>
              <p class="kpi-label">Candidatures</p>
            </div>
            <div class="kpi-card">
              <span class="material-symbols-outlined kpi-icon success">event_available</span>
              <p class="kpi-value">{{ interviewsCount }}</p>
              <p class="kpi-label">Entretiens</p>
            </div>
            <div class="kpi-card">
              <span class="material-symbols-outlined kpi-icon secondary">pending_actions</span>
              <p class="kpi-value">{{ pendingCount }}</p>
              <p class="kpi-label">En attente</p>
            </div>
          </section>

          <!-- Charts Section -->
          <section class="charts-section">
            <!-- Activity Chart -->
            <div class="chart-card activity-chart">
              <div class="chart-header">
                <h3>Activité de la semaine</h3>
                <div class="chart-badges">
                  <span class="chart-badge">Week 42</span>
                </div>
              </div>
              <div class="chart-body">
                <div class="bar-chart">
                  <div class="bar" *ngFor="let h of chartData; let i = index" [style.height.%]="h" [class.today]="i === 2">
                    <div class="bar-tooltip" *ngIf="i === 2">Today</div>
                    <div class="bar-tooltip" *ngIf="i !== 2">{{ getBarValue(h) }}</div>
                  </div>
                </div>
                <div class="chart-labels">
                  <span *ngFor="let day of weekDays">{{ day }}</span>
                </div>
              </div>
            </div>

            <!-- Doughnut Chart -->
            <div class="chart-card doughnut-chart">
              <h3>Statut candidatures</h3>
              <div class="doughnut-container">
                <div class="doughnut-bg"></div>
                <div class="doughnut-progress"></div>
                <div class="doughnut-center">
                  <span class="doughnut-value">{{ applicationsCount }}</span>
                  <span class="doughnut-label">Total</span>
                </div>
              </div>
              <div class="doughnut-legend">
                <div class="legend-item">
                  <div class="legend-dot primary"></div>
                  <span>En cours</span>
                  <span class="legend-value">{{ applicationsCount - acceptedCount - rejectedCount }}</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot success"></div>
                  <span>Acceptées</span>
                  <span class="legend-value">{{ acceptedCount }}</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot error"></div>
                  <span>Refusées</span>
                  <span class="legend-value">{{ rejectedCount }}</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Recommendations & Alerts -->
          <section class="main-grid">
            <!-- Job Recommendations -->
            <div class="recommendations-section">
              <div class="section-header">
                <h3>Suggested for You</h3>
                <a routerLink="/jobs" class="view-all">View All</a>
              </div>
              <div class="job-list">
                <div class="job-card featured" *ngFor="let job of recommendedJobs; let i = index" [class.collapsed]="i >= 2">
                  <div class="job-logo">
                    <img [src]="job.logoUrl || 'https://via.placeholder.com/64'" [alt]="job.company" />
                  </div>
                  <div class="job-info">
                    <div class="job-header">
                      <div>
                        <h4>{{ job.title }}</h4>
                        <p class="company-name">{{ job.company }} • {{ job.location }}</p>
                      </div>
                      <div class="match-badge" *ngIf="job.matchScore">
                        <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">star</span>
                        {{ job.matchScore }}% Match
                      </div>
                    </div>
                    <div class="job-tags">
                      <span class="tag">{{ job.type || 'Full-time' }}</span>
                      <span class="tag">{{ job.salary || '€75k - €95k' }}</span>
                      <span class="tag">{{ job.workMode || 'Hybrid' }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Recent Alerts -->
            <div class="alerts-section">
              <h3>Recent Alerts</h3>
              <div class="alert-list">
                <div class="alert-item alert-primary">
                  <div class="alert-icon">
                    <span class="material-symbols-outlined">mail</span>
                  </div>
                  <div class="alert-content">
                    <p class="alert-title">New Interview Request</p>
                    <p class="alert-desc">Google Inc. wants to schedule a technical chat for Monday.</p>
                    <p class="alert-time">2 hours ago</p>
                  </div>
                </div>
                <div class="alert-item alert-success">
                  <div class="alert-icon">
                    <span class="material-symbols-outlined">check_circle</span>
                  </div>
                  <div class="alert-content">
                    <p class="alert-title">Profile Viewed</p>
                    <p class="alert-desc">Recruiters from Stripe and Airbnb viewed your resume.</p>
                    <p class="alert-time">5 hours ago</p>
                  </div>
                </div>
                <div class="alert-item alert-neutral">
                  <div class="alert-icon">
                    <span class="material-symbols-outlined">notifications_active</span>
                  </div>
                  <div class="alert-content">
                    <p class="alert-title">Job Alert: UX Design</p>
                    <p class="alert-desc">14 new jobs match your "Remote UX" search filter.</p>
                    <p class="alert-time">Yesterday</p>
                  </div>
                </div>
              </div>

              <!-- Career Tip -->
              <div class="career-tip">
                <div class="tip-glow"></div>
                <h4>Maximize your visibility</h4>
                <p>Candidates with a portfolio link get 45% more recruiter views. Add yours today.</p>
                <button class="tip-btn">Update Portfolio</button>
              </div>
            </div>
          </section>
        </div>

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
      </main>
    </div>
  `,
  styles: [`
    .dashboard-page {
      display: flex;
      min-height: 100vh;
      background: #f7f9fb;
    }

    .sidebar {
      width: 18rem;
      height: 100vh;
      position: fixed;
      left: 0;
      top: 0;
      background: #f7f9fb;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      z-index: 100;
      border-right: 1px solid transparent;
    }

    .sidebar-brand {
      padding: 0 1rem 2.5rem;
    }

    .brand {
      font-size: 1.25rem;
      font-weight: 800;
      color: #2563EB;
      letter-spacing: -0.02em;
    }

    .user-level {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #94a3b8;
      margin-top: 0.25rem;
    }

    .sidebar-nav {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      flex: 1;
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

    .nav-item .material-symbols-outlined {
      font-size: 1.25rem;
    }

    .sidebar-footer {
      padding-top: 1rem;
    }

    .post-job-btn {
      width: 100%;
      padding: 0.75rem;
      background: linear-gradient(135deg, #2563EB, #2563eb);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.2);
      transition: all 0.2s;
    }

    .post-job-btn:hover {
      opacity: 0.9;
      transform: scale(0.98);
    }

    .logout-btn {
      width: 100%;
      padding: 0.75rem;
      margin-top: 0.5rem;
      background: transparent;
      color: #ba1a1a;
      border: 1px solid #ba1a1a;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .logout-btn:hover {
      background: #ba1a1a;
      color: white;
    }

    .main-content {
      margin-left: 18rem;
      flex: 1;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .top-header {
      position: fixed;
      top: 0;
      right: 0;
      left: 18rem;
      height: 5rem;
      background: rgba(247, 249, 251, 0.85);
      backdrop-filter: blur(12px);
      display: flex;
      align-items: center;
      z-index: 50;
      box-shadow: 0 1px 0 rgba(0, 0, 0, 0.05);
    }

    .header-container {
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 3rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .page-title {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563EB;
      letter-spacing: -0.02em;
    }

    .header-nav {
      display: flex;
      align-items: center;
      gap: 2rem;
    }

    .header-links {
      display: flex;
      gap: 1.5rem;
    }

    .header-link {
      color: #94a3b8;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: color 0.2s;
    }

    .header-link:hover {
      color: #2563EB;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .notif-btn {
      width: 2.5rem;
      height: 2.5rem;
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

    .notif-btn:hover {
      background: #e6e8ea;
      color: #2563EB;
    }

    .user-avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      overflow: hidden;
      border: 2px solid white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .dashboard-content {
      margin-top: 5rem;
      padding: 2rem 3rem 3rem;
      max-width: 1400px;
      width: 100%;
      flex: 1;
    }

    .hero-section {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
      gap: 2rem;
      flex-wrap: wrap;
    }

    .hero-text {
      flex: 1;
    }

    .hero-text h2 {
      font-size: 3rem;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 1rem;
      letter-spacing: -0.02em;
    }

    .muted {
      color: rgba(0, 74, 198, 0.4);
    }

    .hero-text p {
      font-size: 1.1rem;
      color: #64748b;
      max-width: 600px;
      line-height: 1.6;
    }

    .match-score-card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.5rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border-radius: 1.5rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .match-icon {
      width: 3rem;
      height: 3rem;
      background: rgba(0, 98, 66, 0.1);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #10B981;
    }

    .match-label {
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
      font-weight: 700;
    }

    .match-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1E293B;
    }

    .trend {
      font-size: 0.85rem;
      font-weight: 500;
      color: #10B981;
    }

    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .kpi-card {
      background: white;
      padding: 2rem;
      border-radius: 1.5rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .kpi-card:hover {
      transform: translateY(-2px);
      background: #f7f9fb;
    }

    .kpi-icon {
      font-size: 2rem;
      color: #94a3b8;
    }

    .kpi-icon.primary {
      color: #2563EB;
    }

    .kpi-icon.success {
      color: #10B981;
    }

    .kpi-icon.secondary {
      color: #545f73;
    }

    .kpi-value {
      font-size: 2.5rem;
      font-weight: 700;
      color: #1E293B;
    }

    .kpi-label {
      font-size: 0.9rem;
      color: #94a3b8;
      font-weight: 500;
    }

    .charts-section {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
    }

    .chart-card {
      background: #eceef0;
      padding: 2rem;
      border-radius: 1.5rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06);
    }

    .chart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .chart-header h3 {
      font-size: 1.25rem;
      font-weight: 700;
    }

    .chart-badges {
      display: flex;
      gap: 0.5rem;
    }

    .chart-badge {
      padding: 0.4rem 0.75rem;
      background: white;
      border-radius: 999px;
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
    }

    .chart-body {
      padding: 0 0.5rem;
    }

    .bar-chart {
      height: 16rem;
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
    }

    .bar {
      flex: 1;
      background: rgba(0, 74, 198, 0.1);
      border-radius: 0.5rem 0.5rem 0 0;
      transition: all 0.3s;
      position: relative;
      cursor: pointer;
    }

    .bar:hover {
      background: rgba(0, 74, 198, 0.2);
    }

    .bar:hover .bar-tooltip {
      opacity: 1;
    }

    .bar.today {
      background: #2563EB;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.3);
    }

    .bar-tooltip {
      position: absolute;
      top: -2rem;
      left: 50%;
      transform: translateX(-50%);
      background: #1E293B;
      color: white;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.65rem;
      opacity: 0;
      transition: opacity 0.2s;
      white-space: nowrap;
    }

    .chart-labels {
      display: flex;
      justify-content: space-between;
      margin-top: 1rem;
      padding: 0 0.5rem;
    }

    .chart-labels span {
      font-size: 0.65rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }

    .doughnut-chart {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .doughnut-chart h3 {
      font-size: 1.25rem;
      font-weight: 700;
      align-self: flex-start;
      margin-bottom: 1.5rem;
    }

    .doughnut-container {
      position: relative;
      width: 12rem;
      height: 12rem;
      margin-bottom: 2rem;
    }

    .doughnut-bg {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1rem solid #e6e8ea;
    }

    .doughnut-progress {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 1rem solid transparent;
      border-top-color: #2563EB;
      border-right-color: #10B981;
      transform: rotate(-45deg);
    }

    .doughnut-center {
      position: absolute;
      inset: 2rem;
      background: white;
      border-radius: 50%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    .doughnut-value {
      font-size: 2rem;
      font-weight: 700;
      color: #1E293B;
    }

    .doughnut-label {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #94a3b8;
    }

    .doughnut-legend {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.9rem;
    }

    .legend-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
    }

    .legend-dot.primary {
      background: #2563EB;
    }

    .legend-dot.success {
      background: #10B981;
    }

    .legend-dot.error {
      background: #ba1a1a;
    }

    .legend-item span:nth-child(2) {
      flex: 1;
      color: #64748b;
      font-weight: 500;
    }

    .legend-value {
      font-weight: 700;
    }

    .main-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 3rem;
    }

    .recommendations-section {
      background: white;
      padding: 2rem;
      border-radius: 1.5rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.06);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h3 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .view-all {
      color: #2563EB;
      text-decoration: none;
      font-weight: 700;
      font-size: 0.85rem;
    }

    .view-all:hover {
      text-decoration: underline;
    }

    .job-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .job-card {
      display: flex;
      gap: 1.5rem;
      padding: 1.5rem;
      background: #f7f9fb;
      border-radius: 1.5rem;
      cursor: pointer;
      transition: all 0.2s;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .job-card:hover {
      background: #f2f4f6;
    }

    .job-card.collapsed {
      opacity: 0.8;
    }

    .job-card.collapsed .job-info h4 {
      font-size: 1rem;
    }

    .job-logo {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      background: #f1f5f9;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex-shrink: 0;
    }

    .job-logo img {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: contain;
    }

    .job-info {
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

    .job-info h4 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1E293B;
      transition: color 0.2s;
    }

    .job-card:hover .job-info h4 {
      color: #2563EB;
    }

    .company-name {
      font-size: 0.85rem;
      color: #94a3b8;
      font-weight: 500;
      margin-top: 0.25rem;
    }

    .match-badge {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      padding: 0.4rem 0.75rem;
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 999px;
    }

    .match-badge .material-symbols-outlined {
      font-size: 1rem;
    }

    .job-tags {
      display: flex;
      gap: 0.5rem;
    }

    .tag {
      padding: 0.4rem 0.75rem;
      background: #f2f4f6;
      color: #64748b;
      font-size: 0.75rem;
      font-weight: 500;
      border-radius: 0.5rem;
    }

    .alerts-section {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .alerts-section > h3 {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .alert-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .alert-item {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: white;
      border-radius: 1.25rem;
      transition: transform 0.2s;
      cursor: pointer;
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .alert-item:hover {
      transform: scale(1.02);
    }

    .alert-item.alert-primary {
      background: rgba(0, 74, 198, 0.05);
      border-color: rgba(0, 74, 198, 0.1);
    }

    .alert-item.alert-success {
      background: rgba(0, 98, 66, 0.05);
      border-color: rgba(0, 98, 66, 0.1);
    }

    .alert-item.alert-neutral {
      background: #eceef0;
    }

    .alert-icon {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .alert-primary .alert-icon {
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
    }

    .alert-success .alert-icon {
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
    }

    .alert-neutral .alert-icon {
      background: #d8dadc;
      color: #94a3b8;
    }

    .alert-content {
      flex: 1;
    }

    .alert-title {
      font-weight: 700;
      font-size: 0.9rem;
      color: #1E293B;
    }

    .alert-desc {
      font-size: 0.8rem;
      color: #94a3b8;
      margin: 0.25rem 0;
    }

    .alert-time {
      font-size: 0.65rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #2563EB;
    }

    .alert-success .alert-time {
      color: #10B981;
    }

    .alert-neutral .alert-time {
      color: #94a3b8;
    }

    .career-tip {
      background: #1E293B;
      color: white;
      padding: 2rem;
      border-radius: 1.5rem;
      position: relative;
      overflow: hidden;
      margin-top: 1rem;
    }

    .tip-glow {
      position: absolute;
      top: 0;
      right: 0;
      width: 8rem;
      height: 8rem;
      background: rgba(0, 74, 198, 0.2);
      border-radius: 50%;
      filter: blur(60px);
      transform: translate(30%, -30%);
    }

    .career-tip h4 {
      font-size: 1.25rem;
      margin-bottom: 0.75rem;
      position: relative;
      z-index: 1;
    }

    .career-tip p {
      color: rgba(255, 255, 255, 0.6);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      line-height: 1.6;
      position: relative;
      z-index: 1;
    }

    .tip-btn {
      width: 100%;
      padding: 0.75rem;
      background: white;
      color: #1E293B;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      font-size: 0.85rem;
      cursor: pointer;
      transition: background 0.2s;
      position: relative;
      z-index: 1;
    }

    .tip-btn:hover {
      background: #f2f4f6;
    }

    .footer {
      background: #f7f9fb;
      border-top: 1px solid #f1f5f9;
      padding: 3rem 2rem;
      margin-top: 3rem;
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

    @media (max-width: 1200px) {
      .kpi-grid {
        grid-template-columns: repeat(2, 1fr);
      }

      .charts-section {
        grid-template-columns: 1fr;
      }

      .main-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 900px) {
      .sidebar {
        display: none;
      }

      .main-content {
        margin-left: 0;
      }

      .top-header {
        left: 0;
      }

      .header-container {
        padding: 0 1.5rem;
      }

      .dashboard-content {
        padding: 6rem 1.5rem 1.5rem;
      }

      .hero-text h2 {
        font-size: 2rem;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  jobsViewed = 127;
  applicationsCount = 12;
  interviewsCount = 3;
  pendingCount = 5;
  acceptedCount = 3;
  rejectedCount = 2;
  newMatches = 5;
  isAdmin = false;

  chartData = [40, 60, 95, 30, 55, 80, 45];
  weekDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  recommendedJobs = [
    { title: 'Senior UX Architect', company: 'Quantum Design Systems', location: 'Paris, FR', logoUrl: null, matchScore: 98, type: 'Full-time', salary: '€75k - €95k', workMode: 'Hybrid' },
    { title: 'Product Strategy Lead', company: 'Lumina FinTech', location: 'Remote', logoUrl: null, matchScore: 92, type: 'Contract', salary: '€500/day', workMode: 'Remote' },
    { title: 'Staff Frontend Engineer', company: 'LogiFlow Global', location: 'Lyon, FR', logoUrl: null, matchScore: 88, type: 'Full-time', salary: '€65k - €80k', workMode: 'Hybrid' },
    { title: 'Creative Director', company: 'Studio Nova', location: 'Bordeaux, FR', logoUrl: null, matchScore: 85, type: 'Full-time', salary: '€70k - €90k', workMode: 'On-site' }
  ];

  constructor(private authService: AuthService, private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.loadData();
    const user = this.authService.getUser();
    this.isAdmin = user?.role === 'ADMIN';
  }

  loadData(): void {
    this.api.getApplications().subscribe({
      next: (apps) => {
        this.applicationsCount = apps.length;
        this.pendingCount = apps.filter((a: any) => a.status === 'APPLIED').length;
        this.interviewsCount = apps.filter((a: any) => a.status === 'INTERVIEW').length;
        this.acceptedCount = apps.filter((a: any) => a.status === 'ACCEPTED').length;
        this.rejectedCount = apps.filter((a: any) => a.status === 'REJECTED').length;
      }
    });
  }

  getBarValue(height: number): number {
    return Math.round(height * 1.5);
  }

  getUserName(): string {
    const user = this.authService.getUser();
    return user ? user.firstName : 'Alex';
  }

  getUserAvatar(): string {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100';
  }

  logout(): void {
    this.authService.logout();
  }
}
