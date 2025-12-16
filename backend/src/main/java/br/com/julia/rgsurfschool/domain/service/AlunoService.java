package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AlunoCreateResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoFindAllResponse;
import br.com.julia.rgsurfschool.api.mapper.AlunoMapper;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public List<AlunoFindAllResponse> findAll() {
        List<Aluno> alunos = alunoRepository.findAll();
        return alunos.stream()
                .map(AlunoMapper::toFindAllResponse)
                .collect(Collectors.toList());
    }

    public AlunoCreateResponse create(AlunoCreateRequest request) {
        Aluno aluno = AlunoMapper.toEntity(request);
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return AlunoMapper.toCreateResponse(alunoSalvo);
    }

}
