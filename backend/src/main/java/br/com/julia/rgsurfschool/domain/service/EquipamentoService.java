package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.EquipamentoRequest;
import br.com.julia.rgsurfschool.api.dto.EquipamentoResponse;
import br.com.julia.rgsurfschool.api.mapper.EquipamentoMapper;
import br.com.julia.rgsurfschool.domain.model.Equipamento;
import br.com.julia.rgsurfschool.domain.repository.EquipamentoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EquipamentoService {

    private final EquipamentoRepository equipamentoRepository;

    public EquipamentoService(EquipamentoRepository equipamentoRepository) {
        this.equipamentoRepository = equipamentoRepository;
    }

    public List<EquipamentoResponse> findAll() {
        return equipamentoRepository.findAll().stream()
                .map(EquipamentoMapper::toResponse)
                .collect(Collectors.toList());
    }

    public EquipamentoResponse findById(Long id) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado com id: " + id));
        return EquipamentoMapper.toResponse(equipamento);
    }

    public EquipamentoResponse create(EquipamentoRequest request) {
        Equipamento equipamento = EquipamentoMapper.toEntity(request);
        Equipamento salvo = equipamentoRepository.save(equipamento);
        return EquipamentoMapper.toResponse(salvo);
    }

    public EquipamentoResponse update(Long id, EquipamentoRequest request) {
        Equipamento equipamento = equipamentoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Equipamento não encontrado com id: " + id));

        EquipamentoMapper.updateEntity(equipamento, request);
        Equipamento salvo = equipamentoRepository.save(equipamento);
        return EquipamentoMapper.toResponse(salvo);
    }

    public void delete(Long id) {
        if (!equipamentoRepository.existsById(id)) {
            throw new RuntimeException("Equipamento não encontrado com id: " + id);
        }
        equipamentoRepository.deleteById(id);
    }
}
