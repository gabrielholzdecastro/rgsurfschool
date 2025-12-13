package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AulaResponse;
import br.com.julia.rgsurfschool.api.mapper.AulaMapper;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Aula;
import br.com.julia.rgsurfschool.domain.model.Professor;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.AulaRepository;
import br.com.julia.rgsurfschool.domain.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepository;
    private final AlunoRepository alunoRepository;
    private final ProfessorRepository professorRepository;
    private final AulaMapper aulaMapper;

    @Transactional
    public AulaResponse criarAula(AulaCreateRequest request) {
        Set<Professor> professores = carregarProfessores(request.getProfessoresIds());
        Set<Aluno> alunos = carregarAlunos(request);

        Aula aula = aulaMapper.toEntity(request, professores, alunos);

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

        Set<Professor> professores = carregarProfessores(request.getProfessoresIds());
        Set<Aluno> alunos = carregarAlunos(request);

        aulaMapper.updateEntity(aula, request, professores, alunos);

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

    private Set<Professor> carregarProfessores(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        Set<Long> idsUnicos = new HashSet<>(ids);
        List<Professor> professores = professorRepository.findAllById(idsUnicos);

        if (professores.size() != idsUnicos.size()) {
            throw new RuntimeException("Um ou mais professores não foram encontrados");
        }

        return new HashSet<>(professores);
    }

    private Set<Aluno> carregarAlunos(AulaCreateRequest request) {
        List<Long> idsSolicitados = new ArrayList<>();

        if (request.getAlunosIds() != null) {
            idsSolicitados.addAll(request.getAlunosIds());
        }
        if (request.getAlunoId() != null) {
            idsSolicitados.add(request.getAlunoId());
        }

        if (idsSolicitados.isEmpty()) {
            return new HashSet<>();
        }

        Set<Long> idsUnicos = new HashSet<>(idsSolicitados);
        List<Aluno> alunos = alunoRepository.findAllById(idsUnicos);

        if (alunos.size() != idsUnicos.size()) {
            throw new RuntimeException("Um ou mais alunos não foram encontrados");
        }

        return new HashSet<>(alunos);
    }
}
