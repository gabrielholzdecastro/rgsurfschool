package br.com.julia.rgsurfschool.api.dto;

import br.com.julia.rgsurfschool.domain.enums.MetodoPagamento;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.enums.TipoItemVenda;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VendaCreateRequest {
    private Long itemId;
    private TipoItemVenda tipoItem;
    private Long alunoId;
    private String nomeComprador;
    private Integer quantidade;
    private MetodoPagamento metodoPagamento;
    private StatusPagamento statusPagamento;
}
