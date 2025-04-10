package com.estoqueia.backend.controller;

// import java.util.HashMap;
// import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estoqueia.backend.entity.Usuario;
import com.estoqueia.backend.repository.UsuarioRepository;
import com.estoqueia.backend.service.JwtService;

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
        System.out.println("Recebido para registro: " + usuario.getEmail());

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Usuário já existe");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }


    @PostMapping("/login")
    
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        System.out.println("🚀 Login chamado");
        System.out.println("Email recebido: " + usuario.getEmail());
        System.out.println("Senha recebida: " + usuario.getSenha());
        System.out.println("Tentando login: " + usuario.getEmail());

        Optional<Usuario> optional = usuarioRepository.findByEmail(usuario.getEmail());

        if (optional.isPresent()) {
            Usuario user = optional.get();
            if (passwordEncoder.matches(usuario.getSenha(), user.getSenha())) {
                String token = jwtService.gerarToken(user.getEmail());
                System.out.println("🔐 Token gerado: " + token);
                return ResponseEntity.ok("Token JWT: " + token);
            }
        }

        return ResponseEntity.status(401).body("Credenciais inválidas");
    }

    @GetMapping("/test")
    public ResponseEntity<String> test() {
        return ResponseEntity.ok("API funcionando!");
    }


}

