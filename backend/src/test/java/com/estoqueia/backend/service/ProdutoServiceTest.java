package com.estoqueia.backend.service;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;
import java.util.Optional;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ProdutoServiceTest {

    @Autowired
    private ProdutoService produtoService;

    private ProdutoRepository produtoRepositoryMock;

    @BeforeEach
    public void setUp() {
        produtoRepositoryMock = Mockito.mock(ProdutoRepository.class);
        produtoService = new ProdutoService(produtoRepositoryMock);
    }

    @Test
    public void testSalvarProdutoComNomeVazio() {
        Produto produto = new Produto();
        produto.setNome("");  // Nome vazio
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Nome do produto é obrigatório", exception.getMessage());
    }

    @Test
    public void testSalvarProdutoComPrecoNegativo() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.valueOf(-1));  // Preço negativo
        produto.setQuantidade(10);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Preço e quantidade não podem ser negativos", exception.getMessage());
    }

    @Test
    public void testSalvarProdutoComQuantidadeNegativa() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(-1);  // Quantidade negativa

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Preço e quantidade não podem ser negativos", exception.getMessage());
    }

    @Test
    public void testSalvarProdutoDuplicado() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        // Simulando que já existe um produto com o mesmo nome no banco de dados
        Mockito.when(produtoRepositoryMock.findAll()).thenReturn(List.of(produto));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Produto com este nome já existe", exception.getMessage());
    }

    @Test
    public void testEntradaEstoqueComQuantidadeNegativa() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        Mockito.when(produtoRepositoryMock.findById(1L)).thenReturn(Optional.of(produto));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.entradaEstoque(1L, -5));
        assertEquals("Quantidade de entrada deve ser positiva", exception.getMessage());
    }

    @Test
    public void testSaidaEstoqueComQuantidadeInsuficiente() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(5);

        Mockito.when(produtoRepositoryMock.findById(1L)).thenReturn(Optional.of(produto));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.saidaEstoque(1L, 10));
        assertEquals("Quantidade em estoque insuficiente", exception.getMessage());
    }

    @Test
    public void testSaidaEstoqueComQuantidadePositiva() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        Mockito.when(produtoRepositoryMock.findById(1L)).thenReturn(Optional.of(produto));

        produtoService.saidaEstoque(1L, 5);
        assertEquals(5, produto.getQuantidade());
    }
}
