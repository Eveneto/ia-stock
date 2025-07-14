export interface MovimentacaoEstoque {
  produtoId: number;
  quantidade: number;
  tipo: 'ENTRADA' | 'SAIDA';
  data?: Date;
}

export interface SugestaoIA {
  sugestaoReposicao: number;
  observacao: string;
  confianca: number;
}