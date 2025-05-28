package com.estoqueia.backend.service;

import com.estoqueia.estoque.SugestaoRequest;
import com.estoqueia.estoque.SugestaoResponse;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class IAClientService {

    private final RestTemplate restTemplate;
    private final String IA_SERVICE_URL = "http://localhost:8000/sugestao"; // ajuste a URL conforme seu microserviço

    public IAClientService() {
        this.restTemplate = new RestTemplate();
    }

    public SugestaoResponse obterSugestao(SugestaoRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<SugestaoRequest> entity = new HttpEntity<>(request, headers);

        return restTemplate.postForObject(IA_SERVICE_URL, entity, SugestaoResponse.class);
    }
}
