import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  template: `
    <div class="p-6">
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p class="text-gray-600 mt-2">Bem-vindo ao EstoqueIA!</p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card Produtos -->
        <mat-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Produtos</h3>
              <p class="text-3xl font-bold text-blue-600 mt-2">157</p>
            </div>
            <mat-icon class="text-blue-500 text-4xl">inventory</mat-icon>
          </div>
          <button mat-raised-button color="primary" class="mt-4 w-full">
            Gerenciar
          </button>
        </mat-card>

        <!-- Card Estoque -->
        <mat-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Estoque</h3>
              <p class="text-3xl font-bold text-green-600 mt-2">89%</p>
            </div>
            <mat-icon class="text-green-500 text-4xl">storage</mat-icon>
          </div>
          <button mat-raised-button color="primary" class="mt-4 w-full">
            Controlar
          </button>
        </mat-card>

        <!-- Card IA -->
        <mat-card class="p-6">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">IA Sugestões</h3>
              <p class="text-3xl font-bold text-purple-600 mt-2">12</p>
            </div>
            <mat-icon class="text-purple-500 text-4xl">psychology</mat-icon>
          </div>
          <button mat-raised-button color="primary" class="mt-4 w-full">
            Ver Sugestões
          </button>
        </mat-card>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent { }