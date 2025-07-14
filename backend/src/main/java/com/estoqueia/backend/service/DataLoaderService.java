package com.estoqueia.backend.service;

import com.estoqueia.backend.entity.Produto;
import com.estoqueia.backend.entity.Usuario;
import com.estoqueia.backend.repository.ProdutoRepository;
import com.estoqueia.backend.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
// 🔧 REMOVIDO @Profile - agora roda em QUALQUER perfil (inclusive produção)
public class DataLoaderService implements CommandLineRunner {

    @Autowired
    private ProdutoRepository produtoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        System.out.println("🔄 INICIANDO VERIFICAÇÃO DE DADOS FAKE");
        
        // Verificar se já existem dados
        long totalProdutos = produtoRepository.count();
        long totalUsuarios = usuarioRepository.count();
        
        System.out.println("📊 Produtos existentes: " + totalProdutos);
        System.out.println("👥 Usuários existentes: " + totalUsuarios);
        
        if (totalProdutos == 0) {
            System.out.println("📦 Carregando produtos fake...");
            carregarProdutosFake();
            System.out.println("✅ " + produtoRepository.count() + " produtos carregados!");
        } else {
            System.out.println("📦 Produtos já existem. Pulando carga.");
        }
        
        if (totalUsuarios == 0) {
            System.out.println("👥 Carregando usuários fake...");
            carregarUsuariosFake();
            System.out.println("✅ " + usuarioRepository.count() + " usuários carregados!");
        } else {
            System.out.println("👥 Usuários já existem. Pulando carga.");
        }
        
        System.out.println("🎯 DADOS FAKE PRONTOS PARA USO!");
        System.out.println("🌐 Acesse: http://localhost:8080/swagger-ui.html");
        System.out.println("🔐 Login teste: demo@estoqueia.com / demo123");
    }

    private void carregarProdutosFake() {
        List<Produto> produtos = Arrays.asList(
            // 💻 Eletrônicos
            criarProduto("Notebook Dell Inspiron 15", "Notebook Dell com Intel i5, 8GB RAM, 256GB SSD", new BigDecimal("2499.99"), 15),
            criarProduto("Mouse Logitech MX Master", "Mouse sem fio ergonômico com precisão avançada", new BigDecimal("349.90"), 45),
            criarProduto("Teclado Mecânico RGB", "Teclado mecânico com iluminação RGB e switches Cherry", new BigDecimal("450.00"), 30),
            criarProduto("Monitor 24\" Full HD", "Monitor IPS 24 polegadas com tecnologia IPS", new BigDecimal("899.99"), 12),
            criarProduto("Headset Gamer HyperX", "Headset gamer com microfone e som surround", new BigDecimal("299.90"), 25),
            
            // ⚠️ Produtos com estoque baixo (ideais para testar IA)
            criarProduto("SSD 512GB NVMe", "SSD M.2 NVMe de alta velocidade", new BigDecimal("399.99"), 3), // Crítico
            criarProduto("Memória RAM 16GB DDR4", "Memória RAM 3200MHz para gaming", new BigDecimal("480.00"), 5), // Baixo
            criarProduto("Placa de Vídeo RTX 3060", "GPU NVIDIA para jogos e design", new BigDecimal("1899.99"), 2), // Muito baixo
            criarProduto("Fonte 650W 80+ Bronze", "Fonte de alimentação modular eficiente", new BigDecimal("350.00"), 8), // Baixo
            
            // 📱 Mobile & Acessórios
            criarProduto("Smartphone Android 128GB", "Smartphone com câmera tripla e tela AMOLED", new BigDecimal("1299.99"), 20),
            criarProduto("Fone Bluetooth Premium", "Fone de ouvido sem fio com cancelamento de ruído", new BigDecimal("399.90"), 35),
            criarProduto("Webcam Full HD 1080p", "Webcam para streaming e videoconferências", new BigDecimal("250.00"), 40),
            criarProduto("Cabo HDMI 2.0 - 2m", "Cabo HDMI premium para 4K", new BigDecimal("29.90"), 100),
            
            // 🏠 Casa Inteligente  
            criarProduto("Lâmpada LED Smart", "Lâmpada inteligente RGB controlada por app", new BigDecimal("69.90"), 75),
            criarProduto("Alexa Echo Dot", "Assistente virtual com comando de voz", new BigDecimal("199.90"), 25),
            
            // 🎮 Gaming
            criarProduto("Controle PS5 DualSense", "Controle oficial PlayStation 5", new BigDecimal("449.90"), 15),
            criarProduto("Mousepad Gamer XXL", "Mousepad extra grande para gaming", new BigDecimal("89.90"), 55)
        );
        
        produtoRepository.saveAll(produtos);
    }

    private void carregarUsuariosFake() {
        List<Usuario> usuarios = Arrays.asList(
            criarUsuario("admin@estoqueia.com", "admin123"),
            criarUsuario("demo@estoqueia.com", "demo123"),
            criarUsuario("teste@estoqueia.com", "teste123"),
            criarUsuario("gerente@estoqueia.com", "gerente123"),
            criarUsuario("vendedor@estoqueia.com", "vendedor123"),
            criarUsuario("operador@estoqueia.com", "operador123")
        );
        
        usuarioRepository.saveAll(usuarios);
    }

    private Produto criarProduto(String nome, String descricao, BigDecimal preco, int quantidade) {
        Produto produto = new Produto();
        produto.setNome(nome);
        produto.setDescricao(descricao);
        produto.setPreco(preco);
        produto.setQuantidade(quantidade);
        return produto;
    }

    private Usuario criarUsuario(String email, String senha) {
        Usuario usuario = new Usuario();
        usuario.setEmail(email);
        usuario.setSenha(passwordEncoder.encode(senha));
        return usuario;
    }
}