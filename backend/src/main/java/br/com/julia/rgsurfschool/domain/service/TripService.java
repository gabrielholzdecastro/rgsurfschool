package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.TripRequest;
import br.com.julia.rgsurfschool.api.dto.TripResponse;
import br.com.julia.rgsurfschool.api.mapper.TripMapper;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Trip;
import br.com.julia.rgsurfschool.domain.repository.AlunoRepository;
import br.com.julia.rgsurfschool.domain.repository.TripRepository;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final AlunoRepository alunoRepository;

    public TripService(TripRepository tripRepository, AlunoRepository alunoRepository) {
        this.tripRepository = tripRepository;
        this.alunoRepository = alunoRepository;
    }

    public List<TripResponse> findAll() {
        return tripRepository.findAll().stream()
                .map(TripMapper::toResponse)
                .collect(Collectors.toList());
    }

    public TripResponse findById(Long id) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip não encontrada com id: " + id));
        return TripMapper.toResponse(trip);
    }

    public TripResponse create(TripRequest request) {
        Set<Aluno> alunos = carregarAlunos(request.alunosIds());
        Trip trip = TripMapper.toEntity(request, alunos);
        Trip salvo = tripRepository.save(trip);
        return TripMapper.toResponse(salvo);
    }

    public TripResponse update(Long id, TripRequest request) {
        Trip trip = tripRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trip não encontrada com id: " + id));

        Set<Aluno> alunos = carregarAlunos(request.alunosIds());
        TripMapper.updateEntity(trip, request, alunos);
        Trip salvo = tripRepository.save(trip);
        return TripMapper.toResponse(salvo);
    }

    public void delete(Long id) {
        if (!tripRepository.existsById(id)) {
            throw new RuntimeException("Trip não encontrada com id: " + id);
        }
        tripRepository.deleteById(id);
    }

    private Set<Aluno> carregarAlunos(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            return new HashSet<>();
        }

        List<Aluno> encontrados = alunoRepository.findAllById(ids);
        if (encontrados.size() != ids.size()) {
            throw new RuntimeException("Algum aluno informado não foi encontrado");
        }
        return new HashSet<>(encontrados);
    }
}
