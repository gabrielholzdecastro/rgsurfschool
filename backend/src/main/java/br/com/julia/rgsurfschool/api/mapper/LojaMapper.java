package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.LojaRequest;
import br.com.julia.rgsurfschool.api.dto.LojaResponse;
import br.com.julia.rgsurfschool.domain.model.Loja;

public class LojaMapper {

    public static LojaResponse toResponse(Loja loja) {
        return new LojaResponse(
                loja.getId(),
                loja.getNome(),
                loja.getQtdEstoque(),
                loja.getCondicao(),
                loja.getPreco(),
                loja.getCusto(),
                loja.getDataAquisicao(),
                loja.getFornecedor()
        );
    }

    public static Loja toEntity(LojaRequest request) {
        return Loja.builder()
                .nome(request.nome())
                .qtdEstoque(request.qtdEstoque())
                .condicao(request.condicao())
                .preco(request.preco())
                .custo(request.custo())
                .dataAquisicao(request.dataAquisicao())
                .fornecedor(request.fornecedor())
                .build();
    }

    public static Loja toEntity(LojaRequest request, Long id) {
        return Loja.builder()
                .id(id)
                .nome(request.nome())
                .qtdEstoque(request.qtdEstoque())
                .condicao(request.condicao())
                .preco(request.preco())
                .custo(request.custo())
                .dataAquisicao(request.dataAquisicao())
                .fornecedor(request.fornecedor())
                .build();
    }

}

