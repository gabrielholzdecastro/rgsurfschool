package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.GuarderiaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.GuarderiaResponse;
import br.com.julia.rgsurfschool.api.dto.GuarderiaUpdateRequest;
import br.com.julia.rgsurfschool.api.mapper.GuarderiaMapper;
import br.com.julia.rgsurfschool.domain.enums.TempoGuarderia;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Guarderia;
import br.com.julia.rgsurfschool.domain.model.TipoGuarderia;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.GuarderiaRepository;
import br.com.julia.rgsurfschool.domain.repository.TipoGuarderiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GuarderiaService {

    private final GuarderiaRepository guarderiaRepository;
    private final AlunoRepository alunoRepository;
    private final TipoGuarderiaRepository tipoGuarderiaRepository;
    private final GuarderiaMapper guarderiaMapper;

    @Transactional(readOnly = true)
    public List<GuarderiaResponse> listar() {
        return guarderiaRepository.findAll().stream()
                .map(guarderiaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public GuarderiaResponse buscarPorId(Long id) {
        return guarderiaRepository.findById(id)
                .map(guarderiaMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Guarderia não encontrada"));
    }

    @Transactional
    public GuarderiaResponse criar(GuarderiaCreateRequest request) {
        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        TipoGuarderia tipoGuarderia = tipoGuarderiaRepository.findById(request.getTipoGuarderiaId())
                .orElseThrow(() -> new RuntimeException("Tipo de guarderia não encontrado"));

        LocalDate dataInicio = request.getDataInicio() != null ? request.getDataInicio() : LocalDate.now();
        LocalDate dataFim = calcularDataFim(dataInicio, tipoGuarderia.getTipo());
        LocalDate dataVencimento = calcularDataVencimento(dataInicio, tipoGuarderia.getTipo());
        
        Boolean pago = request.getPago() != null ? request.getPago() : false;
        LocalDate dataPagamento = pago ? LocalDate.now() : null;

        Guarderia guarderia = Guarderia.builder()
                .aluno(aluno)
                .tipoGuarderia(tipoGuarderia)
                .valor(request.getValor())
                .dataInicio(dataInicio)
                .dataFim(dataFim)
                .dataVencimento(dataVencimento)
                .pago(pago)
                .dataPagamento(dataPagamento)
                .build();

        Guarderia guarderiaSalva = guarderiaRepository.save(guarderia);
        return guarderiaMapper.toResponse(guarderiaSalva);
    }

    @Transactional
    public GuarderiaResponse atualizar(Long id, GuarderiaUpdateRequest request) {
        Guarderia guarderia = guarderiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Guarderia não encontrada"));

        if (request.getAlunoId() != null) {
            Aluno aluno = alunoRepository.findById(request.getAlunoId())
                    .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
            guarderia.setAluno(aluno);
        }

        TipoGuarderia tipoGuarderiaAnterior = guarderia.getTipoGuarderia();
        TipoGuarderia tipoGuarderiaNovo = null;
        
        if (request.getTipoGuarderiaId() != null) {
            tipoGuarderiaNovo = tipoGuarderiaRepository.findById(request.getTipoGuarderiaId())
                    .orElseThrow(() -> new RuntimeException("Tipo de guarderia não encontrado"));
            guarderia.setTipoGuarderia(tipoGuarderiaNovo);
        }

        if (request.getValor() != null) {
            guarderia.setValor(request.getValor());
        }

        LocalDate dataInicio = request.getDataInicio() != null ? request.getDataInicio() : guarderia.getDataInicio();
        guarderia.setDataInicio(dataInicio);

        TipoGuarderia tipoParaCalculo = tipoGuarderiaNovo != null ? tipoGuarderiaNovo : tipoGuarderiaAnterior;
        LocalDate dataFim = calcularDataFim(dataInicio, tipoParaCalculo.getTipo());
        LocalDate dataVencimento = calcularDataVencimento(dataInicio, tipoParaCalculo.getTipo());
        
        guarderia.setDataFim(dataFim);
        
        if (request.getPago() != null) {
            Boolean pagoAnterior = guarderia.getPago();
            guarderia.setPago(request.getPago());
            
            if (request.getPago() && !pagoAnterior) {
                // Se foi marcado como pago, atualizar data de vencimento para próximo mês a partir da data atual
                dataVencimento = guarderia.getDataVencimento().plusMonths(1);
                guarderia.setDataPagamento(LocalDate.now());
            } else if (!request.getPago()) {
                guarderia.setDataPagamento(null);
                // Recalcular data de vencimento baseado no tipo quando desmarcar como pago
                dataVencimento = calcularDataVencimento(dataInicio, tipoParaCalculo.getTipo());
            }
        }
        
        guarderia.setDataVencimento(dataVencimento);

        Guarderia guarderiaAtualizada = guarderiaRepository.save(guarderia);
        return guarderiaMapper.toResponse(guarderiaAtualizada);
    }

    @Transactional
    public void deletar(Long id) {
        if (!guarderiaRepository.existsById(id)) {
            throw new RuntimeException("Guarderia não encontrada");
        }
        guarderiaRepository.deleteById(id);
    }

    private LocalDate calcularDataFim(LocalDate dataInicio, TempoGuarderia tipo) {
        return switch (tipo) {
            case DIARIA -> dataInicio.plusDays(1);
            case MENSAL -> dataInicio.plusMonths(1);
            case TRIMESTRAL -> dataInicio.plusMonths(3);
            case ANUAL -> dataInicio.plusYears(1);
        };
    }

    private LocalDate calcularDataVencimento(LocalDate dataInicio, TempoGuarderia tipo) {
        return switch (tipo) {
            case DIARIA -> dataInicio.plusDays(1);
            case MENSAL -> dataInicio.plusMonths(1);
            case TRIMESTRAL -> dataInicio.plusMonths(1); // primeira parcela
            case ANUAL -> dataInicio.plusMonths(1); // primeira parcela
        };
    }
}

