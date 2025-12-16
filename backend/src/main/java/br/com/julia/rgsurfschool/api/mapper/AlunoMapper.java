package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AlunoCreateResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoFindAllResponse;
import br.com.julia.rgsurfschool.domain.model.Aluno;

public class AlunoMapper {

    public static AlunoFindAllResponse toFindAllResponse(Aluno aluno) {
        return new AlunoFindAllResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getTelefone(),
                aluno.getNivelAluno(),
                aluno.getDataInicio());
    }

    public static Aluno toEntity(AlunoCreateRequest request) {
        return Aluno.builder()
                .nome(request.nome())
                .email(request.email())
                .telefone(request.telefone())
                .nivelAluno(request.nivelAluno())
                .dataInicio(request.dataInicio())
                .build();
    }

    public static AlunoCreateResponse toCreateResponse(Aluno aluno) {
        return new AlunoCreateResponse(
                aluno.getId(),
                aluno.getNome(),
                aluno.getEmail(),
                aluno.getTelefone(),
                aluno.getNivelAluno(),
                aluno.getDataInicio());
    }
}
