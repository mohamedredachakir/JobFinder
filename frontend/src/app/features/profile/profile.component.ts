import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from '../../core/models';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="profile-page">
      <header class="page-header">
        <h1>Mon Profil</h1>
        <p>Gérez vos informations personnelles</p>
      </header>

      <div class="profile-content">
        <!-- Profile Card -->
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar">
              <img [src]="getAvatar()" alt="Profile" />
            </div>
            <div class="avatar-info">
              <h2>{{ user?.firstName }} {{ user?.lastName }}</h2>
              <p>{{ user?.email }}</p>
              <span class="role-badge">{{ user?.role }}</span>
            </div>
          </div>

          <div class="cv-section">
            <div class="cv-upload" *ngIf="!user?.cvUrl">
              <span class="material-symbols-outlined">upload_file</span>
              <p>Uploader votre CV</p>
              <input type="file" accept=".pdf" (change)="uploadCV($event)" />
            </div>
            <div class="cv-info" *ngIf="user?.cvUrl">
              <span class="material-symbols-outlined">description</span>
              <span>CV uploaded</span>
              <button class="remove-cv" (click)="removeCV()">Supprimer</button>
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <div class="form-card">
          <h3>Informations personnelles</h3>
          <form class="profile-form" (ngSubmit)="saveProfile()">
            <div class="form-row">
              <div class="form-group">
                <label>Prénom</label>
                <input type="text" [(ngModel)]="formData.firstName" name="firstName" />
              </div>
              <div class="form-group">
                <label>Nom</label>
                <input type="text" [(ngModel)]="formData.lastName" name="lastName" />
              </div>
            </div>

            <div class="form-group">
              <label>Email</label>
              <input type="email" [(ngModel)]="formData.email" name="email" disabled />
            </div>

            <h3>Préférences</h3>
            <div class="form-group">
              <label>Localisation préférée</label>
              <input type="text" [(ngModel)]="formData.preferredLocation" name="preferredLocation" placeholder="Paris, Remote..." />
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Secteur préféré</label>
                <select [(ngModel)]="formData.preferredSector" name="preferredSector">
                  <option value="">Tous</option>
                  <option value="IT">IT & Tech</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Finance">Finance</option>
                  <option value="Design">Design</option>
                  <option value="Santé">Santé</option>
                </select>
              </div>
              <div class="form-group">
                <label>Salaire souhaité (EUR)</label>
                <input type="number" [(ngModel)]="formData.preferredSalary" name="preferredSalary" placeholder="50000" />
              </div>
            </div>

            <button type="submit" class="btn-save" [disabled]="saving">
              {{ saving ? 'Enregistrement...' : 'Enregistrer' }}
            </button>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="danger-card">
          <h3>Zone dangereuse</h3>
          <p>La suppression de votre compte est irréversible. Toutes vos données seront supprimées.</p>
          <button class="btn-danger" (click)="deleteAccount()">Supprimer mon compte</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-page {
      min-height: 100vh;
      background: #f7f9fb;
      padding: 2rem;
    }

    .page-header {
      max-width: 800px;
      margin: 0 auto 2rem;
    }

    .page-header h1 {
      font-size: 2rem;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 0.5rem;
    }

    .page-header p {
      color: #64748b;
    }

    .profile-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .profile-card,
    .form-card,
    .danger-card {
      background: white;
      border-radius: 1.5rem;
      padding: 2rem;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .avatar {
      width: 6rem;
      height: 6rem;
      border-radius: 50%;
      overflow: hidden;
      background: #dbeafe;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-info h2 {
      font-size: 1.5rem;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 0.25rem;
    }

    .avatar-info p {
      color: #64748b;
      margin-bottom: 0.5rem;
    }

    .role-badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      background: #dbeafe;
      color: #2563EB;
      font-size: 0.75rem;
      font-weight: 700;
      border-radius: 999px;
    }

    .cv-section {
      border-top: 1px solid #e6e8ea;
      padding-top: 1.5rem;
    }

    .cv-upload {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      border: 2px dashed #c3c6d7;
      border-radius: 1rem;
      cursor: pointer;
      position: relative;
      transition: all 0.2s;
    }

    .cv-upload:hover {
      border-color: #2563EB;
      background: #dbeafe;
    }

    .cv-upload input {
      position: absolute;
      inset: 0;
      opacity: 0;
      cursor: pointer;
    }

    .cv-upload .material-symbols-outlined {
      font-size: 2.5rem;
      color: #2563EB;
      margin-bottom: 0.5rem;
    }

    .cv-upload p {
      font-weight: 600;
      color: #1E293B;
    }

    .cv-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: #f2f4f6;
      border-radius: 0.75rem;
    }

    .cv-info .material-symbols-outlined {
      color: #10B981;
    }

    .remove-cv {
      margin-left: auto;
      padding: 0.4rem 0.75rem;
      background: #ffdad6;
      color: #ba1a1a;
      border: none;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.8rem;
      cursor: pointer;
    }

    .form-card h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #1E293B;
      margin-bottom: 1.5rem;
    }

    .form-card h3:not(:first-child) {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e6e8ea;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
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

    .form-group input:disabled {
      background: #f2f4f6;
      color: #64748b;
    }

    .btn-save {
      margin-top: 1rem;
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

    .btn-save:hover:not(:disabled) {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(0, 74, 198, 0.3);
    }

    .btn-save:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .danger-card {
      border: 1px solid #ffdad6;
    }

    .danger-card h3 {
      color: #ba1a1a;
      margin-bottom: 0.5rem;
    }

    .danger-card p {
      color: #64748b;
      margin-bottom: 1rem;
    }

    .btn-danger {
      padding: 0.75rem 1.5rem;
      background: #ba1a1a;
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-danger:hover {
      background: #ffdad6;
      color: #ba1a1a;
    }

    @media (max-width: 600px) {
      .form-row {
        grid-template-columns: 1fr;
      }

      .avatar-section {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  saving = false;
  formData: any = {};

  constructor(private authService: AuthService, private api: ApiService) {}

  ngOnInit(): void {
    this.loadUser();
  }

  loadUser(): void {
    this.api.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user;
        this.formData = { ...user };
      }
    });
  }

  saveProfile(): void {
    this.saving = true;
    this.api.updateProfile(this.formData).subscribe({
      next: (user) => {
        this.user = user;
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  uploadCV(event: any): void {
    const file = event.target.files[0];
    if (file && file.size <= 5 * 1024 * 1024) {
      this.api.uploadCv(file).subscribe({
        next: () => {
          this.loadUser();
        }
      });
    }
  }

  removeCV(): void {
    this.api.updateProfile({ cvUrl: null }).subscribe({
      next: () => {
        this.loadUser();
      }
    });
  }

  deleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.api.deleteAccount().subscribe({
        next: () => {
          this.authService.logout();
        }
      });
    }
  }

  getAvatar(): string {
    return 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200';
  }
}
