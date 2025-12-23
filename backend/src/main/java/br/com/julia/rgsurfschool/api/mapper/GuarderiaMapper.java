package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.GuarderiaResponse;
import br.com.julia.rgsurfschool.domain.model.Guarderia;
import org.springframework.stereotype.Component;

@Component
public class GuarderiaMapper {

    public GuarderiaResponse toResponse(Guarderia guarderia) {
        return new GuarderiaResponse(
                guarderia.getId(),
                guarderia.getAluno().getId(),
                guarderia.getAluno().getNome(),
                guarderia.getTipoGuarderia().getId(),
                guarderia.getTipoGuarderia().getTipo(),
                guarderia.getValor(),
                guarderia.getDataInicio(),
                guarderia.getDataFim(),
                guarderia.getDataVencimento(),
                guarderia.getPago(),
                guarderia.getDataPagamento()
        );
    }
}

