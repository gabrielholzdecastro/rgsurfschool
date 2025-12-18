package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AlunoCreateResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoFindAllResponse;
import br.com.julia.rgsurfschool.api.dto.AlunoUpdateRequest;
import br.com.julia.rgsurfschool.api.mapper.AlunoMapper;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlunoService {

    AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    @Transactional(readOnly = true)
    public List<AlunoFindAllResponse> findAll() {
        List<Aluno> alunos = alunoRepository.findAll();
        return alunos.stream()
                .map(AlunoMapper::toFindAllResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public AlunoFindAllResponse findById(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        return AlunoMapper.toFindAllResponse(aluno);
    }

    @Transactional
    public AlunoCreateResponse create(AlunoCreateRequest request) {
        Aluno aluno = AlunoMapper.toEntity(request);
        Aluno alunoSalvo = alunoRepository.save(aluno);
        return AlunoMapper.toCreateResponse(alunoSalvo);
    }

    @Transactional
    public AlunoCreateResponse update(Long id, AlunoUpdateRequest request) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));
        
        AlunoMapper.updateEntity(aluno, request);
        Aluno alunoAtualizado = alunoRepository.save(aluno);
        return AlunoMapper.toCreateResponse(alunoAtualizado);
    }

    @Transactional
    public void delete(Long id) {
        if (!alunoRepository.existsById(id)) {
            throw new RuntimeException("Aluno não encontrado");
        }
        alunoRepository.deleteById(id);
    }

}
