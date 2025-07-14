package com.estoqueia.backend.controller;

// import java.util.HashMap;
// import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.estoqueia.backend.entity.Usuario;
import com.estoqueia.backend.repository.UsuarioRepository;
import com.estoqueia.backend.service.JwtService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
@Tag(name = "Autenticação", description = "Operações de autenticação e autorização")
public class AuthController {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Operation(
        summary = "Registrar novo usuário",
        description = "Cria uma nova conta de usuário no sistema"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Usuário registrado com sucesso"),
        @ApiResponse(responseCode = "400", description = "Email já está em uso ou dados inválidos")
    })
    @PostMapping("/registro")
    public ResponseEntity<String> registro(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Dados do usuário para registro",
                content = @Content(schema = @Schema(implementation = Usuario.class))
            )
            @RequestBody Usuario usuario) {
        System.out.println("Recebido para registro: " + usuario.getEmail());

        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Usuário já existe");
        }

        usuario.setSenha(passwordEncoder.encode(usuario.getSenha()));
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }

    @Operation(
        summary = "Fazer login",
        description = "Autentica um usuário e retorna um token JWT"
    )
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Login realizado com sucesso. Retorna token JWT"),
        @ApiResponse(responseCode = "401", description = "Credenciais inválidas")
    })
    @PostMapping("/login")
    public ResponseEntity<String> login(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(
                description = "Credenciais de login (email e senha)",
                content = @Content(schema = @Schema(implementation = Usuario.class))
            )
            @RequestBody Usuario usuario) {
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

    @Operation(
        summary = "Testar API",
        description = "Endpoint simples para verificar se a API está funcionando"
    )
    @ApiResponse(responseCode = "200", description = "API funcionando corretamente")
    @GetMapping("/test")
    public String test() {
        return "API funcionando!";
    }
}

