package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.LojaRequest;
import br.com.julia.rgsurfschool.api.dto.LojaResponse;
import br.com.julia.rgsurfschool.api.mapper.LojaMapper;
import br.com.julia.rgsurfschool.domain.model.Loja;
import br.com.julia.rgsurfschool.domain.repository.LojaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LojaService {

    LojaRepository lojaRepository;

    public LojaService(LojaRepository lojaRepository) {
        this.lojaRepository = lojaRepository;
    }

    public List<LojaResponse> findAll() {
        List<Loja> lojas = lojaRepository.findAll();
        return lojas.stream()
                .map(LojaMapper::toResponse)
                .collect(Collectors.toList());
    }

    public LojaResponse create(LojaRequest request) {
        Loja loja = LojaMapper.toEntity(request);
        Loja lojaSalva = lojaRepository.save(loja);
        return LojaMapper.toResponse(lojaSalva);
    }

    public LojaResponse update(Long id, LojaRequest request) {
        if (!lojaRepository.existsById(id)) {
            throw new RuntimeException("Loja não encontrada com id: " + id);
        }
        
        Loja lojaAtualizada = LojaMapper.toEntity(request, id);
        Loja lojaSalva = lojaRepository.save(lojaAtualizada);
        return LojaMapper.toResponse(lojaSalva);
    }

    public void delete(Long id) {
        if (!lojaRepository.existsById(id)) {
            throw new RuntimeException("Loja não encontrada com id: " + id);
        }
        lojaRepository.deleteById(id);
    }

}

