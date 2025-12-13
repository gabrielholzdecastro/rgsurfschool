package br.com.julia.rgsurfschool.domain.repository;

import br.com.julia.rgsurfschool.domain.model.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface AulaRepository extends JpaRepository<Aula, Long> {

    @Query("SELECT MAX(a.data) FROM tb_aula a JOIN a.alunos al WHERE al.id = :alunoId")
    LocalDate findUltimaDataAulaByAlunoId(@Param("alunoId") Long alunoId);
}
