package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.TempoGuarderia;

import java.math.BigDecimal;
import java.time.LocalDate;

public record GuarderiaResponse(
        Long id,
        Long alunoId,
        String alunoNome,
        Long tipoGuarderiaId,
        TempoGuarderia tipoGuarderia,
        BigDecimal valor,
        LocalDate dataInicio,
        LocalDate dataFim,
        LocalDate dataVencimento,
        Boolean pago,
        LocalDate dataPagamento
) {
}

