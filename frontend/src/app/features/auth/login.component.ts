import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="login-page">
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <span class="brand">JobFinder</span>
            <h1>Welcome back</h1>
            <p>Connectez-vous à votre compte pour continuer</p>
          </div>
          
          <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input 
                id="email" 
                type="email" 
                formControlName="email" 
                placeholder="votre@email.com"
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
                placeholder="••••••••"
                [class.error]="form.get('password')?.invalid && form.get('password')?.touched"
              />
              <span class="error-message" *ngIf="form.get('password')?.invalid && form.get('password')?.touched">
                Le mot de passe est requis
              </span>
            </div>
            
            <div class="form-options">
              <label class="remember">
                <input type="checkbox" formControlName="remember" />
                <span>Se souvenir de moi</span>
              </label>
              <a href="#" class="forgot">Mot de passe oublié ?</a>
            </div>
            
            <div class="error-banner" *ngIf="errorMessage">
              {{ errorMessage }}
            </div>
            
            <button type="submit" class="btn-primary" [disabled]="loading || form.invalid">
              <span *ngIf="!loading">Se connecter</span>
              <span *ngIf="loading" class="spinner"></span>
            </button>
          </form>
          
          <div class="login-footer">
            <p>Pas encore de compte ? <a routerLink="/auth/register">Créer un compte</a></p>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      background: radial-gradient(circle at 0% 0%, rgba(37, 99, 235, 0.08), transparent 40%),
                  radial-gradient(circle at 100% 100%, rgba(16, 185, 129, 0.06), transparent 35%),
                  #F8FAFC;
    }
    
    .login-container {
      width: 100%;
      max-width: 440px;
    }
    
    .login-card {
      background: #ffffff;
      border-radius: 1.5rem;
      padding: 2.5rem;
      box-shadow: 0 12px 32px -4px rgba(37, 99, 235, 0.08);
    }
    
    .login-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    
    .brand {
      font-size: 1.5rem;
      font-weight: 800;
      color: #2563EB;
      letter-spacing: -0.02em;
    }
    
    .login-header h1 {
      font-size: 1.75rem;
      font-weight: 700;
      color: #1E293B;
      margin: 1rem 0 0.5rem;
      letter-spacing: -0.01em;
    }
    
    .login-header p {
      color: #64748b;
      font-size: 0.95rem;
    }
    
    .login-form {
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
    
    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.9rem;
    }
    
    .remember {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
      color: #64748b;
    }
    
    .remember input {
      accent-color: #2563EB;
    }
    
    .forgot {
      color: #2563EB;
      text-decoration: none;
      font-weight: 500;
    }
    
    .forgot:hover {
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
    
    .login-footer {
      margin-top: 1.5rem;
      text-align: center;
      color: #64748b;
      font-size: 0.9rem;
    }
    
    .login-footer a {
      color: #2563EB;
      font-weight: 600;
      text-decoration: none;
    }
    
    .login-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class LoginComponent {
  form;
  loading = false;
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      remember: [false]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    
    this.loading = true;
    this.errorMessage = '';
    
    const { email, password } = this.form.value;
    
    this.authService.login({ email: email!, password: password! }).subscribe({
      next: () => {
        this.authService.getCurrentUser().subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Email ou mot de passe incorrect';
      }
    });
  }
}
