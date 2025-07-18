import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { ApiService, Produto } from '../../services/api.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `
    <div class="p-6">
      <!-- Header com Status da API -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p class="text-gray-600 mt-1">Bem-vindo ao EstoqueIA!</p>
        </div>
        <div class="flex items-center gap-3">
          <!-- Status da API -->
          <div class="flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium" 
               [ngClass]="{
                 'bg-green-100 text-green-800': apiStatus === 'conectado',
                 'bg-red-100 text-red-800': apiStatus === 'desconectado',
                 'bg-yellow-100 text-yellow-800': apiStatus === 'conectando'
               }">
            <span>{{statusTexto}}</span>
          </div>
          
          <!-- Botão Reconectar (apenas se desconectado) -->
          <button *ngIf="apiStatus !== 'conectado'" 
                  mat-stroked-button 
                  (click)="tentarReconectar()"
                  [disabled]="apiStatus === 'conectando'">
            <mat-icon>wifi</mat-icon>
            {{apiStatus === 'conectando' ? 'Conectando...' : 'Reconectar'}}
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-12">
        <mat-spinner class="mx-auto"></mat-spinner>
        <p class="mt-4 text-gray-600">Carregando dados do sistema...</p>
      </div>
      
      <!-- Dashboard Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Card Produtos -->
        <mat-card class="p-6 hover:shadow-lg transition-shadow cursor-pointer" (click)="navegarPara('/produtos')">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Produtos</h3>
              <p class="text-3xl font-bold text-blue-600 mt-2">{{totalProdutos}}</p>
              <p class="text-sm text-gray-500 mt-1">Total cadastrados</p>
            </div>
            <mat-icon class="text-blue-500 text-4xl">inventory</mat-icon>
          </div>
          <button mat-raised-button color="primary" class="mt-4 w-full" (click)="navegarPara('/produtos'); $event.stopPropagation()">
            <mat-icon>manage_accounts</mat-icon>
            Gerenciar
          </button>
        </mat-card>

        <!-- Card Estoque -->
        <mat-card class="p-6 hover:shadow-lg transition-shadow cursor-pointer" (click)="navegarPara('/estoque')">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">Estoque</h3>
              <p class="text-3xl font-bold text-green-600 mt-2">{{estoquePercentual}}%</p>
              <p class="text-sm text-gray-500 mt-1">{{produtosEstoqueOk}} produtos OK</p>
            </div>
            <mat-icon class="text-green-500 text-4xl">storage</mat-icon>
          </div>
          <button mat-raised-button color="primary" class="mt-4 w-full" (click)="navegarPara('/estoque'); $event.stopPropagation()">
            <mat-icon>inventory_2</mat-icon>
            Controlar
          </button>
        </mat-card>

        <!-- Card IA Sugestões -->
        <mat-card class="p-6 hover:shadow-lg transition-shadow cursor-pointer" (click)="navegarPara('/estoque')">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">IA Sugestões</h3>
              <p class="text-3xl font-bold text-purple-600 mt-2">{{produtosEstoqueBaixo}}</p>
              <p class="text-sm text-gray-500 mt-1">Precisam reposição</p>
            </div>
            <mat-icon class="text-purple-500 text-4xl">psychology</mat-icon>
          </div>
          <button mat-raised-button color="primary" class="mt-4 w-full" (click)="navegarPara('/estoque'); $event.stopPropagation()">
            <mat-icon>auto_awesome</mat-icon>
            Ver Sugestões
          </button>
        </mat-card>
      </div>

      <!-- Cards de Status Detalhado -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <mat-card class="p-4 text-center">
          <h4 class="text-sm font-semibold text-gray-600">Estoque Crítico</h4>
          <p class="text-2xl font-bold text-red-600">{{produtosCriticos}}</p>
          <p class="text-xs text-gray-500">< 5 unidades</p>
        </mat-card>

        <mat-card class="p-4 text-center">
          <h4 class="text-sm font-semibold text-gray-600">Estoque Baixo</h4>
          <p class="text-2xl font-bold text-yellow-600">{{produtosBaixos}}</p>
          <p class="text-xs text-gray-500">< 10 unidades</p>
        </mat-card>

        <mat-card class="p-4 text-center">
          <h4 class="text-sm font-semibold text-gray-600">Valor Total</h4>
          <p class="text-2xl font-bold text-green-600">R$ {{valorTotalEstoque | number:'1.0-0'}}</p>
          <p class="text-xs text-gray-500">Em estoque</p>
        </mat-card>

        <mat-card class="p-4 text-center">
          <h4 class="text-sm font-semibold text-gray-600">Última Atualização</h4>
          <p class="text-lg font-bold text-blue-600">{{ultimaAtualizacao | date:'HH:mm'}}</p>
          <p class="text-xs text-gray-500">{{ultimaAtualizacao | date:'dd/MM'}}</p>
        </mat-card>
      </div>

      <!-- Aviso de Modo Offline -->
      <div *ngIf="!loading && apiStatus === 'desconectado'" class="mt-6">
        <mat-card class="bg-yellow-50 border-l-4 border-yellow-400">
          <mat-card-content class="p-4">
            <div class="flex items-center">
              <mat-icon class="text-yellow-600 mr-2">warning</mat-icon>
              <div>
                <h4 class="text-sm font-semibold text-yellow-800">Modo Offline Ativo</h4>
                <p class="text-sm text-yellow-700 mt-1">
                  Você está visualizando dados locais. As alterações serão salvas apenas localmente até a API ser reconectada.
                </p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <!-- Botão de Atualização -->
      <div *ngIf="!loading" class="mt-6 text-center">
        <button mat-stroked-button (click)="carregarDados()" [disabled]="loading">
          <mat-icon>refresh</mat-icon>
          Atualizar Dados
        </button>
      </div>
    </div>
  `,
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  loading = true;
  produtos: Produto[] = [];
  apiStatus = 'conectando'; // 'conectado', 'desconectado', 'conectando'
  
  // Estatísticas calculadas
  totalProdutos = 0;
  produtosEstoqueOk = 0;
  produtosEstoqueBaixo = 0;
  produtosCriticos = 0;
  produtosBaixos = 0;
  estoquePercentual = 0;
  valorTotalEstoque = 0;
  ultimaAtualizacao = new Date();

  constructor(
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.carregarDados();
  }

  carregarDados() {
    this.loading = true;
    this.apiService.listarProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
        this.calcularEstatisticas();
        this.loading = false;
        this.ultimaAtualizacao = new Date();
        
        // Definir status da API
        this.apiStatus = this.apiService.isApiDisponivel ? 'conectado' : 'desconectado';
        
        console.log('✅ Dashboard atualizado:', {
          totalProdutos: this.totalProdutos,
          estoqueBaixo: this.produtosEstoqueBaixo,
          valorTotal: this.valorTotalEstoque,
          apiStatus: this.apiStatus
        });
      },
      error: (error) => {
        console.error('❌ Erro ao carregar dados do dashboard:', error);
        this.loading = false;
        this.apiStatus = 'desconectado';
      }
    });
  }

  calcularEstatisticas() {
    this.totalProdutos = this.produtos.length;
    
    // Categorizar produtos por nível de estoque
    this.produtosCriticos = this.produtos.filter(p => p.quantidade < 5).length;
    this.produtosBaixos = this.produtos.filter(p => p.quantidade >= 5 && p.quantidade < 10).length;
    this.produtosEstoqueBaixo = this.produtosCriticos + this.produtosBaixos;
    this.produtosEstoqueOk = this.produtos.filter(p => p.quantidade >= 10).length;
    
    // Calcular percentual de produtos com estoque OK
    this.estoquePercentual = this.totalProdutos > 0 ? 
      Math.round((this.produtosEstoqueOk / this.totalProdutos) * 100) : 0;
    
    // Calcular valor total em estoque
    this.valorTotalEstoque = this.produtos.reduce((total, produto) => 
      total + (produto.preco * produto.quantidade), 0
    );
  }

  // 🔧 MÉTODO PARA TENTAR RECONECTAR
  tentarReconectar() {
    this.apiStatus = 'conectando';
    this.apiService.tentarReconectar();
    
    // Recarregar dados após tentativa de reconexão
    setTimeout(() => {
      this.carregarDados();
    }, 2000);
  }

  navegarPara(rota: string) {
    this.router.navigate([rota]);
  }

  // Getter para exibir status amigável
  get statusTexto(): string {
    switch(this.apiStatus) {
      case 'conectado': return '🟢 API Conectada';
      case 'desconectado': return '🔴 Modo Offline';
      case 'conectando': return '🟡 Reconectando...';
      default: return '⚪ Status Desconhecido';
    }
  }
}