package com.estoqueia.backend.service;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<Produto> listarProdutos() {
        return produtoRepository.findAll();
    }

    public Optional<Produto> buscarPorId(Long id) {
        return produtoRepository.findById(id);
    }

    public Produto salvar(Produto produto) {
        if (produto.getNome() == null || produto.getNome().trim().isEmpty()) {
            throw new RuntimeException("Nome do produto é obrigatório");
        }

        if (produto.getPreco().signum() < 0 || produto.getQuantidade() < 0) {
            throw new RuntimeException("Preço e quantidade não podem ser negativos");
        }

        // Verificar se já existe produto com o mesmo nome
        boolean duplicado = produtoRepository.findAll().stream()
                .anyMatch(p -> p.getNome().equalsIgnoreCase(produto.getNome()));

        if (duplicado) {
            throw new RuntimeException("Produto com este nome já existe");
        }

        return produtoRepository.save(produto);
    }

    public Produto atualizar(Long id, Produto novoProduto) {
        Produto existente = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        existente.setNome(novoProduto.getNome());
        existente.setPreco(novoProduto.getPreco());
        existente.setQuantidade(novoProduto.getQuantidade());

        return produtoRepository.save(existente);
    }

    public void deletar(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produtoRepository.delete(produto);
    }

    public void entradaEstoque(Long id, int quantidade) {
        if (quantidade <= 0) {
            throw new RuntimeException("Quantidade de entrada deve ser positiva");
        }

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setQuantidade(produto.getQuantidade() + quantidade);
        produtoRepository.save(produto);
    }

    public void saidaEstoque(Long id, int quantidade) {
        if (quantidade <= 0) {
            throw new RuntimeException("Quantidade de saída deve ser positiva");
        }

        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (produto.getQuantidade() < quantidade) {
            throw new RuntimeException("Quantidade em estoque insuficiente");
        }

        produto.setQuantidade(produto.getQuantidade() - quantidade);
        produtoRepository.save(produto);
    }
}
