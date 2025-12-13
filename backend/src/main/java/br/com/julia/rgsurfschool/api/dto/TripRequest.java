package br.com.julia.rgsurfschool.api.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record TripRequest(
        String destino,
        String descricao,
        LocalDate dataSaida,
        LocalDate dataRetorno,
        BigDecimal preco,
        Integer vagas,
        List<Long> alunosIds
) {
}
