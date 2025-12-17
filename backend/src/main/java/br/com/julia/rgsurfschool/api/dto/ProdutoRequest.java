package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.Condicao;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProdutoRequest(
        String nome,
        Integer qtdEstoque,
        Condicao condicao,
        BigDecimal preco,
        BigDecimal custo,
        LocalDate dataAquisicao,
        String fornecedor
) {
}

