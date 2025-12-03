package br.com.julia.rgsurfschool.domain.repository;

import br.com.julia.rgsurfschool.domain.model.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
}
