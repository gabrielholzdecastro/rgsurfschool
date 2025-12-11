package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.VendaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.VendaResponse;
import br.com.julia.rgsurfschool.api.mapper.VendaMapper;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.enums.TipoItemVenda;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Loja;
import br.com.julia.rgsurfschool.domain.model.Aula;
import br.com.julia.rgsurfschool.domain.model.Trip;
import br.com.julia.rgsurfschool.domain.model.Equipamento;
import br.com.julia.rgsurfschool.domain.model.Venda;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.AulaRepository;
import br.com.julia.rgsurfschool.domain.repository.TripRepository;
import br.com.julia.rgsurfschool.domain.repository.EquipamentoRepository;
import br.com.julia.rgsurfschool.domain.repository.LojaRepository;
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
    private final LojaRepository lojaRepository;
    private final AlunoRepository alunoRepository;
    private final EquipamentoRepository equipamentoRepository;
    private final AulaRepository aulaRepository;
    private final TripRepository tripRepository;
    private final VendaMapper vendaMapper;

    @Transactional
    public VendaResponse realizarVenda(VendaCreateRequest request) {
        validarPagamentoPendente(request);

        Aluno aluno = buscarAluno(request.getAlunoId());

        int quantidade = request.getQuantidade() != null ? request.getQuantidade() : 1;
        ItemVendaData itemData = carregarItem(request, quantidade);

        BigDecimal valorTotal = itemData.preco.multiply(BigDecimal.valueOf(quantidade));

        Venda venda = Venda.builder()
                .produto(itemData.loja)
                .equipamento(itemData.equipamento)
                .aula(itemData.aula)
                .trip(itemData.trip)
                .tipoItem(request.getTipoItem())
                .aluno(aluno)
                .nomeComprador(request.getNomeComprador())
                .quantidade(quantidade)
                .valorUnitario(itemData.preco)
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

    private void validarPagamentoPendente(VendaCreateRequest request) {
        if (request.getStatusPagamento() == StatusPagamento.PENDENTE) {
            boolean temAluno = request.getAlunoId() != null;
            boolean temNome = request.getNomeComprador() != null && !request.getNomeComprador().trim().isEmpty();

            if (!temAluno && !temNome) {
                throw new RuntimeException("Para vendas 'Fiado' (Pendentes), é obrigatório identificar o comprador (Aluno ou Nome).");
            }
        }
    }

    private Aluno buscarAluno(Long alunoId) {
        if (alunoId == null) {
            return null;
        }
        return alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
    }

    private ItemVendaData carregarItem(VendaCreateRequest request, Integer quantidade) {
        if (request.getTipoItem() == null) {
            throw new RuntimeException("Tipo do item é obrigatório");
        }

        if (quantidade <= 0) {
            throw new RuntimeException("Quantidade inválida");
        }

        return switch (request.getTipoItem()) {
            case LOJA -> carregarProdutoLoja(request.getItemId(), quantidade);
            case EQUIPAMENTO -> carregarEquipamento(request.getItemId(), quantidade);
            case AULA -> carregarAula(request.getItemId(), quantidade);
            case TRIP -> carregarTrip(request.getItemId(), quantidade);
        };
    }

    private ItemVendaData carregarProdutoLoja(Long itemId, Integer quantidade) {
        Loja produto = lojaRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        if (produto.getQtdEstoque() < quantidade) {
            throw new RuntimeException("Estoque insuficiente. Estoque atual: " + produto.getQtdEstoque());
        }

        produto.setQtdEstoque(produto.getQtdEstoque() - quantidade);
        lojaRepository.save(produto);

        return ItemVendaData.deProduto(produto, produto.getPreco());
    }

    private ItemVendaData carregarEquipamento(Long itemId, Integer quantidade) {
        Equipamento equipamento = equipamentoRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado"));

        if (Boolean.FALSE.equals(equipamento.getDisponivelVenda())) {
            throw new RuntimeException("Equipamento não está disponível para venda");
        }

        if (equipamento.getQtdEstoque() < quantidade) {
            throw new RuntimeException("Estoque insuficiente. Estoque atual: " + equipamento.getQtdEstoque());
        }

        equipamento.setQtdEstoque(equipamento.getQtdEstoque() - quantidade);
        if (equipamento.getQtdEstoque() <= 0) {
            equipamento.setDisponivelVenda(false);
        }
        equipamentoRepository.save(equipamento);

        return ItemVendaData.deEquipamento(equipamento, equipamento.getPreco());
    }

    private ItemVendaData carregarAula(Long itemId, Integer quantidade) {
        Aula aula = aulaRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));

        if (aula.getCapacidade() != null && aula.getCapacidade() < quantidade) {
            throw new RuntimeException("Capacidade insuficiente para a aula. Vagas: " + aula.getCapacidade());
        }

        if (aula.getCapacidade() != null) {
            aula.setCapacidade(aula.getCapacidade() - quantidade);
            aulaRepository.save(aula);
        }

        BigDecimal preco = aula.getPreco() != null ? aula.getPreco() : BigDecimal.ZERO;
        return ItemVendaData.deAula(aula, preco);
    }

    private ItemVendaData carregarTrip(Long itemId, Integer quantidade) {
        Trip trip = tripRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Trip não encontrada"));

        if (trip.getVagas() != null && trip.getVagas() < quantidade) {
            throw new RuntimeException("Vagas insuficientes para a trip. Vagas: " + trip.getVagas());
        }

        if (trip.getVagas() != null) {
            trip.setVagas(trip.getVagas() - quantidade);
            tripRepository.save(trip);
        }

        BigDecimal preco = trip.getPreco() != null ? trip.getPreco() : BigDecimal.ZERO;
        return ItemVendaData.deTrip(trip, preco);
    }

    private record ItemVendaData(Loja loja, Equipamento equipamento, Aula aula, Trip trip, BigDecimal preco) {
        static ItemVendaData deProduto(Loja loja, BigDecimal preco) {
            return new ItemVendaData(loja, null, null, null, preco);
        }

        static ItemVendaData deEquipamento(Equipamento equipamento, BigDecimal preco) {
            return new ItemVendaData(null, equipamento, null, null, preco);
        }

        static ItemVendaData deAula(Aula aula, BigDecimal preco) {
            return new ItemVendaData(null, null, aula, null, preco);
        }

        static ItemVendaData deTrip(Trip trip, BigDecimal preco) {
            return new ItemVendaData(null, null, null, trip, preco);
        }
    }
}
