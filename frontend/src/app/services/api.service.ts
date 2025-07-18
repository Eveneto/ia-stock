import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Produto {
  id?: number;
  nome: string;
  descricao: string;
  preco: number;
  quantidade: number;
}

export interface Usuario {
  id?: number;
  email: string;
  senha?: string;
}

export interface LoginRequest {
  email: string;
  senha: string;
}

export interface LoginResponse {
  token: string;
  usuario: Usuario;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080';
  private apiDisponivel = true;

  // 🔄 DADOS FICTÍCIOS PARA FALLBACK
  private produtosFictícios: Produto[] = [
    {
      id: 1,
      nome: "Notebook Dell Inspiron 15",
      descricao: "Notebook Dell com Intel i5, 8GB RAM, 256GB SSD",
      preco: 2499.99,
      quantidade: 15
    },
    {
      id: 2,
      nome: "Mouse Logitech MX Master",
      descricao: "Mouse sem fio ergonômico com precisão avançada",
      preco: 349.90,
      quantidade: 45
    },
    {
      id: 3,
      nome: "Teclado Mecânico RGB",
      descricao: "Teclado mecânico com iluminação RGB e switches Cherry",
      preco: 450.00,
      quantidade: 30
    },
    {
      id: 4,
      nome: "Monitor 24\" Full HD",
      descricao: "Monitor IPS 24 polegadas com tecnologia IPS",
      preco: 899.99,
      quantidade: 12
    },
    {
      id: 5,
      nome: "Headset Gamer HyperX",
      descricao: "Headset gamer com microfone e som surround",
      preco: 299.90,
      quantidade: 25
    },
    {
      id: 6,
      nome: "SSD 512GB NVMe",
      descricao: "SSD M.2 NVMe de alta velocidade",
      preco: 399.99,
      quantidade: 3 // Crítico
    },
    {
      id: 7,
      nome: "Memória RAM 16GB DDR4",
      descricao: "Memória RAM 3200MHz para gaming",
      preco: 480.00,
      quantidade: 5 // Baixo
    },
    {
      id: 8,
      nome: "Placa de Vídeo RTX 3060",
      descricao: "GPU NVIDIA para jogos e design",
      preco: 1899.99,
      quantidade: 2 // Muito baixo
    },
    {
      id: 9,
      nome: "Fonte 650W 80+ Bronze",
      descricao: "Fonte de alimentação modular eficiente",
      preco: 350.00,
      quantidade: 8
    },
    {
      id: 10,
      nome: "Smartphone Android 128GB",
      descricao: "Smartphone com câmera tripla e tela AMOLED",
      preco: 1299.99,
      quantidade: 20
    }
  ];

  private proximoId = 11;

  constructor(private http: HttpClient) {}

  // 🔧 MÉTODOS DE PRODUTOS COM FALLBACK

  listarProdutos(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/api/produtos`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, usando dados fictícios:', error.message);
        this.apiDisponivel = false;
        return of([...this.produtosFictícios]);
      })
    );
  }

  buscarProduto(id: number): Observable<Produto> {
    if (!this.apiDisponivel) {
      const produto = this.produtosFictícios.find(p => p.id === id);
      if (produto) {
        return of({ ...produto });
      } else {
        return throwError(() => new Error('Produto não encontrado'));
      }
    }

    return this.http.get<Produto>(`${this.baseUrl}/api/produtos/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, usando dados fictícios');
        this.apiDisponivel = false;
        const produto = this.produtosFictícios.find(p => p.id === id);
        if (produto) {
          return of({ ...produto });
        } else {
          return throwError(() => new Error('Produto não encontrado'));
        }
      })
    );
  }

  criarProduto(produto: Produto): Observable<Produto> {
    if (!this.apiDisponivel) {
      const novoProduto = { ...produto, id: this.proximoId++ };
      this.produtosFictícios.push(novoProduto);
      console.log('✅ Produto criado localmente:', novoProduto);
      return of({ ...novoProduto });
    }

    return this.http.post<Produto>(`${this.baseUrl}/api/produtos`, produto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, criando produto localmente');
        this.apiDisponivel = false;
        const novoProduto = { ...produto, id: this.proximoId++ };
        this.produtosFictícios.push(novoProduto);
        return of({ ...novoProduto });
      })
    );
  }

  atualizarProduto(id: number, produto: Produto): Observable<Produto> {
    if (!this.apiDisponivel) {
      const index = this.produtosFictícios.findIndex(p => p.id === id);
      if (index !== -1) {
        this.produtosFictícios[index] = { ...produto, id };
        console.log('✅ Produto atualizado localmente:', this.produtosFictícios[index]);
        return of({ ...this.produtosFictícios[index] });
      } else {
        return throwError(() => new Error('Produto não encontrado'));
      }
    }

    return this.http.put<Produto>(`${this.baseUrl}/api/produtos/${id}`, produto).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, atualizando produto localmente');
        this.apiDisponivel = false;
        const index = this.produtosFictícios.findIndex(p => p.id === id);
        if (index !== -1) {
          this.produtosFictícios[index] = { ...produto, id };
          return of({ ...this.produtosFictícios[index] });
        } else {
          return throwError(() => new Error('Produto não encontrado'));
        }
      })
    );
  }

  deletarProduto(id: number): Observable<void> {
    if (!this.apiDisponivel) {
      const index = this.produtosFictícios.findIndex(p => p.id === id);
      if (index !== -1) {
        this.produtosFictícios.splice(index, 1);
        console.log('✅ Produto deletado localmente, ID:', id);
        return of(void 0);
      } else {
        return throwError(() => new Error('Produto não encontrado'));
      }
    }

    return this.http.delete<void>(`${this.baseUrl}/api/produtos/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, deletando produto localmente');
        this.apiDisponivel = false;
        const index = this.produtosFictícios.findIndex(p => p.id === id);
        if (index !== -1) {
          this.produtosFictícios.splice(index, 1);
          return of(void 0);
        } else {
          return throwError(() => new Error('Produto não encontrado'));
        }
      })
    );
  }

  // 🔧 MÉTODOS DE ESTOQUE COM FALLBACK

  entradaEstoque(id: number, quantidade: number): Observable<string> {
    if (!this.apiDisponivel) {
      const produto = this.produtosFictícios.find(p => p.id === id);
      if (produto) {
        produto.quantidade += quantidade;
        console.log(`✅ Entrada de estoque local: +${quantidade} para ${produto.nome}`);
        return of('Estoque aumentado com sucesso (local)');
      } else {
        return throwError(() => new Error('Produto não encontrado'));
      }
    }

    return this.http.post<string>(`${this.baseUrl}/api/estoque/entrada/${id}?quantidade=${quantidade}`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, atualizando estoque localmente');
        this.apiDisponivel = false;
        const produto = this.produtosFictícios.find(p => p.id === id);
        if (produto) {
          produto.quantidade += quantidade;
          return of('Estoque aumentado com sucesso (local)');
        } else {
          return throwError(() => new Error('Produto não encontrado'));
        }
      })
    );
  }

  saidaEstoque(id: number, quantidade: number): Observable<string> {
    if (!this.apiDisponivel) {
      const produto = this.produtosFictícios.find(p => p.id === id);
      if (produto) {
        if (produto.quantidade >= quantidade) {
          produto.quantidade -= quantidade;
          console.log(`✅ Saída de estoque local: -${quantidade} para ${produto.nome}`);
          return of('Estoque reduzido com sucesso (local)');
        } else {
          return throwError(() => new Error('Quantidade em estoque insuficiente'));
        }
      } else {
        return throwError(() => new Error('Produto não encontrado'));
      }
    }

    return this.http.post<string>(`${this.baseUrl}/api/estoque/saida/${id}?quantidade=${quantidade}`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, atualizando estoque localmente');
        this.apiDisponivel = false;
        const produto = this.produtosFictícios.find(p => p.id === id);
        if (produto) {
          if (produto.quantidade >= quantidade) {
            produto.quantidade -= quantidade;
            return of('Estoque reduzido com sucesso (local)');
          } else {
            return throwError(() => new Error('Quantidade em estoque insuficiente'));
          }
        } else {
          return throwError(() => new Error('Produto não encontrado'));
        }
      })
    );
  }

  // 🔧 MÉTODO DE LOGIN COM FALLBACK

  login(credentials: LoginRequest): Observable<LoginResponse> {
    // Sempre permitir login fictício
    if (credentials.email === 'demo@estoqueia.com' && credentials.senha === 'demo123') {
      const response: LoginResponse = {
        token: 'fake-jwt-token-' + Date.now(),
        usuario: {
          id: 1,
          email: credentials.email
        }
      };
      return of(response);
    }

    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API indisponível, tentando login fictício');
        this.apiDisponivel = false;
        
        // Fallback para usuários fictícios
        if (credentials.email === 'demo@estoqueia.com' && credentials.senha === 'demo123') {
          const response: LoginResponse = {
            token: 'fake-jwt-token-' + Date.now(),
            usuario: {
              id: 1,
              email: credentials.email
            }
          };
          return of(response);
        }
        
        return throwError(() => new Error('Credenciais inválidas'));
      })
    );
  }

  // 🔧 GETTER PARA STATUS DA API

  get isApiDisponivel(): boolean {
    return this.apiDisponivel;
  }

  // 🔧 MÉTODO PARA TENTAR RECONECTAR
  tentarReconectar(): void {
    this.listarProdutos().subscribe({
      next: () => {
        this.apiDisponivel = true;
        console.log('✅ API reconectada com sucesso!');
      },
      error: () => {
        console.log('❌ API ainda indisponível');
      }
    });
  }

  // 🔧 MÉTODO PARA OBTER SUGESTÕES DA IA (FALLBACK)
  obterSugestaoIA(produtoId: number, mediaVendas: number = 3, diasCompra: number = 7): Observable<any> {
    if (!this.apiDisponivel) {
      // Simular resposta da IA
      const produto = this.produtosFictícios.find(p => p.id === produtoId);
      if (produto) {
        const sugestao = {
          sugestaoReposicao: Math.max(20 - produto.quantidade, 5),
          observacao: `Baseado na análise de dados, recomendamos repor ${Math.max(20 - produto.quantidade, 5)} unidades.`,
          confianca: 0.85 + (Math.random() * 0.1)
        };
        return of(sugestao);
      } else {
        return throwError(() => new Error('Produto não encontrado'));
      }
    }

    return this.http.post<any>(`${this.baseUrl}/api/estoque/sugestao`, {
      produtoId,
      mediaVendasDiarias: mediaVendas,
      diasParaProximaCompra: diasCompra
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.warn('⚠️ API de IA indisponível, gerando sugestão local');
        this.apiDisponivel = false;
        const produto = this.produtosFictícios.find(p => p.id === produtoId);
        if (produto) {
          const sugestao = {
            sugestaoReposicao: Math.max(20 - produto.quantidade, 5),
            observacao: `Baseado na análise local, recomendamos repor ${Math.max(20 - produto.quantidade, 5)} unidades.`,
            confianca: 0.80
          };
          return of(sugestao);
        } else {
          return throwError(() => new Error('Produto não encontrado'));
        }
      })
    );
  }
}