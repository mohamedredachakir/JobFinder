import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="register-page">
      <div class="register-container">
        <div class="register-card">
          <div class="register-header">
            <span class="brand">JobFinder</span>
            <h1>Créer un compte</h1>
            <p>Rejoignez des milliers de chercheurs d'emploi</p>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="submit()" class="register-form">
            <div class="name-row">
              <div class="form-group">
                <label for="firstName">Prénom</label>
                <input 
                  id="firstName" 
                  type="text" 
                  formControlName="firstName" 
                  placeholder="Jean"
                  [class.error]="form.get('firstName')?.invalid && form.get('firstName')?.touched"
                />
                <span class="error-message" *ngIf="form.get('firstName')?.invalid && form.get('firstName')?.touched">
                  Le prénom est requis
                </span>
              </div>
              
              <div class="form-group">
                <label for="lastName">Nom</label>
                <input 
                  id="lastName" 
                  type="text" 
                  formControlName="lastName" 
                  placeholder="Dupont"
                  [class.error]="form.get('lastName')?.invalid && form.get('lastName')?.touched"
                />
                <span class="error-message" *ngIf="form.get('lastName')?.invalid && form.get('lastName')?.touched">
                  Le nom est requis
                </span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email" 
                placeholder="jean.dupont@email.com"
                [class.error]="form.get('email')?.invalid && form.get('email')?.touched"
              />
              <span class="error-message" *ngIf="form.get('email')?.invalid && form.get('email')?.touched">
                Veuillez entrer un email valide
              </span>
            </div>
            
            <div class="form-group">
              <label for="password">Mot de passe</label>
              <input 
                id="password" 
                type="password" 
                formControlName="password" 
                placeholder="8 caractères minimum"
                [class.error]="form.get('password')?.invalid && form.get('password')?.touched"
              />
              <span class="error-message" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
                Minimum 8 caractères avec 1 majuscule et 1 chiffre
              </span>
            </div>
            
            <div class="form-group">
              <label for="confirmPassword">Confirmer</label>
              <input 
                id="confirmPassword" 
                type="password" 
                formControlName="confirmPassword" 
                placeholder="Confirmez le mot de passe"
                [class.error]="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched"
              />
              <span class="error-message" *ngIf="form.get('confirmPassword')?.invalid && form.get('confirmPassword')?.touched">
                Les mots de passe ne correspondent pas
              </span>
            </div>
            
            <div class="terms">
              <label>
                <input type="checkbox" formControlName="acceptTerms" />
                <span>J'accepte les <a href="#">conditions d'utilisation</a></span>
              </label>
            </div>
            
            <div class="error-banner" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            
            <div class="success-banner" *ngIf="successMessage">
              {{ successMessage }}
            </div>
            
            <button type="submit" class="btn-primary" [disabled]="loading || form.invalid">
              <span *ngIf="!loading">Créer mon compte</span>
              <span *ngIf="loading" class="spinner"></span>
            </button>
          </form>
          
          <div class="register-footer">
            <p>Déjà un compte ? <a routerLink="/auth/login">Se connecter</a></p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .register-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.08), transparent 40%),
                  radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.06), transparent 35%),
                  #F8FAFC;
    }
    
    .register-container {
      width: 100%;
      max-width: 480px;
    }
    
    .register-card {
      background: #ffffff;
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 12px 32px -4px rgba(37, 99, 235, 0.08);
    }
    
    .register-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .brand {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2563EB;
      letter-spacing: -0.02em;
    }
    
    .register-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1E293B;
      margin: 1rem 0 0.5rem;
      letter-spacing: -0.01em;
    }
    
    .register-header p {
      color: #64748b;
      font-size: 0.95rem;
    }
    
    .register-form {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    
    .name-row {
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
    
    .form-group input {
      padding: 0.875rem 1rem;
      border: 1px solid #c3c6d7;
      border-radius: 0.75rem;
      font-size: 1rem;
      transition: all 0.2s;
      background: #f7f9fb;
    }
    
    .form-group input:focus {
      outline: none;
      border-color: #2563EB;
      background: #ffffff;
      box-shadow: 0 0 0 3px rgba(0, 74, 198, 0.1);
    }
    
    .form-group input.error {
      border-color: #ba1a1a;
    }
    
    .error-message {
      color: #ba1a1a;
      font-size: 0.8rem;
    }
    
    .terms {
      font-size: 0.9rem;
      color: #64748b;
    }
    
    .terms label {
      display: flex;
      align-items: flex-start;
      gap: 0.5rem;
      cursor: pointer;
    }
    
    .terms input {
      margin-top: 0.25rem;
      accent-color: #2563EB;
    }
    
    .terms a {
      color: #2563EB;
      text-decoration: none;
    }
    
    .terms a:hover {
      text-decoration: underline;
    }
    
    .error-banner {
      background: #ffdad6;
      color: #93000a;
      padding: 0.875rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      text-align: center;
    }
    
    .success-banner {
      background: rgba(0, 98, 66, 0.1);
      color: #006242;
      padding: 0.875rem 1rem;
      border-radius: 0.75rem;
      font-size: 0.9rem;
      text-align: center;
    }
    
    .btn-primary {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(135deg, #2563EB, #2563eb);
      color: white;
      border: none;
      border-radius: 0.75rem;
      font-size: 1rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 8px 20px -4px rgba(0, 74, 198, 0.3);
    }
    
    .btn-primary:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .spinner {
      width: 20px;
      height: 20px;
      border: 2px solid transparent;
      border-top-color: white;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    .register-footer {
      margin-top: 1.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }
    
    .register-footer a {
      color: #2563EB;
      font-weight: 600;
      text-decoration: none;
    }
    
    .register-footer a:hover {
      text-decoration: underline;
    }
    
    @media (max-width: 500px) {
      .name-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class RegisterComponent {
  form;
  loading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      confirmPassword: ['', Validators.required],
      acceptTerms: [false, Validators.requiredTrue]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: any) {
    const password = form.get('password')?.value;
    const confirm = form.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordMismatch: true };
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';
    
    const { firstName, lastName, email, password } = this.form.value;
    
    this.authService.register({ firstName: firstName!, lastName: lastName!, email: email!, password: password! }).subscribe({
      next: () => {
        this.successMessage = 'Compte créé avec succès ! Vous pouvez maintenant vous connecter.';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Une erreur est survenue';
      },
      complete: () => {
        this.loading = false;
      }
    });
  }
}
