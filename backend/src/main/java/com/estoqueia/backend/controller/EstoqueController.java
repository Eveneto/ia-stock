package com.estoqueia.backend.controller;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.service.ProdutoService;
import com.estoqueia.estoque.EstoqueService;
import com.estoqueia.estoque.SugestaoRequest;
import com.estoqueia.estoque.SugestaoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "*")
public class EstoqueController {
    private final ProdutoService produtoService;
    private final EstoqueService estoqueService;

    public EstoqueController(ProdutoService produtoService, EstoqueService estoqueService) {
        this.produtoService = produtoService;
        this.estoqueService = estoqueService;
    }

    @PostMapping("/entrada/{id}")
    public ResponseEntity<String> entradaEstoque(@PathVariable Long id, @RequestParam int quantidade) {
        try {
            produtoService.entradaEstoque(id, quantidade);
            return ResponseEntity.ok("Estoque aumentado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/saida/{id}")
    public ResponseEntity<String> saidaEstoque(@PathVariable Long id, @RequestParam int quantidade) {
        try {
            produtoService.saidaEstoque(id, quantidade);
            return ResponseEntity.ok("Estoque reduzido com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/sugestao")
    public ResponseEntity<SugestaoResponse> getSugestao(
            @RequestParam Long produtoId,
            @RequestParam double mediaVendasDiarias,
            @RequestParam int diasParaProximaCompra) {
        try {
            Produto produto = produtoService.buscarPorId(produtoId)
                    .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
            SugestaoRequest request = new SugestaoRequest();
            request.setProdutoId(produtoId.intValue());
            request.setNome(produto.getNome());
            request.setQuantidadeEmEstoque(produto.getQuantidade());
            request.setMediaVendasDiarias(mediaVendasDiarias);
            request.setDiasParaProximaCompra(diasParaProximaCompra);

            SugestaoResponse response = estoqueService.obterSugestao(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}