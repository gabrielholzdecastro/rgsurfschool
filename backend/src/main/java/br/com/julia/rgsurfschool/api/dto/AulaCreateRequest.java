package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
public class AulaCreateRequest {
    private Long alunoId;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private Long tipoAulaId;
    private BigDecimal valor;
    private StatusPagamento statusPagamento;
}
