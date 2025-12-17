package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record AulaResponse(
        Long id,
        Long alunoId,
        String nomeAluno,
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate data,
        @JsonFormat(pattern = "HH:mm") LocalTime horaInicio,
        @JsonFormat(pattern = "HH:mm") LocalTime horaFim,
        Long tipoAulaId,
        String nomeTipoAula,
        BigDecimal valor,
        StatusPagamento statusPagamento) {
}
