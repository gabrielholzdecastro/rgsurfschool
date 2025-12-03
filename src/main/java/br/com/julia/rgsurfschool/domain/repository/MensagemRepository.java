package br.com.julia.rgsurfschool.domain.repository;

import br.com.julia.rgsurfschool.domain.model.Mensagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MensagemRepository extends JpaRepository<Mensagem, Long> {
}

