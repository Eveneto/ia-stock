package com.estoqueia.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
                // ✅ CORS CONFIGURADO
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                
                // ✅ CSRF DESABILITADO para APIs REST
                .csrf(csrf -> csrf.disable())
                
                // ✅ AUTORIZAÇÃO DE REQUESTS
                .authorizeHttpRequests(auth -> auth
                    // Endpoints públicos
                    .requestMatchers("/auth/**").permitAll()
                    .requestMatchers("/api/**").permitAll()        // ✅ Permitir todos os endpoints da API
                    .requestMatchers("/swagger-ui/**").permitAll()
                    .requestMatchers("/v3/api-docs/**").permitAll()
                    .requestMatchers("/swagger-ui.html").permitAll()
                    .requestMatchers("/").permitAll()
                    
                    // Todos os outros precisam de autenticação
                    .anyRequest().authenticated()
                )
                
                // ✅ SESSÃO STATELESS (JWT)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                
                .build();
    }

    // ✅ CONFIGURAÇÃO DE CORS CORRIGIDA
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        org.springframework.web.cors.CorsConfiguration configuration = new org.springframework.web.cors.CorsConfiguration();
        
        // ✅ ORIGINS ESPECÍFICOS (não usar "*" com credentials)
        configuration.addAllowedOrigin("http://localhost:4200");
        configuration.addAllowedOrigin("http://127.0.0.1:4200");
        
        // ✅ MÉTODOS ESPECÍFICOS (não usar "*" com credentials)
        configuration.addAllowedMethod("GET");
        configuration.addAllowedMethod("POST");
        configuration.addAllowedMethod("PUT");
        configuration.addAllowedMethod("DELETE");
        configuration.addAllowedMethod("OPTIONS");
        configuration.addAllowedMethod("HEAD");
        
        // ✅ HEADERS ESPECÍFICOS
        configuration.addAllowedHeader("*");
        
        // ✅ CREDENTIALS
        configuration.setAllowCredentials(true);
        
        // ✅ CACHE PREFLIGHT
        configuration.setMaxAge(3600L);
        
        org.springframework.web.cors.UrlBasedCorsConfigurationSource source = 
            new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
}