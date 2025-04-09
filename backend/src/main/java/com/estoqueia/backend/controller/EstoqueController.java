package com.estoqueia.backend.controller;

import com.estoqueia.backend.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "*")
public class EstoqueController {
    private final ProdutoService produtoService;

    public EstoqueController(ProdutoService produtoService) {
        this.produtoService = produtoService;
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
    
}
