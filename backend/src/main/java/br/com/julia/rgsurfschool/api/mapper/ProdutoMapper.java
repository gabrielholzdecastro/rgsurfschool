package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.ProdutoRequest;
import br.com.julia.rgsurfschool.api.dto.ProdutoResponse;
import br.com.julia.rgsurfschool.domain.model.Produto;

public class ProdutoMapper {

    public static ProdutoResponse toResponse(Produto produto) {
        return new ProdutoResponse(
                produto.getId(),
                produto.getNome(),
                produto.getQtdEstoque(),
                produto.getCondicao(),
                produto.getPreco(),
                produto.getCusto(),
                produto.getDataAquisicao(),
                produto.getFornecedor()
        );
    }

    public static Produto toEntity(ProdutoRequest request) {
        return Produto.builder()
                .nome(request.nome())
                .qtdEstoque(request.qtdEstoque())
                .condicao(request.condicao())
                .preco(request.preco())
                .custo(request.custo())
                .dataAquisicao(request.dataAquisicao())
                .fornecedor(request.fornecedor())
                .build();
    }

    public static Produto toEntity(ProdutoRequest request, Long id) {
        return Produto.builder()
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

