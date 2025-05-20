package com.estoqueia.estoque;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

@Service
public class EstoqueService {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String aiServiceUrl = "http://localhost:8000/sugestao";

    public SugestaoResponse obterSugestao(SugestaoRequest request) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<SugestaoRequest> httpEntity = new HttpEntity<>(request, headers);
        return restTemplate.postForObject(aiServiceUrl, httpEntity, SugestaoResponse.class);
    }
}
