package br.com.julia.rgsurfschool.api.dto;

public record ProfessorRequest(
        String nome,
        String email,
        String telefone
) {
}

