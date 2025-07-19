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
import { forkJoin, Observable, map, of } from 'rxjs'; // ✅ ADICIONAR
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
              <div class="flex justify-between items-center w-full">
                <mat-card-title>Histórico de Movimentações</mat-card-title>
                <div class="flex gap-2">
                  <span class="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    Total: {{totalMovimentacoes}}
                  </span>
                  <span class="text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                    Entradas hoje: {{entradasHoje}}
                  </span>
                  <span class="text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                    Saídas hoje: {{saidasHoje}}
                  </span>
                  <button mat-icon-button (click)="limparHistorico()" matTooltip="Limpar Histórico">
                    <mat-icon>delete_sweep</mat-icon>
                  </button>
                </div>
              </div>
            </mat-card-header>
            <mat-card-content>
              <div *ngIf="movimentacoes.length === 0" class="text-center py-8">
                <mat-icon class="text-gray-400 text-4xl mb-2">history</mat-icon>
                <p class="text-gray-500">Nenhuma movimentação registrada</p>
                <p class="text-gray-400 text-sm">Registre uma movimentação para ver o histórico</p>
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
                    <h3 class="text-xl font-bold text-gray-900">
                      {{apiService.isApiDisponivel ? '🧠 IA Neural Ativa' : '🔄 Modo Fallback Ativo'}}
                    </h3>
                    <p class="text-gray-600 mt-1">
                      {{apiService.isApiDisponivel ? 
                        'Utilizando modelo treinado para sugestões precisas' : 
                        'Usando algoritmo local - API temporariamente indisponível'
                      }}
                    </p>
                  </div>
                  <div class="text-center">
                    <button mat-raised-button color="accent" (click)="gerarSugestoesIA()" [disabled]="loadingSugestoes">
                      <mat-icon>{{loadingSugestoes ? 'hourglass_empty' : 'psychology'}}</mat-icon>
                      {{loadingSugestoes ? 'Gerando...' : 'Gerar Sugestões'}}
                    </button>
                  </div>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                  <div class="text-center">
                    <p class="text-2xl font-bold text-purple-600">{{sugestoesIA.length}}</p>
                    <p class="text-sm text-gray-600">Sugestões Ativas</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-red-600">{{sugestoesAlta}}</p>
                    <p class="text-sm text-gray-600">Prioridade Alta</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold text-green-600">
                      {{apiService.isApiDisponivel ? '95%' : '80%'}}
                    </p>
                    <p class="text-sm text-gray-600">Precisão</p>
                  </div>
                  <div class="text-center">
                    <p class="text-2xl font-bold" [ngClass]="apiService.isApiDisponivel ? 'text-green-600' : 'text-orange-600'">
                      {{apiService.isApiDisponivel ? '🟢 Online' : '🟡 Local'}}
                    </p>
                    <p class="text-sm text-gray-600">Status IA</p>
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
  
  // ✅ CONTADOR PARA IDs ÚNICOS
  private proximoIdMovimentacao = 3;
  
  novaMovimentacao: NovaMovimentacao = {
    tipo: 'ENTRADA',
    quantidade: 1
  };
  
  colunaMovimentacoes: string[] = ['data', 'produto', 'tipo', 'quantidade', 'usuario'];
  
  constructor(
    private router: Router,
    public apiService: ApiService, // ✅ MUDANÇA: de private para public
    private snackBar: MatSnackBar
  ) {
    // ✅ CARREGAR HISTÓRICO DO LOCALSTORAGE
    this.carregarHistoricoLocal();
  }

  ngOnInit() {
    this.carregarProdutos();
  }

  // ✅ MÉTODOS PARA GERENCIAR HISTÓRICO LOCAL
  private carregarHistoricoLocal() {
    const historicoSalvo = localStorage.getItem('historico_movimentacoes');
    if (historicoSalvo) {
      this.movimentacoes = JSON.parse(historicoSalvo).map((mov: any) => ({
        ...mov,
        data: new Date(mov.data) // Converter string para Date
      }));
      // Atualizar contador de ID
      if (this.movimentacoes.length > 0) {
        this.proximoIdMovimentacao = Math.max(...this.movimentacoes.map(m => m.id)) + 1;
      }
    } else {
      // ✅ HISTÓRICO INICIAL MAIS REALISTA
      this.movimentacoes = [
        {
          id: 1,
          data: new Date(Date.now() - 86400000), // 1 dia atrás
          produtoNome: 'Notebook Dell Inspiron 15',
          tipo: 'ENTRADA',
          quantidade: 10,
          usuario: 'Admin'
        },
        {
          id: 2,
          data: new Date(Date.now() - 3600000), // 1 hora atrás
          produtoNome: 'Mouse Logitech MX Master',
          tipo: 'SAIDA',
          quantidade: 3,
          usuario: 'Vendas'
        }
      ];
      this.salvarHistoricoLocal();
    }
  }

  private salvarHistoricoLocal() {
    localStorage.setItem('historico_movimentacoes', JSON.stringify(this.movimentacoes));
  }

  // ✅ MÉTODO PARA ADICIONAR MOVIMENTAÇÃO AO HISTÓRICO
  private adicionarMovimentacaoHistorico(produtoNome: string, tipo: 'ENTRADA' | 'SAIDA', quantidade: number) {
    const novaMovimentacao: Movimentacao = {
      id: this.proximoIdMovimentacao++,
      data: new Date(),
      produtoNome: produtoNome,
      tipo: tipo,
      quantidade: quantidade,
      usuario: 'Sistema'
    };

    // Adicionar no início da lista (mais recente primeiro)
    this.movimentacoes.unshift(novaMovimentacao);
    
    // Manter apenas as últimas 50 movimentações
    if (this.movimentacoes.length > 50) {
      this.movimentacoes = this.movimentacoes.slice(0, 50);
    }

    // Salvar no localStorage
    this.salvarHistoricoLocal();

    console.log('✅ Movimentação adicionada ao histórico:', novaMovimentacao);
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

  // ✅ MÉTODO REGISTRAR MOVIMENTAÇÃO CORRIGIDO
  registrarMovimentacao() {
    if (!this.novaMovimentacao.produtoId || !this.novaMovimentacao.quantidade) {
      this.snackBar.open('⚠️ Preencha todos os campos', 'Fechar', { duration: 3000 });
      return;
    }

    // Encontrar o produto para pegar o nome
    const produto = this.produtos.find(p => p.id === this.novaMovimentacao.produtoId);
    if (!produto) {
      this.snackBar.open('❌ Produto não encontrado', 'Fechar', { duration: 3000 });
      return;
    }

    this.loadingMovimentacao = true;
    
    const operacao = this.novaMovimentacao.tipo === 'ENTRADA' 
      ? this.apiService.entradaEstoque(this.novaMovimentacao.produtoId, this.novaMovimentacao.quantidade)
      : this.apiService.saidaEstoque(this.novaMovimentacao.produtoId, this.novaMovimentacao.quantidade);

    operacao.subscribe({
      next: (response) => {
        // ✅ ADICIONAR AO HISTÓRICO LOCAL
        this.adicionarMovimentacaoHistorico(
          produto.nome,
          this.novaMovimentacao.tipo,
          this.novaMovimentacao.quantidade
        );

        this.snackBar.open('✅ Movimentação registrada com sucesso!', 'Fechar', { duration: 3000 });
        this.carregarProdutos(); // Atualizar lista de produtos
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

  // ✅ IMPLEMENTAR IA REAL COM FALLBACK
  gerarSugestoesIA() {
    this.loadingSugestoes = true;
    console.log('🤖 Iniciando geração de sugestões com IA real...');
    
    // Filtrar produtos que precisam de reposição (estoque baixo)
    const produtosParaIA = this.produtos.filter(produto => produto.quantidade < 15);
    
    if (produtosParaIA.length === 0) {
      this.snackBar.open('✅ Todos os produtos têm estoque adequado!', 'Fechar', { duration: 3000 });
      this.loadingSugestoes = false;
      this.sugestoesIA = [];
      return;
    }

    console.log(`🎯 ${produtosParaIA.length} produtos com estoque baixo encontrados`);

    // ✅ CONSULTAR IA REAL PARA CADA PRODUTO
    const consultasIA: Observable<SugestaoCompleta>[] = produtosParaIA.map(produto => {
      // Simular parâmetros realistas baseados no produto
      const mediaVendasDiarias = this.calcularMediaVendas(produto);
      const diasParaCompra = 7; // Padrão: 1 semana

      return this.apiService.obterSugestaoIA(produto.id!, mediaVendasDiarias, diasParaCompra).pipe(
        map(sugestaoIA => {
          console.log(`✅ IA respondeu para ${produto.nome}:`, sugestaoIA);
          
          return {
            produto: produto,
            sugestao: {
              sugestaoReposicao: sugestaoIA.sugestaoReposicao,
              observacao: sugestaoIA.observacao,
              prioridade: sugestaoIA.prioridade || this.determinarPrioridade(produto.quantidade)
            },
            confianca: this.apiService.isApiDisponivel ? 0.95 : 0.80, // IA real = 95%, fallback = 80%
            prioridade: sugestaoIA.prioridade || this.determinarPrioridade(produto.quantidade)
          } as SugestaoCompleta;
        })
      );
    });

    // ✅ EXECUTAR TODAS AS CONSULTAS EM PARALELO
    forkJoin(consultasIA).subscribe({
      next: (resultados) => {
        this.sugestoesIA = resultados;
        this.loadingSugestoes = false;
        
        const tipoIA = this.apiService.isApiDisponivel ? 'IA Neural' : 'Algoritmo Local';
        this.snackBar.open(
          `🤖 ${this.sugestoesIA.length} sugestões geradas com ${tipoIA}!`, 
          'Fechar', 
          { duration: 4000 }
        );
        
        console.log('🎉 Sugestões finais:', this.sugestoesIA);
      },
      error: (error) => {
        console.error('❌ Erro crítico ao gerar sugestões:', error);
        this.loadingSugestoes = false;
        this.snackBar.open('❌ Erro ao consultar IA. Tente novamente.', 'Fechar', { duration: 3000 });
      }
    });
  }

  // ✅ CALCULAR MÉDIA DE VENDAS SIMULADA (baseada no estoque atual)
  private calcularMediaVendas(produto: Produto): number {
    // Simular vendas baseado no tipo de produto e estoque atual
    if (produto.quantidade < 5) return 4.5; // Produto com alta rotatividade
    if (produto.quantidade < 10) return 3.2;
    if (produto.quantidade < 15) return 2.1;
    return 1.5; // Produto com baixa rotatividade
  }

  // ✅ DETERMINAR PRIORIDADE BASEADA NO ESTOQUE
  private determinarPrioridade(quantidade: number): 'ALTA' | 'MEDIA' | 'BAIXA' {
    if (quantidade < 5) return 'ALTA';   // Crítico
    if (quantidade < 10) return 'MEDIA'; // Moderado
    return 'BAIXA';                      // Baixo
  }

  // ✅ MÉTODO PARA APLICAR SUGESTÃO CORRIGIDO
  aplicarSugestao(sugestao: SugestaoCompleta) {
    const tipoIA = this.apiService.isApiDisponivel ? 'IA Neural' : 'Algoritmo Local';
    const confiancaTexto = `${(sugestao.confianca * 100).toFixed(0)}%`;
    
    if (confirm(`🤖 Aplicar sugestão da ${tipoIA}?\n\nProduto: ${sugestao.produto.nome}\nQuantidade: +${sugestao.sugestao.sugestaoReposicao} unidades\nConfiança: ${confiancaTexto}\nPrioridade: ${sugestao.prioridade}`)) {
      
      this.apiService.entradaEstoque(sugestao.produto.id!, sugestao.sugestao.sugestaoReposicao).subscribe({
        next: (response) => {
          // ✅ ADICIONAR AO HISTÓRICO QUANDO IA É APLICADA
          this.adicionarMovimentacaoHistorico(
            sugestao.produto.nome,
            'ENTRADA',
            sugestao.sugestao.sugestaoReposicao
          );

          this.snackBar.open(`✅ Sugestão da ${tipoIA} aplicada com sucesso!`, 'Fechar', { duration: 3000 });
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

  // ✅ MÉTODO PARA LIMPAR HISTÓRICO
  limparHistorico() {
    if (confirm('⚠️ Tem certeza que deseja limpar todo o histórico de movimentações?')) {
      this.movimentacoes = [];
      localStorage.removeItem('historico_movimentacoes');
      this.proximoIdMovimentacao = 1;
      this.snackBar.open('🗑️ Histórico de movimentações limpo', 'Fechar', { duration: 3000 });
    }
  }

  // ✅ GETTER PARA ESTATÍSTICAS DO HISTÓRICO
  get totalMovimentacoes(): number {
    return this.movimentacoes.length;
  }

  get entradasHoje(): number {
    const hoje = new Date();
    return this.movimentacoes.filter(m => 
      m.tipo === 'ENTRADA' && 
      m.data.toDateString() === hoje.toDateString()
    ).length;
  }

  get saidasHoje(): number {
    const hoje = new Date();
    return this.movimentacoes.filter(m => 
      m.tipo === 'SAIDA' && 
      m.data.toDateString() === hoje.toDateString()
    ).length;
  }

  // (Removed duplicate gerarSugestoesIA implementation)

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