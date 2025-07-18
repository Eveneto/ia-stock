import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <mat-card class="w-full max-w-md p-8">
        <div class="text-center mb-6">
          <h1 class="text-2xl font-bold text-gray-900">🤖 EstoqueIA</h1>
          <p class="text-gray-600 mt-2">Entre com suas credenciais</p>
        </div>

        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
          <mat-form-field class="w-full">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="qualquer&#64;email.com">
            <mat-icon matSuffix>email</mat-icon>
          </mat-form-field>

          <mat-form-field class="w-full">
            <mat-label>Senha</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="senha">
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
            </button>
          </mat-form-field>

          <button 
            mat-raised-button 
            color="primary" 
            type="submit" 
            class="w-full"
            [disabled]="loginForm.invalid || loading">
            {{loading ? 'Entrando...' : 'Entrar'}}
          </button>
        </form>

        <!-- Informações para desenvolvimento -->
        <div class="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p class="text-sm text-blue-800 font-semibold mb-2">🚀 Modo Desenvolvimento</p>
          <div class="space-y-1 text-sm text-blue-700">
            <p>✅ <strong>Qualquer email</strong> e <strong>qualquer senha</strong> funcionam</p>
            <p>✅ Login apenas <strong>visual</strong> para facilitar testes</p>
            <p>✅ Acesso direto ao sistema sem validação</p>
          </div>
        </div>

        <!-- Credenciais sugeridas -->
        <div class="mt-4 p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-600 font-semibold mb-2">💡 Sugestões de credenciais:</p>
          <div class="space-y-1 text-sm text-gray-600">
            <p><strong>admin&#64;estoqueia.com</strong> / admin123</p>
            <p><strong>demo&#64;estoqueia.com</strong> / demo123</p>
            <p><strong>teste&#64;teste.com</strong> / 123</p>
          </div>
        </div>
      </mat-card>
    </div>
  `,
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['demo@estoqueia.com', [Validators.required, Validators.email]],
      senha: ['demo123', [Validators.required, Validators.minLength(1)]] // Mínimo 1 caractere
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.loading = true;
      
      // Simular delay de login
      setTimeout(() => {
        // Salvar dados fictícios no localStorage
        localStorage.setItem('token', 'fake-dev-token-' + Date.now());
        localStorage.setItem('user', JSON.stringify({
          email: this.loginForm.value.email,
          id: Math.floor(Math.random() * 1000),
          loginTime: new Date().toISOString(),
          modo: 'desenvolvimento'
        }));

        this.snackBar.open(`✅ Login realizado! Bem-vindo, ${this.loginForm.value.email}`, 'Fechar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });

        this.loading = false;
        this.router.navigate(['/dashboard']);
      }, 800); // Simular delay de 800ms
    } else {
      this.snackBar.open('⚠️ Preencha email e senha (qualquer valor funciona)', 'Fechar', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
}