import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService, Produto } from '../../services/api.service';

// 🔧 COMPONENTE DE MODAL PARA CRIAR/EDITAR PRODUTO
@Component({
  selector: 'app-produto-modal',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  template: `
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-4">
        {{produto?.id ? '✏️ Editar Produto' : '➕ Novo Produto'}}
      </h2>
      
      <form [formGroup]="produtoForm" (ngSubmit)="salvar()">
        <div class="grid grid-cols-1 gap-4">
          <mat-form-field>
            <mat-label>Nome do Produto</mat-label>
            <input matInput formControlName="nome" placeholder="Ex: Notebook Dell Inspiron">
            <mat-error *ngIf="produtoForm.get('nome')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field>
            <mat-label>Descrição</mat-label>
            <textarea matInput formControlName="descricao" rows="3" 
                      placeholder="Descrição detalhada do produto..."></textarea>
          </mat-form-field>

          <div class="grid grid-cols-2 gap-4">
            <mat-form-field>
              <mat-label>Preço</mat-label>
              <input matInput type="number" formControlName="preco" step="0.01" min="0" placeholder="0.00">
              <span matSuffix>R$</span>
              <mat-error *ngIf="produtoForm.get('preco')?.hasError('required')">
                Preço é obrigatório
              </mat-error>
              <mat-error *ngIf="produtoForm.get('preco')?.hasError('min')">
                Preço deve ser maior que zero
              </mat-error>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Quantidade</mat-label>
              <input matInput type="number" formControlName="quantidade" min="0" placeholder="0">
              <span matSuffix>un</span>
              <mat-error *ngIf="produtoForm.get('quantidade')?.hasError('required')">
                Quantidade é obrigatória
              </mat-error>
              <mat-error *ngIf="produtoForm.get('quantidade')?.hasError('min')">
                Quantidade não pode ser negativa
              </mat-error>
            </mat-form-field>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button type="button" mat-button (click)="cancelar()">
            <mat-icon>close</mat-icon>
            Cancelar
          </button>
          <button type="submit" mat-raised-button color="primary" 
                  [disabled]="!produtoForm.valid || salvando">
            <mat-icon>{{salvando ? 'hourglass_empty' : 'save'}}</mat-icon>
            {{salvando ? 'Salvando...' : 'Salvar'}}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProdutoModalComponent implements OnInit {
  produtoForm: FormGroup;
  produto?: Produto;
  salvando = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProdutoModalComponent>, // ✅ CORRIGIDO: Usar MatDialogRef
    private apiService: ApiService,
    private snackBar: MatSnackBar
  ) {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required]],
      descricao: [''],
      preco: [0, [Validators.required, Validators.min(0.01)]],
      quantidade: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.produto) {
      this.produtoForm.patchValue({
        nome: this.produto.nome,
        descricao: this.produto.descricao,
        preco: this.produto.preco,
        quantidade: this.produto.quantidade
      });
    }
  }

  salvar() {
    if (this.produtoForm.valid) {
      this.salvando = true;
      const dadosProduto = this.produtoForm.value;

      const operacao = this.produto?.id 
        ? this.apiService.atualizarProduto(this.produto.id, dadosProduto)
        : this.apiService.criarProduto(dadosProduto);

      operacao.subscribe({
        next: (produto) => {
          this.snackBar.open(
            `✅ Produto ${this.produto?.id ? 'atualizado' : 'criado'} com sucesso!`, 
            'Fechar', 
            { duration: 3000 }
          );
          this.dialogRef.close(produto);
        },
        error: (error) => {
          console.error('❌ Erro ao salvar produto:', error);
          this.snackBar.open('❌ Erro ao salvar produto', 'Fechar', { duration: 3000 });
          this.salvando = false;
        }
      });
    }
  }

  cancelar() {
    this.dialogRef.close();
  }
}

// 🔧 COMPONENTE PRINCIPAL ATUALIZADO
@Component({
  selector: 'app-produtos',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Produtos</h1>
          <p class="text-gray-600 mt-1">Gerencie seu catálogo de produtos</p>
        </div>
        <div class="flex gap-3">
          <button mat-button (click)="voltarDashboard()" class="mr-2">
            <mat-icon>arrow_back</mat-icon>
            Voltar
          </button>
          <!-- ✅ BOTÃO PARA CRIAR NOVO PRODUTO -->
          <button mat-raised-button color="accent" (click)="criarProduto()">
            <mat-icon>add</mat-icon>
            Novo Produto
          </button>
          <button mat-raised-button color="primary" (click)="carregarProdutos()">
            <mat-icon>refresh</mat-icon>
            Atualizar
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div *ngIf="loading" class="text-center py-8">
        <mat-spinner></mat-spinner>
        <p class="mt-4 text-gray-600">Carregando produtos...</p>
      </div>

      <!-- Stats Cards -->
      <div *ngIf="!loading" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <mat-card class="p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-700">Total</h3>
          <p class="text-2xl font-bold text-blue-600">{{produtos.length}}</p>
        </mat-card>
        <mat-card class="p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-700">Estoque Baixo</h3>
          <p class="text-2xl font-bold text-red-600">{{produtosEstoqueBaixo}}</p>
        </mat-card>
        <mat-card class="p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-700">Estoque OK</h3>
          <p class="text-2xl font-bold text-green-600">{{produtosEstoqueOk}}</p>
        </mat-card>
        <mat-card class="p-4 text-center">
          <h3 class="text-lg font-semibold text-gray-700">Valor Total</h3>
          <p class="text-2xl font-bold text-purple-600">R$ {{valorTotalEstoque | number:'1.0-0'}}</p>
        </mat-card>
      </div>

      <!-- Tabela de Produtos -->
      <mat-card *ngIf="!loading" class="overflow-hidden">
        <div class="overflow-x-auto">
          <table mat-table [dataSource]="produtosFiltrados" class="w-full">
            <!-- ID Column -->
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">ID</th>
              <td mat-cell *matCellDef="let produto" class="font-mono">#{{produto.id}}</td>
            </ng-container>

            <!-- Nome Column -->
            <ng-container matColumnDef="nome">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">Nome</th>
              <td mat-cell *matCellDef="let produto" class="font-medium">{{produto.nome}}</td>
            </ng-container>

            <!-- Descrição Column -->
            <ng-container matColumnDef="descricao">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">Descrição</th>
              <td mat-cell *matCellDef="let produto" class="text-gray-600 max-w-xs truncate">{{produto.descricao}}</td>
            </ng-container>

            <!-- Preço Column -->
            <ng-container matColumnDef="preco">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">Preço</th>
              <td mat-cell *matCellDef="let produto" class="font-mono font-semibold">R$ {{produto.preco | number:'1.2-2'}}</td>
            </ng-container>

            <!-- Quantidade Column -->
            <ng-container matColumnDef="quantidade">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">Estoque</th>
              <td mat-cell *matCellDef="let produto">
                <span [ngClass]="{
                  'bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm font-semibold': produto.quantidade < 10,
                  'bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-semibold': produto.quantidade >= 10 && produto.quantidade < 30,
                  'bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-semibold': produto.quantidade >= 30
                }">
                  {{produto.quantidade}} un
                </span>
              </td>
            </ng-container>

            <!-- Actions Column -->
            <ng-container matColumnDef="acoes">
              <th mat-header-cell *matHeaderCellDef class="font-semibold">Ações</th>
              <td mat-cell *matCellDef="let produto">
                <button mat-icon-button color="primary" (click)="editarProduto(produto); $event.stopPropagation()" matTooltip="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="accent" (click)="verEstoque(produto); $event.stopPropagation()" matTooltip="Ver Estoque">
                  <mat-icon>inventory</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="excluirProduto(produto); $event.stopPropagation()" matTooltip="Excluir">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
                class="hover:bg-gray-50 transition-colors cursor-pointer"
                (click)="verDetalhes(row)"></tr>
          </table>
        </div>

        <div *ngIf="produtosFiltrados.length === 0 && !loading" class="text-center py-12">
          <mat-icon class="text-gray-400 text-6xl mb-4">inventory_2</mat-icon>
          <p class="text-gray-500 text-lg">Nenhum produto encontrado</p>
          <p class="text-gray-400 text-sm mt-2 mb-4">Comece criando seu primeiro produto!</p>
          <button mat-raised-button color="primary" (click)="criarProduto()">
            <mat-icon>add</mat-icon>
            Criar Primeiro Produto
          </button>
        </div>
      </mat-card>
    </div>
  `,
  styleUrl: './produtos.component.scss'
})
export class ProdutosComponent implements OnInit {
  produtos: Produto[] = [];
  produtosFiltrados: Produto[] = [];
  displayedColumns: string[] = ['id', 'nome', 'descricao', 'preco', 'quantidade', 'acoes'];
  loading = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.carregarProdutos();
  }

  get produtosEstoqueBaixo(): number {
    return this.produtos.filter(p => p.quantidade < 10).length;
  }

  get produtosEstoqueOk(): number {
    return this.produtos.filter(p => p.quantidade >= 10).length;
  }

  get valorTotalEstoque(): number {
    return this.produtos.reduce((total, produto) => total + (produto.preco * produto.quantidade), 0);
  }

  carregarProdutos() {
    this.loading = true;
    this.apiService.listarProdutos().subscribe({
      next: (produtos) => {
        console.log('✅ Produtos carregados:', produtos);
        this.produtos = produtos;
        this.produtosFiltrados = [...this.produtos];
        this.loading = false;
        this.snackBar.open(`${produtos.length} produtos carregados com sucesso!`, 'Fechar', {
          duration: 3000
        });
      },
      error: (error) => {
        console.error('❌ Erro ao carregar produtos:', error);
        this.loading = false;
        this.snackBar.open('Erro ao carregar produtos. Verifique se o backend está rodando.', 'Fechar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  voltarDashboard() {
    this.router.navigate(['/dashboard']);
  }

  // ✅ IMPLEMENTAR CRIAÇÃO DE PRODUTO
  criarProduto() {
    const dialogRef = this.dialog.open(ProdutoModalComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.componentInstance.produto = undefined; // Novo produto

    dialogRef.afterClosed().subscribe(produto => {
      if (produto) {
        this.carregarProdutos(); // Recarregar lista
      }
    });
  }

  // ✅ IMPLEMENTAR EDIÇÃO REAL
  editarProduto(produto: Produto) {
    const dialogRef = this.dialog.open(ProdutoModalComponent, {
      width: '600px',
      disableClose: false
    });

    dialogRef.componentInstance.produto = produto; // Produto existente

    dialogRef.afterClosed().subscribe(produtoAtualizado => {
      if (produtoAtualizado) {
        this.carregarProdutos(); // Recarregar lista
      }
    });
  }

  verEstoque(produto: Produto) {
    this.router.navigate(['/estoque']);
  }

  verDetalhes(produto: Produto) {
    this.snackBar.open(
      `Produto: ${produto.nome} | Estoque: ${produto.quantidade} un | Valor: R$ ${produto.preco}`, 
      'Fechar', 
      { duration: 4000 }
    );
  }

  excluirProduto(produto: Produto) {
    if (confirm(`⚠️ Tem certeza que deseja excluir "${produto.nome}"?`)) {
      this.apiService.deletarProduto(produto.id!).subscribe({
        next: () => {
          this.snackBar.open('Produto excluído com sucesso!', 'Fechar', {
            duration: 3000
          });
          this.carregarProdutos(); // Recarregar lista
        },
        error: (error) => {
          console.error('❌ Erro ao excluir produto:', error);
          this.snackBar.open('Erro ao excluir produto.', 'Fechar', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}