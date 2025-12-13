package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.NivelAluno;

import java.time.LocalDate;

public record AlunoFindAllResponse(
        Long id,
        String nome,
        String email,
        String telefone,
        NivelAluno nivelAluno,
        LocalDate dataInicio,
        boolean ativo,
        LocalDate dataUltimaAula
) {
}

