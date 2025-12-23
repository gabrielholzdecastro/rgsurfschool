package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.TempoGuarderia;

import java.math.BigDecimal;

public record TipoGuarderiaResponse(
        Long id,
        TempoGuarderia tipo,
        BigDecimal valorPadrao
) {
}

