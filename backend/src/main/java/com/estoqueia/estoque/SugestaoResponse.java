package com.estoqueia.estoque;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class SugestaoResponse {
    @JsonProperty("sugestao_reposicao")
    private int sugestaoReposicao;

    @JsonProperty("observacao")
    private String observacao;
}
