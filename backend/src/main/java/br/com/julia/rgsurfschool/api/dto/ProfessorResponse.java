package br.com.julia.rgsurfschool.api.dto;

public record ProfessorResponse(
        Long id,
        String nome,
        String email,
        String telefone
) {
}

