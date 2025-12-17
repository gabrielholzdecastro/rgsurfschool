package br.com.julia.rgsurfschool.api.dto;

import java.math.BigDecimal;

public record TipoAulaResponse(
        Long id,
        String nome,
        BigDecimal valorPadrao
) {
}

