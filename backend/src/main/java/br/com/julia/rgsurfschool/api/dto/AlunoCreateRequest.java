package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.NivelAluno;

import java.time.LocalDate;

public record AlunoCreateRequest(
        String nome,
        String email,
        String telefone,
        NivelAluno nivelAluno,
        LocalDate dataInicio
) {
}

