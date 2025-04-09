package com.estoqueia.backend.repository;

import com.estoqueia.backend.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    // Aqui você pode adicionar métodos personalizados, se necessário
}
    

