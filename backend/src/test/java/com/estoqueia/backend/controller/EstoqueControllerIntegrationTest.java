package com.estoqueia.backend.controller;

import com.estoqueia.estoque.SugestaoResponse;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.http.*;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
public class EstoqueControllerIntegrationTest {

    @Autowired
    private TestRestTemplate restTemplate;

    @Test
    public void testSugestaoDeReposicao() {
        // Supondo que o produto de ID 1 exista no banco de dados
        Long produtoId = 1L;
        double mediaVendasDiarias = 3.5;
        int diasParaProximaCompra = 7;

        String url = "/api/estoque/sugestao?produtoId=" + produtoId +
                     "&mediaVendasDiarias=" + mediaVendasDiarias +
                     "&diasParaProximaCompra=" + diasParaProximaCompra;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        ResponseEntity<SugestaoResponse> response = restTemplate
                .exchange(url, HttpMethod.POST, entity, SugestaoResponse.class);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().getSugestaoReposicao() >= 0);
        assertNotNull(response.getBody().getObservacao());
    }
}
