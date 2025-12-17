package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.ProdutoRequest;
import br.com.julia.rgsurfschool.api.dto.ProdutoResponse;
import br.com.julia.rgsurfschool.api.mapper.ProdutoMapper;
import br.com.julia.rgsurfschool.domain.model.Produto;
import br.com.julia.rgsurfschool.domain.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public List<ProdutoResponse> findAll() {
        List<Produto> produtos = produtoRepository.findAll();
        return produtos.stream()
                .map(ProdutoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProdutoResponse create(ProdutoRequest request) {
        Produto produto = ProdutoMapper.toEntity(request);
        Produto produtoSalvo = produtoRepository.save(produto);
        return ProdutoMapper.toResponse(produtoSalvo);
    }

    public ProdutoResponse update(Long id, ProdutoRequest request) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com id: " + id);
        }
        
        Produto produtoAtualizado = ProdutoMapper.toEntity(request, id);
        Produto produtoSalvo = produtoRepository.save(produtoAtualizado);
        return ProdutoMapper.toResponse(produtoSalvo);
    }

    public void delete(Long id) {
        if (!produtoRepository.existsById(id)) {
            throw new RuntimeException("Produto não encontrado com id: " + id);
        }
        produtoRepository.deleteById(id);
    }

    public void atualizarQuantidadeEstoque(Long id, Integer novaQuantidade) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado com id: " + id));
        
        produto.setQtdEstoque(novaQuantidade);
        produtoRepository.save(produto);
    }

}

