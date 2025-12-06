package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.VendaResponse;
import br.com.julia.rgsurfschool.domain.model.Venda;
import org.springframework.stereotype.Component;

@Component
public class VendaMapper {

    public VendaResponse toResponse(Venda venda) {
        String nomeComprador = venda.getAluno() != null ? venda.getAluno().getNome() : venda.getNomeComprador();

        return VendaResponse.builder()
                .id(venda.getId())
                .nomeProduto(venda.getProduto().getNome())
                .nomeComprador(nomeComprador)
                .quantidade(venda.getQuantidade())
                .valorUnitario(venda.getValorUnitario())
                .valorTotal(venda.getValorTotal())
                .metodoPagamento(venda.getMetodoPagamento())
                .statusPagamento(venda.getStatusPagamento())
                .dataVenda(venda.getDataVenda())
                .build();
    }
}
