import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Produto } from '../../services/api.service';

// 🔧 INTERFACES LOCAIS PARA SUGESTÕES
export interface SugestaoIA {
  sugestaoReposicao: number;
  observacao: string;
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface SugestaoCompleta {
  produto: Produto;
  sugestao: SugestaoIA;
  confianca: number;
  prioridade: 'ALTA' | 'MEDIA' | 'BAIXA';
}

export interface NovaMovimentacao {
  produtoId?: number;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
}

export interface Movimentacao {
  id: number;
  data: Date;
  produtoNome: string;
  tipo: 'ENTRADA' | 'SAIDA';
  quantidade: number;
  usuario: string;
}

@Component({
  selector: 'app-estoque',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    FormsModule
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Controle de Estoque</h1>
          <p class="text-gray-600 mt-1">Gerencie movimentações e sugestões da IA</p>
        </div>
        <button mat-button (click)="voltarDashboard()">
          <mat-icon>arrow_back</mat-icon>
          Voltar
        </button>
      </div>

      <!-- Tabs -->
      <mat-tab-group class="mb-6">
        <!-- Tab Movimentações -->
        <mat-tab label="📦 Movimentações">
          <!-- Formulário de Nova Movimentação -->
          <mat-card class="mt-4 mb-6">
            <mat-card-header>
              <mat-card-title>Nova Movimentação</mat-card-title>
            </mat-card-header>
            <mat-card-content class="mt-4">
              <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                <mat-form-field>
                  <mat-label>Produto</mat-label>
                  <mat-select [(value)]="novaMovimentacao.produtoId">
                    <mat-option *ngFor="let produto of produtos" [value]="produto.id">
                      {{produto.nome}} ({{produto.quantidade}} un)
                    </mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field>
                  <mat-label>Tipo</mat-label>
                  <mat-select [(value)]="novaMovimentacao.tipo">
                    <mat-option value="ENTRADA">⬇️ Entrada</mat-option>
                    <mat-option value="SAIDA">⬆️ Saída</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field>
                  <mat-label>Quantidade</mat-label>
                  <input matInput type="number" [(ngModel)]="novaMovimentacao.quantidade" min="1">
                </mat-form-field>

                <div class="flex items-end">
                  <button mat-raised-button color="primary" (click)="registrarMovimentacao()" class="w-full" [disabled]="loadingMovimentacao">
                    <mat-icon>{{loadingMovimentacao ? 'hourglass_empty' : 'add'}}</mat-icon>
                    {{loadingMovimentacao ? 'Processando...' : 'Registrar'}}
                  </button>
                </div>
              </div>
            </mat-card-content>
          </mat-card>

          <!-- Histórico de Movimentações -->
          <mat-card>
            <mat-card-header>
              <mat-card-title>Histórico de Movimentações</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="movimentacoes.length === 0" class="text-center py-8">
                <mat-icon class="text-gray-400 text-4xl mb-2">history</mat-icon>
                <p class="text-gray-500">Nenhuma movimentação registrada</p>
              </div>
              
              <table *ngIf="movimentacoes.length > 0" mat-table [dataSource]="movimentacoes" class="w-full">
                <ng-container matColumnDef="data">
                  <th mat-header-cell *matHeaderCellDef>Data</th>
                  <td mat-cell *matCellDef="let mov">{{mov.data | date:'dd/MM/yyyy HH:mm'}}</td>
                </ng-container>

                <ng-container matColumnDef="produto">
                  <th mat-header-cell *matHeaderCellDef>Produto</th>
                  <td mat-cell *matCellDef="let mov">{{mov.produtoNome}}</td>
                </ng-container>

                <ng-container matColumnDef="tipo">
                  <th mat-header-cell *matHeaderCellDef>Tipo</th>
                  <td mat-cell *matCellDef="let mov">
                    <span [ngClass]="{
                      'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm': mov.tipo === 'ENTRADA',
                      'bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm': mov.tipo === 'SAIDA'
                    }">
                      {{mov.tipo === 'ENTRADA' ? '⬇️ Entrada' : '⬆️ Saída'}}
                    </span>
                  </td>
                </ng-container>

                <ng-container matColumnDef="quantidade">
                  <th mat-header-cell *matHeaderCellDef>Quantidade</th>
                  <td mat-cell *matCellDef="let mov" class="font-semibold">{{mov.quantidade}} un</td>
                </ng-container>

                <ng-container matColumnDef="usuario">
                  <th mat-header-cell *matHeaderCellDef>Usuário</th>
                  <td mat-cell *matCellDef="let mov" class="text-gray-600">{{mov.usuario}}</td>
                </ng-container>

                <tr mat-header-row *matHeaderRowDef="colunaMovimentacoes"></tr>
                <tr mat-row *matRowDef="let row; columns: colunaMovimentacoes;" class="hover:bg-gray-50"></tr>
              </table>
            </mat-card-content>
          </mat-card>
        </mat-tab>

        <!-- Tab Sugestões IA -->
        <mat-tab label="🤖 Sugestões IA">
          <div class="mt-4">
            <!-- Status da IA -->
            <mat-card class="mb-6 bg-gradient-to-r from-purple-50 to-blue-50">
              <mat-card-content class="p-6">
                <div class="flex items-center justify-between">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900">Inteligência Artificial Ativa</h3>
                    <p class="text-gray-600 mt-1">Analisando padrões de consumo e sugerindo reposições</p>
                  </div>
                  <div class="text-center">
                    <button mat-raised-button color="accent" (click)="gerarSugestoesIA()" [disabled]="loadingSugestoes">
                      <mat-icon>{{loadingSugestoes ? 'hourglass_empty' : 'psychology'}}</mat-icon>
                      {{loadingSugestoes ? 'Gerando...' : 'Gerar Sugestões'}}
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">{{sugestoesIA.length}}</p>
                    <p class="text-sm text-gray-600">Sugestões Ativas</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-red-600">{{sugestoesAlta}}</p>
                    <p class="text-sm text-gray-600">Prioridade Alta</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">95%</p>
                    <p class="text-sm text-gray-600">Precisão</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            <!-- Loading Sugestões -->
            <div *ngIf="loadingSugestoes" class="text-center py-8">
              <mat-spinner class="mx-auto"></mat-spinner>
              <p class="mt-4 text-gray-600">Consultando IA para sugestões inteligentes...</p>
            </div>

            <!-- Lista de Sugestões -->
            <div *ngIf="!loadingSugestoes" class="grid gap-4">
              <mat-card *ngFor="let sugestao of sugestoesIA" class="overflow-hidden">
                <mat-card-content class="p-6">
                  <div class="flex items-start justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold">{{sugestao.produto.nome}}</h3>
                        <span [ngClass]="{
                          'bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-semibold': sugestao.prioridade === 'ALTA',
                          'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold': sugestao.prioridade === 'MEDIA',
                          'bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold': sugestao.prioridade === 'BAIXA'
                        }">
                          {{sugestao.prioridade}}
                        </span>
                      </div>
                      
                      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p class="text-sm text-gray-600">Estoque Atual</p>
                          <p class="text-xl font-bold text-blue-600">{{sugestao.produto.quantidade}} un</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Sugestão de Reposição</p>
                          <p class="text-xl font-bold text-green-600">+{{sugestao.sugestao.sugestaoReposicao}} un</p>
                        </div>
                        <div>
                          <p class="text-sm text-gray-600">Confiança da IA</p>
                          <p class="text-xl font-bold text-purple-600">{{(sugestao.confianca * 100) | number:'1.0-0'}}%</p>
                        </div>
                      </div>

                      <div class="bg-gray-50 p-3 rounded-lg mb-4">
                        <p class="text-sm text-gray-700"><strong>Observação da IA:</strong></p>
                        <p class="text-sm text-gray-600 mt-1">{{sugestao.sugestao.observacao}}</p>
                      </div>
                    </div>
                  </div>

                  <div class="flex gap-2">
                    <button mat-raised-button color="primary" (click)="aplicarSugestao(sugestao)">
                      <mat-icon>check</mat-icon>
                      Aplicar Sugestão
                    </button>
                    <button mat-stroked-button (click)="ignorarSugestao(sugestao)">
                      <mat-icon>close</mat-icon>
                      Ignorar
                    </button>
                  </div>
                </mat-card-content>
              </mat-card>

              <div *ngIf="sugestoesIA.length === 0 && !loadingSugestoes" class="text-center py-12">
                <mat-icon class="text-gray-400 text-6xl mb-4">psychology</mat-icon>
                <p class="text-gray-500 text-lg">Nenhuma sugestão disponível</p>
                <p class="text-gray-400 text-sm mt-2">Clique em "Gerar Sugestões" para consultar a IA</p>
              </div>
            </div>
          </div>
        </mat-tab>
      </mat-tab-group>
    </div>
  `,
  styleUrl: './estoque.component.scss'
})
export class EstoqueComponent implements OnInit {
  produtos: Produto[] = [];
  movimentacoes: Movimentacao[] = [];
  sugestoesIA: SugestaoCompleta[] = [];
  
  loadingMovimentacao = false;
  loadingSugestoes = false;
  
  novaMovimentacao: NovaMovimentacao = {
    tipo: 'ENTRADA',
    quantidade: 1
  };
  
  colunaMovimentacoes: string[] = ['data', 'produto', 'tipo', 'quantidade', 'usuario'];
  
  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.carregarProdutos();
    this.carregarMovimentacoes();
  }

  carregarProdutos() {
    this.apiService.listarProdutos().subscribe({
      next: (produtos) => {
        this.produtos = produtos;
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
        this.snackBar.open('❌ Erro ao carregar produtos', 'Fechar', { duration: 3000 });
      }
    });
  }

  carregarMovimentacoes() {
    // Simular movimentações locais
    this.movimentacoes = [
      {
        id: 1,
        data: new Date(),
        produtoNome: 'Notebook Dell',
        tipo: 'ENTRADA',
        quantidade: 5,
        usuario: 'Sistema'
      },
      {
        id: 2,
        data: new Date(Date.now() - 3600000),
        produtoNome: 'Mouse Logitech',
        tipo: 'SAIDA',
        quantidade: 2,
        usuario: 'Sistema'
      }
    ];
  }

  registrarMovimentacao() {
    if (!this.novaMovimentacao.produtoId || !this.novaMovimentacao.quantidade) {
      this.snackBar.open('⚠️ Preencha todos os campos', 'Fechar', { duration: 3000 });
      return;
    }

    this.loadingMovimentacao = true;
    
    const operacao = this.novaMovimentacao.tipo === 'ENTRADA' 
      ? this.apiService.entradaEstoque(this.novaMovimentacao.produtoId, this.novaMovimentacao.quantidade)
      : this.apiService.saidaEstoque(this.novaMovimentacao.produtoId, this.novaMovimentacao.quantidade);

    operacao.subscribe({
      next: (response) => {
        this.snackBar.open('✅ Movimentação registrada com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarProdutos(); // Atualizar lista de produtos
        this.carregarMovimentacoes(); // Atualizar histórico
        this.novaMovimentacao = { tipo: 'ENTRADA', quantidade: 1 }; // Reset form
        this.loadingMovimentacao = false;
      },
      error: (error) => {
        console.error('❌ Erro ao registrar movimentação:', error);
        this.snackBar.open('❌ Erro ao registrar movimentação', 'Fechar', { duration: 3000 });
        this.loadingMovimentacao = false;
      }
    });
  }

  gerarSugestoesIA() {
    this.loadingSugestoes = true;
    
    // Simular geração de sugestões baseada nos produtos com baixo estoque
    setTimeout(() => {
      this.sugestoesIA = this.produtos
        .filter(produto => produto.quantidade < 10)
        .map(produto => {
          const prioridade = produto.quantidade < 5 ? 'ALTA' : 
                           produto.quantidade < 8 ? 'MEDIA' : 'BAIXA';
          
          return {
            produto: produto,
            sugestao: {
              sugestaoReposicao: Math.max(20 - produto.quantidade, 5),
              observacao: `Com base no histórico de vendas, recomendamos repor ${Math.max(20 - produto.quantidade, 5)} unidades para manter o estoque ideal.`,
              prioridade: prioridade
            },
            confianca: 0.85 + (Math.random() * 0.1),
            prioridade: prioridade
          } as SugestaoCompleta;
        });
      
      this.loadingSugestoes = false;
      this.snackBar.open(`🤖 ${this.sugestoesIA.length} sugestões geradas pela IA!`, 'Fechar', { duration: 3000 });
    }, 2000);
  }

  aplicarSugestao(sugestao: SugestaoCompleta) {
    if (confirm(`🤖 Aplicar sugestão da IA?\n\nProduto: ${sugestao.produto.nome}\nQuantidade: +${sugestao.sugestao.sugestaoReposicao} unidades\nConfiança: ${(sugestao.confianca * 100).toFixed(0)}%`)) {
      
      this.apiService.entradaEstoque(sugestao.produto.id!, sugestao.sugestao.sugestaoReposicao).subscribe({
        next: (response) => {
          this.snackBar.open('✅ Sugestão da IA aplicada com sucesso!', 'Fechar', { duration: 3000 });
          this.carregarProdutos();
          this.sugestoesIA = this.sugestoesIA.filter(s => s.produto.id !== sugestao.produto.id);
        },
        error: (error) => {
          console.error('❌ Erro ao aplicar sugestão:', error);
          this.snackBar.open('❌ Erro ao aplicar sugestão da IA', 'Fechar', { duration: 3000 });
        }
      });
    }
  }

  ignorarSugestao(sugestao: SugestaoCompleta) {
    if (confirm(`⚠️ Ignorar sugestão da IA para ${sugestao.produto.nome}?`)) {
      this.sugestoesIA = this.sugestoesIA.filter(s => s.produto.id !== sugestao.produto.id);
      this.snackBar.open('🚫 Sugestão ignorada', 'Fechar', { duration: 2000 });
    }
  }

  get sugestoesAlta(): number {
    return this.sugestoesIA.filter(s => s.prioridade === 'ALTA').length;
  }

  voltarDashboard() {
    this.router.navigate(['/dashboard']);
  }
}