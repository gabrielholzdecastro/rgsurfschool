package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AlunoCreateResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoFindAllResponse;
import br.com.julia.rgsurfschool.api.mapper.AlunoMapper;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.AulaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final AulaRepository aulaRepository;

    public AlunoService(AlunoRepository alunoRepository, AulaRepository aulaRepository) {
        this.alunoRepository = alunoRepository;
        this.aulaRepository = aulaRepository;
    }

    public List<AlunoFindAllResponse> findAll() {
        List<Aluno> alunos = alunoRepository.findAll();
        return alunos.stream()
                .map(aluno -> {
                    LocalDate dataUltimaAula = buscarDataUltimaAula(aluno.getId());
                    boolean ativo = isAtivo(dataUltimaAula);
                    return AlunoMapper.toFindAllResponse(aluno, ativo, dataUltimaAula);
                })
                .collect(Collectors.toList());
    }

    public AlunoCreateResponse create(AlunoCreateRequest request) {
        Aluno aluno = AlunoMapper.toEntity(request);
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return AlunoMapper.toCreateResponse(alunoSalvo);
    }

    private LocalDate buscarDataUltimaAula(Long alunoId) {
        return aulaRepository.findUltimaDataAulaByAlunoId(alunoId);
    }

    private boolean isAtivo(LocalDate dataUltimaAula) {
        if (dataUltimaAula == null) {
            return false;
        }
        return dataUltimaAula.isAfter(LocalDate.now().minusMonths(1));
    }

}
