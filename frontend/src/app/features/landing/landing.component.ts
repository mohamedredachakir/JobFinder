import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="landing">
      <!-- Navigation -->
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <span class="brand-logo">JobFinder</span>
            <div class="nav-links">
              <a routerLink="/jobs" class="nav-link active">Find Jobs</a>
              <a href="#" class="nav-link">Companies</a>
              <a href="#" class="nav-link">Salaries</a>
              <a href="#" class="nav-link">My Careers</a>
            </div>
          </div>
          <div class="nav-actions">
            <div class="search-box">
              <span class="material-symbols-outlined search-icon">search</span>
              <input type="text" placeholder="Search..." />
            </div>
            <div class="action-buttons">
              <button class="btn-ghost" routerLink="/auth/login">Login</button>
              <button class="btn-primary" routerLink="/auth/register">Sign Up</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Hero Section -->
      <section class="hero">
        <div class="hero-container">
          <div class="hero-content">
            <div class="badge">
              <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">stars</span>
              <span>Édition Premium 2024</span>
            </div>
            <h1>Trouvez votre prochain <span class="highlight">emploi</span> en 1 clic</h1>
            <p class="hero-subtitle">L'architecture de votre carrière commence ici. Accédez à des opportunités exclusives sélectionnées par nos experts.</p>
            
            <div class="search-box-hero">
              <div class="search-field">
                <span class="material-symbols-outlined">work</span>
                <input type="text" [(ngModel)]="searchQuery" placeholder="Poste, titre ou mots-clés" />
              </div>
              <div class="search-divider"></div>
              <div class="search-field">
                <span class="material-symbols-outlined">location_on</span>
                <input type="text" [(ngModel)]="searchLocation" placeholder="Ville ou télétravail" />
              </div>
              <button class="search-btn" (click)="search()">Rechercher</button>
            </div>
            
            <button class="popular-link" (click)="search()">
              <span>Voir les offres populaires</span>
              <span class="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          
          <div class="hero-visual">
            <div class="visual-glow"></div>
            <div class="visual-card">
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600" alt="Professional" />
              <div class="match-badge">
                <div class="match-icon">
                  <span class="material-symbols-outlined" style="font-variation-settings: 'FILL' 1;">check_circle</span>
                </div>
                <div class="match-text">
                  <p class="match-score">Match Score: 98%</p>
                  <p class="match-desc">Profil idéal pour Designer Senior</p>
                </div>
              </div>
            </div>
            <div class="salary-card">
              <p class="salary-label">Salaire Estimé</p>
              <p class="salary-value">65k€ - 85k€</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Section -->
      <section class="categories">
        <div class="section-container">
          <div class="section-header">
            <div class="section-title">
              <p class="section-label">Exploration</p>
              <h2>Parcourir par catégories</h2>
            </div>
            <div class="category-filters">
              <button class="filter-btn active">Tous</button>
              <button class="filter-btn">IT & Tech</button>
              <button class="filter-btn">Marketing</button>
              <button class="filter-btn">Finance</button>
              <button class="filter-btn">Design</button>
              <button class="filter-btn">Santé</button>
            </div>
          </div>
          
          <div class="category-scroll">
            <div class="category-card" *ngFor="let cat of categories">
              <div class="category-header">
                <div class="category-icon" [style.background]="cat.bgColor">
                  <span class="material-symbols-outlined" [style.color]="cat.iconColor">{{ cat.icon }}</span>
                </div>
                <span class="category-badge" [class.remote]="cat.badge === 'Remote'" [class.cdd]="cat.badge === 'CDD'">{{ cat.badge }}</span>
              </div>
              <div class="category-info">
                <h3>{{ cat.title }}</h3>
                <p>{{ cat.company }} • {{ cat.location }}</p>
              </div>
              <div class="category-footer">
                <p class="category-salary">{{ cat.salary }}</p>
                <span class="material-symbols-outlined bookmark">bookmark</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials Section -->
      <section class="testimonials">
        <div class="section-container">
          <div class="testimonials-grid">
            <div class="testimonial-content">
              <p class="section-label">Témoignages</p>
              <h2>Ils ont bâti leur futur avec nous</h2>
              <p class="testimonial-desc">Nous ne nous contentons pas de lister des offres. Nous créons des connexions durables entre des talents d'exception et des entreprises visionnaires.</p>
              <button class="stories-link">
                <span class="play-icon">
                  <span class="material-symbols-outlined">play_arrow</span>
                </span>
                <span>Voir les success stories</span>
              </button>
            </div>
            
            <div class="testimonials-cards">
              <div class="testimonials-left">
                <div class="testimonial-card">
                  <div class="stars">
                    <span class="material-symbols-outlined" *ngFor="let s of [1,2,3,4,5]" style="font-variation-settings: 'FILL' 1;">star</span>
                  </div>
                  <p class="quote">"Une plateforme qui comprend vraiment les enjeux du recrutement haut de gamme. J'ai trouvé mon poste actuel en moins de deux semaines."</p>
                  <div class="testimonial-author">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100" alt="Author" />
                    <div>
                      <p class="author-name">Marc Antoine</p>
                      <p class="author-role">Product Manager</p>
                    </div>
                  </div>
                </div>
                
                <div class="stat-card stat-primary">
                  <p class="stat-value">94%</p>
                  <p class="stat-label">Taux de Satisfaction</p>
                </div>
              </div>
              
              <div class="testimonials-right">
                <div class="testimonial-card">
                  <div class="stars">
                    <span class="material-symbols-outlined" *ngFor="let s of [1,2,3,4,5]" style="font-variation-settings: 'FILL' 1;">star</span>
                  </div>
                  <p class="quote">"L'interface est d'une clarté incroyable. On n'a pas l'impression de chercher un emploi, mais de construire un avenir."</p>
                  <div class="testimonial-author">
                    <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100" alt="Author" />
                    <div>
                      <p class="author-name">Sophie L.</p>
                      <p class="author-role">Directrice Artistique</p>
                    </div>
                  </div>
                </div>
                
                <div class="stat-card stat-success">
                  <p class="stat-value">+12k</p>
                  <p class="stat-label">Offres Actives</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA Section -->
      <section class="cta-section">
        <div class="cta-container">
          <div class="cta-glow glow-1"></div>
          <div class="cta-glow glow-2"></div>
          <div class="cta-content">
            <h2>Prêt à franchir le cap ?</h2>
            <p>Rejoignez plus de 500,000 professionnels et recevez les meilleures offres directement dans votre boîte mail.</p>
            <div class="cta-form">
              <input type="email" placeholder="votre@email.com" />
              <button class="cta-btn">Commencer gratuitement</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-container">
          <div class="footer-brand">
            <span class="brand-logo">JobFinder Architect</span>
            <p class="copyright">© 2024 JobFinder Architect. All rights reserved.</p>
          </div>
          <div class="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
          </div>
          <div class="footer-social">
            <div class="social-icon"><span class="material-symbols-outlined">share</span></div>
            <div class="social-icon"><span class="material-symbols-outlined">language</span></div>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing {
      min-height: 100vh;
      background: #F8FAFC;
      color: #1E293B;
    }
    
    .navbar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(248, 250, 252, 0.85);
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
      color: #64748b;
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
      gap: 1.5rem;
    }
    
    .search-box {
      position: relative;
      display: none;
    }
    
    @media (min-width: 768px) {
      .search-box {
        display: block;
      }
    }
    
    .search-icon {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: #94a3b8;
    }
    
    .search-box input {
      padding: 0.5rem 0.75rem 0.5rem 2.5rem;
      background: #eceef0;
      border: none;
      border-radius: 999px;
      font-size: 0.875rem;
      width: 16rem;
    }
    
    .search-box input:focus {
      outline: none;
      box-shadow: 0 0 0 2px #2563EB;
    }
    
    .action-buttons {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .btn-ghost {
      padding: 0.5rem 1.25rem;
      background: transparent;
      border: none;
      color: #2563EB;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0.75rem;
      transition: background 0.2s;
    }
    
    .btn-ghost:hover {
      background: rgba(0, 74, 198, 0.05);
    }
    
    .btn-primary {
      padding: 0.5rem 1.25rem;
      background: linear-gradient(135deg, #2563EB, #2563eb);
      border: none;
      color: white;
      font-weight: 600;
      cursor: pointer;
      border-radius: 0.75rem;
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.2);
      transition: all 0.2s;
    }
    
    .btn-primary:hover {
      opacity: 0.9;
      transform: scale(0.98);
    }
    
    .hero {
      padding: 8rem 2rem 6rem;
      min-height: 100vh;
      display: flex;
      align-items: center;
      overflow: hidden;
    }
    
    .hero-container {
      max-width: 1440px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      align-items: center;
    }
    
    .hero-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
      z-index: 1;
    }
    
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4rem 1rem;
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
      border: 1px solid rgba(0, 98, 66, 0.1);
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      width: fit-content;
    }
    
    .badge .material-symbols-outlined {
      font-size: 1.1rem;
    }
    
    h1 {
      font-size: clamp(2.5rem, 5vw, 3.5rem);
      font-weight: 700;
      line-height: 1.1;
      letter-spacing: -0.02em;
    }
    
    .highlight {
      color: #2563EB;
      font-style: italic;
    }
    
    .hero-subtitle {
      font-size: 1.25rem;
      color: #64748b;
      line-height: 1.6;
      max-width: 32rem;
    }
    
    .search-box-hero {
      display: flex;
      align-items: center;
      padding: 0.5rem;
      background: white;
      border-radius: 1.5rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.08), 0 0 0 1px rgba(195, 198, 215, 0.1);
    }
    
    .search-field {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 1rem;
    }
    
    .search-field .material-symbols-outlined {
      color: #2563EB;
    }
    
    .search-field input {
      flex: 1;
      border: none;
      background: transparent;
      font-size: 0.95rem;
      color: #1E293B;
      font-weight: 500;
    }
    
    .search-field input:focus {
      outline: none;
    }
    
    .search-divider {
      width: 1px;
      height: 2rem;
      background: rgba(195, 198, 215, 0.3);
      display: none;
    }
    
    @media (min-width: 768px) {
      .search-divider {
        display: block;
      }
    }
    
    .search-btn {
      padding: 1rem 2rem;
      background: #2563EB;
      color: white;
      border: none;
      border-radius: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      box-shadow: 0 4px 16px rgba(0, 74, 198, 0.25);
    }
    
    .search-btn:hover {
      background: #2563eb;
    }
    
    .popular-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: #64748b;
      font-weight: 600;
      background: none;
      border: none;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .popular-link:hover {
      color: #2563EB;
    }
    
    .popular-link .material-symbols-outlined {
      transition: transform 0.2s;
    }
    
    .popular-link:hover .material-symbols-outlined {
      transform: translateX(4px);
    }
    
    .hero-visual {
      position: relative;
      display: none;
    }
    
    @media (min-width: 1024px) {
      .hero-visual {
        display: block;
      }
    }
    
    .visual-glow {
      position: absolute;
      top: -5rem;
      right: -5rem;
      width: 500px;
      height: 500px;
      background: rgba(0, 74, 198, 0.05);
      border-radius: 50%;
      filter: blur(100px);
    }
    
    .visual-card {
      position: relative;
      z-index: 1;
      border-radius: 2rem;
      overflow: hidden;
      box-shadow: 0 24px 48px -12px rgba(25, 28, 30, 0.15);
      transform: rotate(3deg) scale(1.05);
    }
    
    .visual-card img {
      width: 100%;
      height: auto;
      display: block;
    }
    
    .match-badge {
      position: absolute;
      bottom: 2rem;
      left: 2rem;
      right: 2rem;
      padding: 1.25rem;
      background: rgba(255, 255, 255, 0.85);
      backdrop-filter: blur(12px);
      border-radius: 1.25rem;
      border: 1px solid rgba(255, 255, 255, 0.2);
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    
    .match-icon {
      width: 3rem;
      height: 3rem;
      background: #10B981;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .match-icon .material-symbols-outlined {
      color: white;
    }
    
    .match-score {
      font-weight: 700;
      color: #1E293B;
      line-height: 1.3;
    }
    
    .match-desc {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .salary-card {
      position: absolute;
      bottom: -1.5rem;
      left: -1.5rem;
      z-index: 2;
      padding: 1.25rem 1.5rem;
      background: white;
      border-radius: 1.25rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.12);
      transform: rotate(-2deg);
      border: 1px solid #f1f5f9;
    }
    
    .salary-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94a3b8;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .salary-value {
      font-size: 1.5rem;
      font-weight: 700;
      color: #2563EB;
    }
    
    .categories {
      padding: 6rem 2rem;
      background: #f2f4f6;
    }
    
    .section-container {
      max-width: 1440px;
      margin: 0 auto;
    }
    
    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 4rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    
    .section-title {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .section-label {
      font-size: 0.7rem;
      font-weight: 700;
      color: #2563EB;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }
    
    .section-header h2 {
      font-size: 2.5rem;
      font-weight: 700;
      letter-spacing: -0.01em;
    }
    
    .category-filters {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    
    .filter-btn {
      padding: 0.75rem 1.5rem;
      background: white;
      border: none;
      border-radius: 999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #64748b;
    }
    
    .filter-btn:hover {
      background: #e0e3e5;
    }
    
    .filter-btn.active {
      background: #2563EB;
      color: white;
      box-shadow: 0 2px 8px rgba(0, 74, 198, 0.1);
    }
    
    .category-scroll {
      display: flex;
      gap: 2rem;
      overflow-x: auto;
      padding-bottom: 2rem;
      scroll-snap-type: x mandatory;
    }
    
    .category-scroll::-webkit-scrollbar {
      height: 8px;
    }
    
    .category-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .category-scroll::-webkit-scrollbar-thumb {
      background: #e0e3e5;
      border-radius: 4px;
    }
    
    .category-card {
      flex-shrink: 0;
      width: 340px;
      padding: 2rem;
      background: white;
      border-radius: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.2s;
      scroll-snap-align: start;
      cursor: pointer;
    }
    
    .category-card:hover {
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.12);
    }
    
    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 3rem;
    }
    
    .category-icon {
      width: 4rem;
      height: 4rem;
      border-radius: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }
    
    .category-card:hover .category-icon {
      transform: scale(1.1);
    }
    
    .category-icon .material-symbols-outlined {
      font-size: 2rem;
    }
    
    .category-badge {
      padding: 0.4rem 0.75rem;
      background: rgba(0, 98, 66, 0.1);
      color: #10B981;
      font-size: 0.7rem;
      font-weight: 700;
      border-radius: 999px;
    }
    
    .category-badge.remote {
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
    }
    
    .category-badge.cdd {
      background: rgba(0, 74, 198, 0.1);
      color: #2563EB;
    }
    
    .category-info {
      margin-bottom: 2rem;
    }
    
    .category-info h3 {
      font-size: 1.5rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
    }
    
    .category-info p {
      color: #64748b;
      font-size: 0.9rem;
    }
    
    .category-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .category-salary {
      font-weight: 700;
      font-size: 1.1rem;
    }
    
    .bookmark {
      color: #c3c6d7;
      cursor: pointer;
      transition: color 0.2s;
    }
    
    .bookmark:hover {
      color: #2563EB;
    }
    
    .testimonials {
      padding: 6rem 2rem;
    }
    
    .testimonials-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      align-items: center;
    }
    
    .testimonial-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .testimonial-desc {
      font-size: 1.25rem;
      color: #64748b;
      line-height: 1.6;
    }
    
    .stories-link {
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      color: #2563EB;
      font-weight: 700;
      background: none;
      border: none;
      cursor: pointer;
      padding: 0;
    }
    
    .play-icon {
      width: 3rem;
      height: 3rem;
      border: 2px solid #2563EB;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .stories-link:hover .play-icon {
      background: #2563EB;
      color: white;
    }
    
    .testimonials-cards {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
    }
    
    .testimonials-left,
    .testimonials-right {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .testimonial-card {
      background: white;
      padding: 1.5rem;
      border-radius: 2rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.08);
      border: 1px solid #f8fafc;
    }
    
    .stars {
      display: flex;
      gap: 2px;
      margin-bottom: 1rem;
      color: #10B981;
    }
    
    .stars .material-symbols-outlined {
      font-size: 1.25rem;
    }
    
    .quote {
      font-style: italic;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    
    .testimonial-author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    
    .testimonial-author img {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: 50%;
      object-fit: cover;
    }
    
    .author-name {
      font-weight: 700;
      font-size: 0.9rem;
    }
    
    .author-role {
      font-size: 0.75rem;
      color: #64748b;
    }
    
    .stat-card {
      padding: 2rem;
      border-radius: 2rem;
      box-shadow: 0 12px 32px -4px rgba(25, 28, 30, 0.08);
    }
    
    .stat-primary {
      background: #2563EB;
      color: white;
    }
    
    .stat-success {
      background: #10B981;
      color: white;
    }
    
    .stat-value {
      font-size: 3rem;
      font-weight: 700;
    }
    
    .stat-label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      opacity: 0.8;
    }
    
    .cta-section {
      padding: 6rem 2rem;
    }
    
    .cta-container {
      max-width: 1440px;
      margin: 0 auto;
      background: #2563EB;
      border-radius: 3rem;
      padding: 3rem 6rem;
      position: relative;
      overflow: hidden;
      text-align: center;
    }
    
    .cta-glow {
      position: absolute;
      border-radius: 50%;
    }
    
    .glow-1 {
      top: 0;
      right: 0;
      width: 400px;
      height: 400px;
      background: rgba(255, 255, 255, 0.1);
      filter: blur(80px);
      transform: translate(30%, -50%);
    }
    
    .glow-2 {
      bottom: 0;
      left: 0;
      width: 300px;
      height: 300px;
      background: rgba(0, 98, 66, 0.2);
      filter: blur(60px);
      transform: translate(-30%, 50%);
    }
    
    .cta-content {
      position: relative;
      z-index: 1;
      max-width: 40rem;
      margin: 0 auto;
    }
    
    .cta-content h2 {
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }
    
    .cta-content p {
      font-size: 1.25rem;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 2.5rem;
    }
    
    .cta-form {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .cta-form input {
      padding: 1.25rem 2rem;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 1.25rem;
      color: white;
      font-size: 1rem;
      width: 20rem;
      backdrop-filter: blur(12px);
    }
    
    .cta-form input::placeholder {
      color: rgba(255, 255, 255, 0.6);
    }
    
    .cta-form input:focus {
      outline: none;
      border-color: rgba(255, 255, 255, 0.5);
    }
    
    .cta-btn {
      padding: 1.25rem 2.5rem;
      background: white;
      color: #2563EB;
      border: none;
      border-radius: 1.25rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
      transition: all 0.2s;
    }
    
    .cta-btn:hover {
      background: #dbe1ff;
    }
    
    .footer {
      padding: 3rem 2rem;
      background: #f7f9fb;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    .footer-container {
      max-width: 1440px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 2rem;
    }
    
    .footer-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.5rem;
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
    
    .footer-social {
      display: flex;
      gap: 0.5rem;
    }
    
    .social-icon {
      width: 2rem;
      height: 2rem;
      background: #e0e3e5;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: #94a3b8;
    }
    
    .social-icon:hover {
      background: #2563EB;
      color: white;
    }
    
    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
      }
      
      .hero-visual {
        display: none;
      }
      
      .testimonials-grid {
        grid-template-columns: 1fr;
        gap: 3rem;
      }
      
      .cta-container {
        padding: 3rem 1.5rem;
      }
    }
    
    @media (max-width: 768px) {
      .nav-links {
        display: none;
      }
      
      .search-box-hero {
        flex-direction: column;
        border-radius: 1.25rem;
      }
      
      .search-divider {
        width: 100%;
        height: 1px;
      }
      
      .search-btn {
        width: 100%;
      }
      
      .category-filters {
        justify-content: flex-start;
      }
      
      .cta-form {
        flex-direction: column;
      }
      
      .cta-form input {
        width: 100%;
      }
      
      .footer-container {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class LandingComponent {
  searchQuery = '';
  searchLocation = '';

  categories = [
    { icon: 'token', title: 'Lead UX Designer', company: 'Architectural Lab', location: 'Paris', salary: '75k€ - 90k€', badge: 'CDI', bgColor: '#f1f5f9', iconColor: '#1e293b' },
    { icon: 'code', title: 'Développeur Fullstack', company: 'Vercel Corp', location: 'Remote', salary: '55k€ - 70k€', badge: 'Remote', bgColor: '#dbeafe', iconColor: '#2563eb' },
    { icon: 'monitoring', title: 'Data Scientist', company: 'Insight AI', location: 'Lyon', salary: '60k€ - 85k€', badge: 'CDI', bgColor: '#dcfce7', iconColor: '#16a34a' },
    { icon: 'campaign', title: 'Chef de Projet Marketing', company: "L'Oréal", location: 'Paris', salary: '45k€ - 55k€', badge: 'CDD', bgColor: '#f3e8ff', iconColor: '#9333ea' }
  ];

  constructor(private router: Router) {}

  search(): void {
    const params: any = {};
    if (this.searchQuery) params['q'] = this.searchQuery;
    if (this.searchLocation) params['location'] = this.searchLocation;
    this.router.navigate(['/jobs'], { queryParams: params });
  }
}
