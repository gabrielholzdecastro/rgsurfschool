package br.com.julia.rgsurfschool.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record ProdutoRequest(
        String nome,
        Integer qtdEstoque,
        BigDecimal preco,
        BigDecimal custo,
        LocalDate dataAquisicao,
        String fornecedor
) {
}

