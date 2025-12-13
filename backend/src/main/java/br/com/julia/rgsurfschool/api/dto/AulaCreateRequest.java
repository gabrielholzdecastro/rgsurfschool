package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.enums.TipoAula;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Getter
@Setter
public class AulaCreateRequest {
    private String titulo;
    private String descricao;
    private Integer capacidade;
    private Long alunoId;
    private LocalDate data;
    private LocalTime horaInicio;
    private LocalTime horaFim;
    private TipoAula tipoAula;
    private BigDecimal valor;
    private StatusPagamento statusPagamento;
    private List<Long> professoresIds;
    private List<Long> alunosIds;
}
