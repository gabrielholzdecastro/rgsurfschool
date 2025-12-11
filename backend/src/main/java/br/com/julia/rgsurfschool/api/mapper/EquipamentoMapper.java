package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.EquipamentoRequest;
import br.com.julia.rgsurfschool.api.dto.EquipamentoResponse;
import br.com.julia.rgsurfschool.domain.model.Equipamento;

public class EquipamentoMapper {

    public static Equipamento toEntity(EquipamentoRequest request) {
        return Equipamento.builder()
                .nome(request.nome())
                .qtdEstoque(request.qtdEstoque())
                .condicao(request.condicao())
                .preco(request.preco())
                .custo(request.custo())
                .dataAquisicao(request.dataAquisicao())
                .fornecedor(request.fornecedor())
                .emUso(request.emUso())
                .disponivelVenda(request.disponivelVenda())
                .build();
    }

    public static void updateEntity(Equipamento equipamento, EquipamentoRequest request) {
        equipamento.setNome(request.nome());
        equipamento.setQtdEstoque(request.qtdEstoque());
        equipamento.setCondicao(request.condicao());
        equipamento.setPreco(request.preco());
        equipamento.setCusto(request.custo());
        equipamento.setDataAquisicao(request.dataAquisicao());
        equipamento.setFornecedor(request.fornecedor());
        equipamento.setEmUso(request.emUso());
        equipamento.setDisponivelVenda(request.disponivelVenda());
    }

    public static EquipamentoResponse toResponse(Equipamento equipamento) {
        return new EquipamentoResponse(
                equipamento.getId(),
                equipamento.getNome(),
                equipamento.getQtdEstoque(),
                equipamento.getCondicao(),
                equipamento.getPreco(),
                equipamento.getCusto(),
                equipamento.getDataAquisicao(),
                equipamento.getFornecedor(),
                equipamento.getEmUso(),
                equipamento.getDisponivelVenda()
        );
    }
}
