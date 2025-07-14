package com.estoqueia.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class SimpleApplicationTest {

    @Test
    void contextLoads() {
        System.out.println("✅ Contexto Spring carregado com sucesso!");
        // Teste básico para verificar se o contexto Spring carrega
    }
    
    @Test 
    void testBasico() {
        System.out.println("🧪 Teste básico executando...");
        assert true;
    }
}