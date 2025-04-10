package com.estoqueia.backend.security;

import java.security.Key;
import java.util.Base64;
import java.util.Date;

import org.springframework.stereotype.Component;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

@Component
public class JwtUtil {
    // Nova chave Base64 (256 bits)
    private final String SECRET = "IZfH5nx4ny0lExZV1eAdXG8aD6aBC92o2McZq13GiYU=";

    // Geração segura da chave a partir da string Base64
    private final Key key;

    private final long EXPIRATION = 86400000; // 1 dia (em milissegundos)

    public JwtUtil() {
        byte[] decodedKey = Base64.getDecoder().decode(SECRET);
        this.key = Keys.hmacShaKeyFor(decodedKey);

        // DEBUG: verificar chave e tamanho
        System.out.println("🔐 Chave carregada com sucesso.");
        System.out.println("📏 Tamanho da chave em bytes: " + decodedKey.length);
        System.out.println("🔑 Chave em Base64 (gerada internamente): " + Base64.getEncoder().encodeToString(key.getEncoded()));
    }

    public String gerarToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public String extrairEmail(String token) {
        return getClaims(token).getSubject();
    }

    public boolean tokenValido(String token) {
        Claims claims = getClaims(token);
        return claims != null && claims.getExpiration().after(new Date());
    }

    private Claims getClaims(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();
        } catch (Exception e) {
            System.out.println("❌ Erro ao validar token: " + e.getMessage());
            return null;
        }
    }

    // 🧪 Método de teste
    public static void main(String[] args) {
        JwtUtil jwtUtil = new JwtUtil();
        String email = "teste@email.com";
        String token = jwtUtil.gerarToken(email);

        System.out.println("✅ Token gerado com sucesso:");
        System.out.println(token);

        System.out.println("\n📥 Decodificando token...");
        String extraido = jwtUtil.extrairEmail(token);
        System.out.println("📧 Email extraído do token: " + extraido);

        System.out.println("\n🔍 Verificando validade do token...");
        boolean valido = jwtUtil.tokenValido(token);
        System.out.println("✔️ Token válido? " + valido);
    }
}
