package br.com.julia.rgsurfschool.api.dto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class TipoGuarderiaUpdateRequest {
    private BigDecimal valorPadrao;
}

