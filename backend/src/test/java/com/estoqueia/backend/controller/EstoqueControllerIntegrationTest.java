package com.estoqueia.backend.controller;

import com.estoqueia.backend.config.TestSecurityConfig;
import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.repository.ProdutoRepository;
import com.estoqueia.estoque.SugestaoResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.context.annotation.Import;
import org.springframework.http.*;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(TestSecurityConfig.class)
@Transactional
public class EstoqueControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private ProdutoRepository produtoRepository;

    private Produto produtoTeste;

    @BeforeEach
    void setUp() {
        produtoRepository.deleteAll();
        
        // Criar produto de teste
        produtoTeste = new Produto();
        produtoTeste.setNome("Produto Teste");
        produtoTeste.setDescricao("Produto para testes de estoque");
        produtoTeste.setPreco(new BigDecimal("100.00"));
        produtoTeste.setQuantidade(50);
        produtoTeste = produtoRepository.save(produtoTeste);
    }

    @Test
    void testEntradaEstoque() {
        String url = "/api/estoque/entrada/" + produtoTeste.getId() + "?quantidade=10";
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Estoque aumentado com sucesso", response.getBody());
        
        // Verificar se o estoque foi atualizado
        Produto atualizado = produtoRepository.findById(produtoTeste.getId()).orElse(null);
        assertNotNull(atualizado);
        assertEquals(60, atualizado.getQuantidade());
    }

    @Test
    void testSaidaEstoque() {
        String url = "/api/estoque/saida/" + produtoTeste.getId() + "?quantidade=10";
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
        
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("Estoque reduzido com sucesso", response.getBody());
        
        // Verificar se o estoque foi atualizado
        Produto atualizado = produtoRepository.findById(produtoTeste.getId()).orElse(null);
        assertNotNull(atualizado);
        assertEquals(40, atualizado.getQuantidade());
    }

    @Test
    void testSaidaEstoqueQuantidadeInsuficiente() {
        String url = "/api/estoque/saida/" + produtoTeste.getId() + "?quantidade=100";
        
        ResponseEntity<String> response = restTemplate.postForEntity(url, null, String.class);
        
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(response.getBody().contains("insuficiente"));
    }

    @Test
    void testSugestaoDeReposicao() {
        String url = "/api/estoque/sugestao?produtoId=" + produtoTeste.getId() +
                     "&mediaVendasDiarias=3.5" +
                     "&diasParaProximaCompra=7";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<SugestaoResponse> response = restTemplate
                .exchange(url, HttpMethod.POST, entity, SugestaoResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
    }
}
