package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.MensagemResponse;
import br.com.julia.rgsurfschool.domain.model.Mensagem;

public class MensagemMapper {

    public static MensagemResponse toResponse(Mensagem mensagem) {
        return new MensagemResponse(
                mensagem.getId(),
                mensagem.getNumeroRemetente(),
                mensagem.getTexto(),
                mensagem.getDataRecebimento(),
                mensagem.getTipo()
        );
    }
}

