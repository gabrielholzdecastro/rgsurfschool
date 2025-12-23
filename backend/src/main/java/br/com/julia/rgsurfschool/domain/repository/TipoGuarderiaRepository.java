package br.com.julia.rgsurfschool.domain.repository;

import br.com.julia.rgsurfschool.domain.enums.TempoGuarderia;
import br.com.julia.rgsurfschool.domain.model.TipoGuarderia;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TipoGuarderiaRepository extends JpaRepository<TipoGuarderia, Long> {
    Optional<TipoGuarderia> findByTipo(TempoGuarderia tipo);
}

