package com.estoqueia.backend.controller;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.repository.ProdutoRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class ProdutoControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        produtoRepository.deleteAll();
    }

    @Test
    void testCriarProduto() throws Exception {
        Produto produto = new Produto();
        produto.setNome("Notebook Dell");
        produto.setDescricao("Notebook Dell Inspiron 15");
        produto.setPreco(new BigDecimal("2500.00"));
        produto.setQuantidade(10);

        mockMvc.perform(post("/api/produtos")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(produto)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.nome").value("Notebook Dell"))
                .andExpect(jsonPath("$.preco").value(2500.00))
                .andExpect(jsonPath("$.quantidade").value(10));
    }

    @Test
    void testListarProdutos() throws Exception {
        // Criar produtos de teste
        Produto produto1 = new Produto();
        produto1.setNome("Mouse");
        produto1.setDescricao("Mouse sem fio");
        produto1.setPreco(new BigDecimal("50.00"));
        produto1.setQuantidade(20);
        produtoRepository.save(produto1);

        Produto produto2 = new Produto();
        produto2.setNome("Teclado");
        produto2.setDescricao("Teclado mecânico");
        produto2.setPreco(new BigDecimal("120.00"));
        produto2.setQuantidade(15);
        produtoRepository.save(produto2);

        mockMvc.perform(get("/api/produtos"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void testBuscarProdutoPorId() throws Exception {
        Produto produto = new Produto();
        produto.setNome("Monitor");
        produto.setDescricao("Monitor 24 polegadas");
        produto.setPreco(new BigDecimal("800.00"));
        produto.setQuantidade(5);
        Produto salvo = produtoRepository.save(produto);

        mockMvc.perform(get("/api/produtos/" + salvo.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Monitor"))
                .andExpect(jsonPath("$.preco").value(800.00));
    }

    @Test
    void testAtualizarProduto() throws Exception {
        Produto produto = new Produto();
        produto.setNome("Monitor");
        produto.setDescricao("Monitor 24 polegadas");
        produto.setPreco(new BigDecimal("800.00"));
        produto.setQuantidade(5);
        Produto salvo = produtoRepository.save(produto);

        produto.setPreco(new BigDecimal("750.00"));
        produto.setQuantidade(8);

        mockMvc.perform(put("/api/produtos/" + salvo.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(produto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.preco").value(750.00))
                .andExpect(jsonPath("$.quantidade").value(8));
    }

    @Test
    void testDeletarProduto() throws Exception {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setDescricao("Produto para teste de exclusão");
        produto.setPreco(new BigDecimal("100.00"));
        produto.setQuantidade(1);
        Produto salvo = produtoRepository.save(produto);

        mockMvc.perform(delete("/api/produtos/" + salvo.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/produtos/" + salvo.getId()))
                .andExpect(status().isNotFound());
    }
}