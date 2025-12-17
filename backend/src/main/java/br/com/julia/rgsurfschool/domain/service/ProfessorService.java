package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.ProfessorRequest;
import br.com.julia.rgsurfschool.api.dto.ProfessorResponse;
import br.com.julia.rgsurfschool.api.mapper.ProfessorMapper;
import br.com.julia.rgsurfschool.domain.model.Professor;
import br.com.julia.rgsurfschool.domain.repository.ProfessorRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProfessorService {

    ProfessorRepository professorRepository;

    public ProfessorService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    public List<ProfessorResponse> findAll() {
        List<Professor> professores = professorRepository.findAll();
        return professores.stream()
                .map(ProfessorMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProfessorResponse create(ProfessorRequest request) {
        Professor professor = ProfessorMapper.toEntity(request);
        Professor professorSalvo = professorRepository.save(professor);
        return ProfessorMapper.toResponse(professorSalvo);
    }

    public ProfessorResponse update(Long id, ProfessorRequest request) {
        if (!professorRepository.existsById(id)) {
            throw new RuntimeException("Professor não encontrado com id: " + id);
        }
        
        Professor professorAtualizado = ProfessorMapper.toEntity(request, id);
        Professor professorSalvo = professorRepository.save(professorAtualizado);
        return ProfessorMapper.toResponse(professorSalvo);
    }

    public void delete(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new RuntimeException("Professor não encontrado com id: " + id);
        }
        professorRepository.deleteById(id);
    }

}

