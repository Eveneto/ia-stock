package com.estoqueia.backend.entity;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "produtos")
@Schema(description = "Entidade que representa um produto no sistema")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "ID único do produto", example = "1")
    private Long id;

    @Column(nullable = false)
    @Schema(description = "Nome do produto", example = "Notebook Dell Inspiron", required = true)
    private String nome;

    @Column(length = 500)
    @Schema(description = "Descrição detalhada do produto", example = "Notebook Dell com 8GB RAM e 256GB SSD")
    private String descricao;

    @Column(nullable = false, precision = 10, scale = 2)
    @Schema(description = "Preço do produto", example = "2499.99", required = true)
    private BigDecimal preco;

    @Column(nullable = false)
    @Schema(description = "Quantidade em estoque", example = "15", required = true)
    private int quantidade;

    // Getters e Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public BigDecimal getPreco() {
        return preco;
    }

    public void setPreco(BigDecimal preco) {
        this.preco = preco;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }
}