package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.TipoAulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.TipoAulaResponse;
import br.com.julia.rgsurfschool.api.dto.TipoAulaUpdateRequest;
import br.com.julia.rgsurfschool.api.mapper.TipoAulaMapper;
import br.com.julia.rgsurfschool.domain.model.TipoAula;
import br.com.julia.rgsurfschool.domain.repository.AulaRepository;
import br.com.julia.rgsurfschool.domain.repository.TipoAulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TipoAulaService {

    private final TipoAulaRepository tipoAulaRepository;
    private final AulaRepository aulaRepository;
    private final TipoAulaMapper tipoAulaMapper;

    @Transactional
    public TipoAulaResponse criar(TipoAulaCreateRequest request) {
        TipoAula tipoAula = tipoAulaMapper.toEntity(request);
        TipoAula tipoAulaSalvo = tipoAulaRepository.save(tipoAula);
        return tipoAulaMapper.toResponse(tipoAulaSalvo);
    }

    @Transactional(readOnly = true)
    public List<TipoAulaResponse> listar() {
        return tipoAulaRepository.findAll().stream()
                .map(tipoAulaMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public TipoAulaResponse buscarPorId(Long id) {
        return tipoAulaRepository.findById(id)
                .map(tipoAulaMapper::toResponse)
                .orElseThrow(() -> new RuntimeException("Tipo de aula não encontrado"));
    }

    @Transactional
    public TipoAulaResponse atualizar(Long id, TipoAulaUpdateRequest request) {
        TipoAula tipoAula = tipoAulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de aula não encontrado"));

        tipoAulaMapper.updateEntity(tipoAula, request);
        TipoAula tipoAulaAtualizado = tipoAulaRepository.save(tipoAula);
        return tipoAulaMapper.toResponse(tipoAulaAtualizado);
    }

    @Transactional
    public void deletar(Long id) {
        TipoAula tipoAula = tipoAulaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tipo de aula não encontrado"));

        // Verificar se há aulas usando este tipo
        boolean existeAulaComTipo = aulaRepository.existsByTipoAula(tipoAula);
        if (existeAulaComTipo) {
            throw new RuntimeException("Não é possível deletar tipo de aula que está sendo usado em aulas");
        }

        tipoAulaRepository.deleteById(id);
    }
}

