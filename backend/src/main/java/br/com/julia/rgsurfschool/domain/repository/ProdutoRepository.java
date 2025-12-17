package br.com.julia.rgsurfschool.domain.repository;

import br.com.julia.rgsurfschool.domain.model.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}

