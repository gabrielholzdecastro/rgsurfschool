package br.com.julia.rgsurfschool.api.dto;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.enums.TipoAula;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public record AulaResponse(
        Long id,
        String titulo,
        String descricao,
        @JsonFormat(pattern = "yyyy-MM-dd") LocalDate data,
        @JsonFormat(pattern = "HH:mm") LocalTime horaInicio,
        @JsonFormat(pattern = "HH:mm") LocalTime horaFim,
        Integer duracaoMinutos,
        TipoAula tipoAula,
        BigDecimal valor,
        StatusPagamento statusPagamento,
        Integer capacidade,
        List<ProfessorResponse> professores,
        List<AlunoResumoResponse> alunos) {
}
