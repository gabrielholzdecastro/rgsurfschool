package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.AlunoResumoResponse;
import br.com.julia.rgsurfschool.api.dto.TripRequest;
import br.com.julia.rgsurfschool.api.dto.TripResponse;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Trip;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public class TripMapper {

    public static Trip toEntity(TripRequest request, Set<Aluno> alunos) {
        return Trip.builder()
                .destino(request.destino())
                .descricao(request.descricao())
                .dataSaida(request.dataSaida())
                .dataRetorno(request.dataRetorno())
                .preco(request.preco())
                .vagas(request.vagas())
                .alunos(alunos)
                .build();
    }

    public static void updateEntity(Trip trip, TripRequest request, Set<Aluno> alunos) {
        trip.setDestino(request.destino());
        trip.setDescricao(request.descricao());
        trip.setDataSaida(request.dataSaida());
        trip.setDataRetorno(request.dataRetorno());
        trip.setPreco(request.preco());
        trip.setVagas(request.vagas());
        trip.setAlunos(alunos);
    }

    public static TripResponse toResponse(Trip trip) {
        List<AlunoResumoResponse> alunos = trip.getAlunos().stream()
                .map(TripMapper::toAlunoResumo)
                .collect(Collectors.toList());

        return new TripResponse(
                trip.getId(),
                trip.getDestino(),
                trip.getDescricao(),
                trip.getDataSaida(),
                trip.getDataRetorno(),
                trip.getPreco(),
                trip.getVagas(),
                alunos
        );
    }

    private static AlunoResumoResponse toAlunoResumo(Aluno aluno) {
        return new AlunoResumoResponse(aluno.getId(), aluno.getNome());
    }
}
