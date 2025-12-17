package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.VendaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.VendaResponse;
import br.com.julia.rgsurfschool.api.mapper.VendaMapper;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Produto;
import br.com.julia.rgsurfschool.domain.model.Venda;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.ProdutoRepository;
import br.com.julia.rgsurfschool.domain.repository.VendaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class VendaService {

    private final VendaRepository vendaRepository;
    private final ProdutoRepository produtoRepository;
    private final AlunoRepository alunoRepository;
    private final VendaMapper vendaMapper;

    @Transactional
    public VendaResponse realizarVenda(VendaCreateRequest request) {
        Produto produto = produtoRepository.findById(request.getProdutoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (produto.getQtdEstoque() < request.getQuantidade()) {
            throw new RuntimeException("Estoque insuficiente. Estoque atual: " + produto.getQtdEstoque());
        }

        // Se venda for fiado (PENDENTE), precisa ter identificação
        if (request.getStatusPagamento() == StatusPagamento.PENDENTE) {
            boolean temAluno = request.getAlunoId() != null;
            boolean temNome = request.getNomeComprador() != null && !request.getNomeComprador().trim().isEmpty();
            
            if (!temAluno && !temNome) {
                throw new RuntimeException("Para vendas 'Fiado' (Pendentes), é obrigatório identificar o comprador (Aluno ou Nome).");
            }
        }

        Aluno aluno = null;
        if (request.getAlunoId() != null) {
            aluno = alunoRepository.findById(request.getAlunoId())
                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        }

        // Baixa de Estoque
        produto.setQtdEstoque(produto.getQtdEstoque() - request.getQuantidade());
        produtoRepository.save(produto);

        // Criação da Venda
        BigDecimal valorTotal = produto.getPreco().multiply(BigDecimal.valueOf(request.getQuantidade()));

        Venda venda = Venda.builder()
                .produto(produto)
                .aluno(aluno)
                .nomeComprador(request.getNomeComprador())
                .quantidade(request.getQuantidade())
                .valorUnitario(produto.getPreco())
                .valorTotal(valorTotal)
                .metodoPagamento(request.getMetodoPagamento())
                .statusPagamento(request.getStatusPagamento())
                .dataVenda(LocalDateTime.now())
                .build();

        Venda vendaSalva = vendaRepository.save(venda);
        return vendaMapper.toResponse(vendaSalva);
    }

    @Transactional(readOnly = true)
    public List<VendaResponse> listarVendas() {
        return vendaRepository.findAll().stream()
                .map(vendaMapper::toResponse)
                .collect(Collectors.toList());
    }
    
    @Transactional
    public void quitarVenda(Long id) {
        atualizarStatusPagamento(id, StatusPagamento.PAGO);
    }

    @Transactional
    public void atualizarStatusPagamento(Long id, StatusPagamento status) {
        Venda venda = vendaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Venda não encontrada"));

        venda.setStatusPagamento(status);
        vendaRepository.save(venda);
    }
}
