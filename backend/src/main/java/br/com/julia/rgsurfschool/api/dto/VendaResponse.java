package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.MetodoPagamento;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.enums.TipoItemVenda;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VendaResponse {
    private Long id;
    private Long itemId;
    private TipoItemVenda tipoItem;
    private String nomeItem;
    private String nomeComprador;
    private Integer quantidade;
    private BigDecimal valorUnitario;
    private BigDecimal valorTotal;
    private MetodoPagamento metodoPagamento;
    private StatusPagamento statusPagamento;
    private LocalDateTime dataVenda;
}
