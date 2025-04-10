package com.estoqueia.backend.controller;

import com.estoqueia.backend.entity.Usuario;
import com.estoqueia.backend.repository.UsuarioRepository;
import com.estoqueia.backend.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Usuário já existe");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        Optional<Usuario> optional = usuarioRepository.findByEmail(usuario.getEmail());

        if (optional.isPresent()) {
            Usuario user = optional.get();
            if (passwordEncoder.matches(usuario.getSenha(), user.getSenha())) {
                String token = jwtService.gerarToken(user.getEmail());

                Map<String, String> response = new HashMap<>();
                response.put("token", token);

                return ResponseEntity.ok(response);
            }
        }

        return ResponseEntity.status(401).body("Credenciais inválidas");
    }
}

