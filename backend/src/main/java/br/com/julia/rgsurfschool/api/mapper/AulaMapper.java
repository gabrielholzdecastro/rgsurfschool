package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.AulaResponse;
import br.com.julia.rgsurfschool.domain.model.Aula;
import org.springframework.stereotype.Component;

@Component
public class AulaMapper {

    public AulaResponse toResponse(Aula aula) {
        return new AulaResponse(
                aula.getId(),
                aula.getAluno().getId(),
                aula.getAluno().getNome(),
                aula.getData(),
                aula.getHoraInicio(),
                aula.getHoraFim(),
                aula.getTipoAula().getId(),
                aula.getTipoAula().getNome(),
                aula.getProfessor() != null ? aula.getProfessor().getId() : null,
                aula.getProfessor() != null ? aula.getProfessor().getNome() : null,
                aula.getValor(),
                aula.getStatusPagamento());
    }
}
