package br.com.julia.rgsurfschool.api.dto;

public record AlunoUpdateRequest(
        String nome,
        String email,
        String telefone
) {
}

