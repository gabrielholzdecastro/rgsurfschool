package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.TipoGuarderiaResponse;
import br.com.julia.rgsurfschool.api.dto.TipoGuarderiaUpdateRequest;
import br.com.julia.rgsurfschool.api.mapper.TipoGuarderiaMapper;
import br.com.julia.rgsurfschool.domain.model.TipoGuarderia;
import br.com.julia.rgsurfschool.domain.repository.TipoGuarderiaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TipoGuarderiaService {

    private final TipoGuarderiaRepository tipoGuarderiaRepository;
    private final TipoGuarderiaMapper tipoGuarderiaMapper;

    @Transactional(readOnly = true)
    public List<TipoGuarderiaResponse> listar() {
        return tipoGuarderiaRepository.findAll().stream()
                .map(tipoGuarderiaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoGuarderiaResponse buscarPorId(Long id) {
        return tipoGuarderiaRepository.findById(id)
                .map(tipoGuarderiaMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Tipo de guarderia não encontrado"));
    }

    @Transactional
    public TipoGuarderiaResponse atualizar(Long id, TipoGuarderiaUpdateRequest request) {
        TipoGuarderia tipoGuarderia = tipoGuarderiaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de guarderia não encontrado"));

        tipoGuarderiaMapper.updateEntity(tipoGuarderia, request);
        TipoGuarderia tipoGuarderiaAtualizado = tipoGuarderiaRepository.save(tipoGuarderia);
        return tipoGuarderiaMapper.toResponse(tipoGuarderiaAtualizado);
    }
}

