package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.TipoGuarderiaResponse;
import br.com.julia.rgsurfschool.api.dto.TipoGuarderiaUpdateRequest;
import br.com.julia.rgsurfschool.domain.model.TipoGuarderia;
import org.springframework.stereotype.Component;

@Component
public class TipoGuarderiaMapper {

    public TipoGuarderiaResponse toResponse(TipoGuarderia tipoGuarderia) {
        return new TipoGuarderiaResponse(
                tipoGuarderia.getId(),
                tipoGuarderia.getTipo(),
                tipoGuarderia.getValorPadrao()
        );
    }

    public void updateEntity(TipoGuarderia tipoGuarderia, TipoGuarderiaUpdateRequest request) {
        if (request.getValorPadrao() != null) {
            tipoGuarderia.setValorPadrao(request.getValorPadrao());
        }
    }
}

