package com.estoqueia.backend;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

// Teste básico SEM Spring para verificar se JUnit funciona
class BasicTest {

    @Test
    void testBasico() {
        System.out.println("✅ JUnit funcionando!");
        assertEquals(4, 2 + 2);
    }
    
    @Test
    void testString() {
        String teste = "EstoqueIA";
        assertNotNull(teste);
        assertTrue(teste.contains("Estoque"));
    }
}