package br.com.julia.rgsurfschool.api.dto;

import java.time.LocalDateTime;

public record MensagemResponse(
        Long id,
        String numeroRemetente,
        String texto,
        LocalDateTime dataRecebimento,
        String tipo
) {
}

