package br.com.julia.rgsurfschool.api.dto;

public record AlunoCreateResponse(
        Long id,
        String nome,
        String email,
        String telefone
) {
}

