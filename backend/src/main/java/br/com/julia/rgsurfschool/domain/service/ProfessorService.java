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

    private final ProfessorRepository professorRepository;

    public ProfessorService(ProfessorRepository professorRepository) {
        this.professorRepository = professorRepository;
    }

    public List<ProfessorResponse> findAll() {
        return professorRepository.findAll().stream()
                .map(ProfessorMapper::toResponse)
                .collect(Collectors.toList());
    }

    public ProfessorResponse findById(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com id: " + id));
        return ProfessorMapper.toResponse(professor);
    }

    public ProfessorResponse create(ProfessorRequest request) {
        Professor professor = ProfessorMapper.toEntity(request);
        Professor salvo = professorRepository.save(professor);
        return ProfessorMapper.toResponse(salvo);
    }

    public ProfessorResponse update(Long id, ProfessorRequest request) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Professor não encontrado com id: " + id));

        ProfessorMapper.updateEntity(professor, request);
        Professor salvo = professorRepository.save(professor);
        return ProfessorMapper.toResponse(salvo);
    }

    public void delete(Long id) {
        if (!professorRepository.existsById(id)) {
            throw new RuntimeException("Professor não encontrado com id: " + id);
        }
        professorRepository.deleteById(id);
    }
}
