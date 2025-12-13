package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.ProfessorRequest;
import br.com.julia.rgsurfschool.api.dto.ProfessorResponse;
import br.com.julia.rgsurfschool.domain.model.Professor;

public class ProfessorMapper {

    public static ProfessorResponse toResponse(Professor professor) {
        return new ProfessorResponse(
                professor.getId(),
                professor.getNome(),
                professor.getEmail(),
                professor.getTelefone(),
                professor.getEspecialidade()
        );
    }

    public static Professor toEntity(ProfessorRequest request) {
        return Professor.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .especialidade(request.especialidade())
                .build();
    }

    public static void updateEntity(Professor professor, ProfessorRequest request) {
        professor.setNome(request.nome());
        professor.setEmail(request.email());
        professor.setTelefone(request.telefone());
        professor.setEspecialidade(request.especialidade());
    }
}
