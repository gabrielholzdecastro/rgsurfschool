package br.com.julia.rgsurfschool.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record AulaRequest(
        String titulo,
        String descricao,
        LocalDate data,
        LocalTime horaInicio,
        LocalTime horaFim,
        BigDecimal preco,
        Integer capacidade,
        List<Long> professoresIds,
        List<Long> alunosIds
) {
}
