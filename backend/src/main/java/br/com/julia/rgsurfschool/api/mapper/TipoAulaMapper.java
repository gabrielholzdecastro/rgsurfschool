package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.TipoAulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.TipoAulaResponse;
import br.com.julia.rgsurfschool.api.dto.TipoAulaUpdateRequest;
import br.com.julia.rgsurfschool.domain.model.TipoAula;
import org.springframework.stereotype.Component;

@Component
public class TipoAulaMapper {

    public TipoAula toEntity(TipoAulaCreateRequest request) {
        return TipoAula.builder()
                .nome(request.getNome())
                .valorPadrao(request.getValorPadrao())
                .build();
    }

    public TipoAulaResponse toResponse(TipoAula tipoAula) {
        return new TipoAulaResponse(
                tipoAula.getId(),
                tipoAula.getNome(),
                tipoAula.getValorPadrao()
        );
    }

    public void updateEntity(TipoAula tipoAula, TipoAulaUpdateRequest request) {
        if (request.getNome() != null) {
            tipoAula.setNome(request.getNome());
        }
        if (request.getValorPadrao() != null) {
            tipoAula.setValorPadrao(request.getValorPadrao());
        }
    }
}

