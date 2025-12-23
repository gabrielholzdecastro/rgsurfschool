package br.com.julia.rgsurfschool.api.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class GuarderiaUpdateRequest {
    private Long alunoId;
    private Long tipoGuarderiaId;
    private BigDecimal valor;
    private LocalDate dataInicio;
    private Boolean pago;
}

