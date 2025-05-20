package com.estoqueia.backend.service;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.repository.ProdutoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class ProdutoServiceTest {

    @Mock
    private ProdutoRepository produtoRepository;

    @InjectMocks
    private ProdutoService produtoService;

    @BeforeEach
    public void setUp() {
        // No setup needed, MockitoExtension initializes mocks
    }

    @Test
    public void testSalvarProdutoComNomeVazio() {
        Produto produto = new Produto();
        produto.setNome("");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Nome do produto é obrigatório", exception.getMessage());
    }

    @Test
    public void testSalvarProdutoComPrecoNegativo() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.valueOf(-1));
        produto.setQuantidade(10);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Preço e quantidade não podem ser negativos", exception.getMessage());
    }

    @Test
    public void testSalvarProdutoComQuantidadeNegativa() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(-1);

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Preço e quantidade não podem ser negativos", exception.getMessage());
    }

    @Test
    public void testSalvarProdutoDuplicado() {
        Produto produto = new Produto();
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        when(produtoRepository.findAll()).thenReturn(List.of(produto));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.salvar(produto));
        assertEquals("Produto com este nome já existe", exception.getMessage());
    }

    @Test
    public void testEntradaEstoqueComQuantidadeNegativa() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.entradaEstoque(1L, -5));
        assertEquals("Quantidade de entrada deve ser positiva", exception.getMessage());
    }

    @Test
    public void testSaidaEstoqueComQuantidadeInsuficiente() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(5);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        RuntimeException exception = assertThrows(RuntimeException.class, () -> produtoService.saidaEstoque(1L, 10));
        assertEquals("Quantidade em estoque insuficiente", exception.getMessage());
    }

    @Test
    public void testSaidaEstoqueComQuantidadePositiva() {
        Produto produto = new Produto();
        produto.setId(1L);
        produto.setNome("Produto Teste");
        produto.setPreco(BigDecimal.TEN);
        produto.setQuantidade(10);

        when(produtoRepository.findById(1L)).thenReturn(Optional.of(produto));

        produtoService.saidaEstoque(1L, 5);
        assertEquals(5, produto.getQuantidade());
        verify(produtoRepository, times(1)).save(produto);
    }
}