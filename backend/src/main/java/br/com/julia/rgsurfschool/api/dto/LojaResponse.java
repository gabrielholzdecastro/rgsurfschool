package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.model.Condicao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record LojaResponse(
        Long id,
        String nome,
        Integer qtdEstoque,
        Condicao condicao,
        BigDecimal preco,
        BigDecimal custo,
        LocalDate dataAquisicao,
        String fornecedor
) {
}

