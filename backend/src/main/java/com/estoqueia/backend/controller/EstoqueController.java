package com.estoqueia.backend.controller;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.service.ProdutoService;
import com.estoqueia.estoque.EstoqueService;
import com.estoqueia.estoque.SugestaoRequest;
import com.estoqueia.estoque.SugestaoResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/estoque")
@CrossOrigin(origins = "*")
@Tag(name = "Estoque", description = "Operações de controle de estoque e sugestões inteligentes")
public class EstoqueController {
    private final ProdutoService produtoService;
    private final EstoqueService estoqueService;

    public EstoqueController(ProdutoService produtoService, EstoqueService estoqueService) {
        this.produtoService = produtoService;
        this.estoqueService = estoqueService;
    }

    @Operation(
        summary = "Entrada de estoque",
        description = "Adiciona quantidade ao estoque de um produto específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estoque aumentado com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado"),
        @ApiResponse(responseCode = "400", description = "Quantidade inválida")
    })
    @PostMapping("/entrada/{id}")
    public ResponseEntity<String> entradaEstoque(
            @Parameter(description = "ID do produto", example = "1")
            @PathVariable Long id,
            @Parameter(description = "Quantidade a ser adicionada", example = "10")
            @RequestParam int quantidade) {
        try {
            produtoService.entradaEstoque(id, quantidade);
            return ResponseEntity.ok("Estoque aumentado com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Saída de estoque",
        description = "Remove quantidade do estoque de um produto específico"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Estoque reduzido com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado"),
        @ApiResponse(responseCode = "400", description = "Quantidade insuficiente em estoque")
    })
    @PostMapping("/saida/{id}")
    public ResponseEntity<String> saidaEstoque(
            @Parameter(description = "ID do produto", example = "1")
            @PathVariable Long id,
            @Parameter(description = "Quantidade a ser removida", example = "5")
            @RequestParam int quantidade) {
        try {
            produtoService.saidaEstoque(id, quantidade);
            return ResponseEntity.ok("Estoque reduzido com sucesso");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @Operation(
        summary = "Sugestão de reposição com IA",
        description = "Utiliza inteligência artificial para sugerir a quantidade ideal de reposição"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Sugestão gerada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Produto não encontrado"),
        @ApiResponse(responseCode = "500", description = "Erro na IA ou serviço indisponível")
    })
    @PostMapping("/sugestao")
    public ResponseEntity<SugestaoResponse> sugestaoReposicao(
            @Parameter(description = "ID do produto", example = "1")
            @RequestParam Long produtoId,
            @Parameter(description = "Média de vendas diárias", example = "3.5")
            @RequestParam double mediaVendasDiarias,
            @Parameter(description = "Dias para próxima compra", example = "7")
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