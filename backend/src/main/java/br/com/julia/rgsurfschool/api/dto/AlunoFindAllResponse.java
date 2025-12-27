package br.com.julia.rgsurfschool.api.dto;

public record AlunoFindAllResponse(
                Long id,
                String nome,
                String email,
                String telefone) {
}
