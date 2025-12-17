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
                professor.getTelefone()
        );
    }

    public static Professor toEntity(ProfessorRequest request) {
        return Professor.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .build();
    }

    public static Professor toEntity(ProfessorRequest request, Long id) {
        return Professor.builder()
                .id(id)
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .build();
    }

}

