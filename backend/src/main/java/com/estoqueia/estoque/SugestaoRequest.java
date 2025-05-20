package com.estoqueia.estoque;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SugestaoRequest {
    @JsonProperty("produto_id")
    private int produtoId;

    @JsonProperty("nome")
    private String nome;

    @JsonProperty("quantidade_em_estoque")
    private int quantidadeEmEstoque;

    @JsonProperty("media_vendas_diarias")
    private double mediaVendasDiarias;

    @JsonProperty("dias_para_proxima_compra")
    private int diasParaProximaCompra;
}
