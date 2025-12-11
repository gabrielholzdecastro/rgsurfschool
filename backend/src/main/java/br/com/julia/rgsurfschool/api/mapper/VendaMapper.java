package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.VendaResponse;
import br.com.julia.rgsurfschool.domain.model.Venda;
import org.springframework.stereotype.Component;

@Component
public class VendaMapper {

    public VendaResponse toResponse(Venda venda) {
        String nomeComprador = venda.getAluno() != null ? venda.getAluno().getNome() : venda.getNomeComprador();
        String nomeItem = resolveNomeItem(venda);
        Long itemId = resolveItemId(venda);

        return VendaResponse.builder()
                .id(venda.getId())
                .itemId(itemId)
                .tipoItem(venda.getTipoItem())
                .nomeItem(nomeItem)
                .nomeComprador(nomeComprador)
                .quantidade(venda.getQuantidade())
                .valorUnitario(venda.getValorUnitario())
                .valorTotal(venda.getValorTotal())
                .metodoPagamento(venda.getMetodoPagamento())
                .statusPagamento(venda.getStatusPagamento())
                .dataVenda(venda.getDataVenda())
                .build();
    }

    private String resolveNomeItem(Venda venda) {
        if (venda.getProduto() != null) {
            return venda.getProduto().getNome();
        }
        if (venda.getEquipamento() != null) {
            return venda.getEquipamento().getNome();
        }
        if (venda.getAula() != null) {
            return venda.getAula().getTitulo();
        }
        if (venda.getTrip() != null) {
            return venda.getTrip().getDestino();
        }
        return "Item";
    }

    private Long resolveItemId(Venda venda) {
        if (venda.getProduto() != null) {
            return venda.getProduto().getId();
        }
        if (venda.getEquipamento() != null) {
            return venda.getEquipamento().getId();
        }
        if (venda.getAula() != null) {
            return venda.getAula().getId();
        }
        if (venda.getTrip() != null) {
            return venda.getTrip().getId();
        }
        return null;
    }
}
