package br.com.julia.rgsurfschool.api.dto;

public record AlunoCreateRequest(
        String nome,
        String email,
        String telefone
) {
}

