package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AulaResponse;
import br.com.julia.rgsurfschool.api.mapper.AulaMapper;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Aula;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepository;
    private final AlunoRepository alunoRepository;
    private final AulaMapper aulaMapper;

    @Transactional
    public AulaResponse criarAula(AulaCreateRequest request) {
        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Aula aula = Aula.builder()
                .aluno(aluno)
                .data(request.getData())
                .horaInicio(request.getHoraInicio())
                .horaFim(request.getHoraFim())
                .tipoAula(request.getTipoAula())
                .valor(request.getValor())
                .statusPagamento(request.getStatusPagamento())
                .build();

        Aula aulaSalva = aulaRepository.save(aula);
        return aulaMapper.toResponse(aulaSalva);
    }

    @Transactional(readOnly = true)
    public List<AulaResponse> listarAulas() {
        return aulaRepository.findAll().stream()
                .map(aulaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AulaResponse buscarPorId(Long id) {
        return aulaRepository.findById(id)
                .map(aulaMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));
    }

    @Transactional
    public void deletarAula(Long id) {
        if (!aulaRepository.existsById(id)) {
            throw new RuntimeException("Aula não encontrada");
        }
        aulaRepository.deleteById(id);
    }

    @Transactional
    public AulaResponse atualizarAula(Long id, AulaCreateRequest request) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));

        Aluno aluno = alunoRepository.findById(request.getAlunoId())
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        aula.setAluno(aluno);
        aula.setData(request.getData());
        aula.setHoraInicio(request.getHoraInicio());
        aula.setHoraFim(request.getHoraFim());
        aula.setTipoAula(request.getTipoAula());
        aula.setValor(request.getValor());
        aula.setStatusPagamento(request.getStatusPagamento());

        Aula aulaAtualizada = aulaRepository.save(aula);
        return aulaMapper.toResponse(aulaAtualizada);
    }

    @Transactional
    public void quitarAula(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aula não encontrada"));

        aula.setStatusPagamento(br.com.julia.rgsurfschool.domain.enums.StatusPagamento.PAGO);
        aulaRepository.save(aula);
    }
}
