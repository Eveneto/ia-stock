package com.estoqueia.backend.dto;

public class SugestaoRequest {
    private Long produtoId;
    private String nome;
    private int quantidadeEmEstoque;
    private double mediaVendasDiarias;
    private int diasParaProximaCompra;

    // Construtores
    public SugestaoRequest() {}

    public SugestaoRequest(Long produtoId, String nome, int quantidadeEmEstoque, 
                          double mediaVendasDiarias, int diasParaProximaCompra) {
        this.produtoId = produtoId;
        this.nome = nome;
        this.quantidadeEmEstoque = quantidadeEmEstoque;
        this.mediaVendasDiarias = mediaVendasDiarias;
        this.diasParaProximaCompra = diasParaProximaCompra;
    }

    // Getters
    public Long getProdutoId() {
        return produtoId;
    }

    public String getNome() {
        return nome;
    }

    public int getQuantidadeEmEstoque() {
        return quantidadeEmEstoque;
    }

    public double getMediaVendasDiarias() {
        return mediaVendasDiarias;
    }

    public int getDiasParaProximaCompra() {
        return diasParaProximaCompra;
    }

    // Setters
    public void setProdutoId(Long produtoId) {
        this.produtoId = produtoId;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public void setQuantidadeEmEstoque(int quantidadeEmEstoque) {
        this.quantidadeEmEstoque = quantidadeEmEstoque;
    }

    public void setMediaVendasDiarias(double mediaVendasDiarias) {
        this.mediaVendasDiarias = mediaVendasDiarias;
    }

    public void setDiasParaProximaCompra(int diasParaProximaCompra) {
        this.diasParaProximaCompra = diasParaProximaCompra;
    }
}