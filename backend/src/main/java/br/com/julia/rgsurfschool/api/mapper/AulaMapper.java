package br.com.julia.rgsurfschool.api.mapper;

import br.com.julia.rgsurfschool.api.dto.AlunoResumoResponse;
import br.com.julia.rgsurfschool.api.dto.AulaCreateRequest;
import br.com.julia.rgsurfschool.api.dto.AulaResponse;
import br.com.julia.rgsurfschool.api.dto.ProfessorResponse;
import br.com.julia.rgsurfschool.domain.model.Aluno;
import br.com.julia.rgsurfschool.domain.model.Aula;
import br.com.julia.rgsurfschool.domain.model.Professor;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
public class AulaMapper {

    public Aula toEntity(AulaCreateRequest request, Set<Professor> professores, Set<Aluno> alunos) {
        return Aula.builder()
                .titulo(definirTitulo(request))
                .descricao(request.getDescricao())
                .data(request.getData())
                .horaInicio(request.getHoraInicio())
                .horaFim(request.getHoraFim())
                .tipoAula(request.getTipoAula())
                .preco(request.getValor())
                .statusPagamento(request.getStatusPagamento())
                .capacidade(request.getCapacidade())
                .professores(professores)
                .alunos(alunos)
                .build();
    }

    public void updateEntity(Aula aula, AulaCreateRequest request, Set<Professor> professores, Set<Aluno> alunos) {
        aula.setTitulo(definirTitulo(request));
        aula.setDescricao(request.getDescricao());
        aula.setData(request.getData());
        aula.setHoraInicio(request.getHoraInicio());
        aula.setHoraFim(request.getHoraFim());
        aula.setTipoAula(request.getTipoAula());
        aula.setPreco(request.getValor());
        aula.setStatusPagamento(request.getStatusPagamento());
        aula.setCapacidade(request.getCapacidade());
        aula.setProfessores(professores);
        aula.setAlunos(alunos);
    }

    public AulaResponse toResponse(Aula aula) {
        List<ProfessorResponse> professores = aula.getProfessores().stream()
                .map(ProfessorMapper::toResponse)
                .collect(Collectors.toList());

        List<AlunoResumoResponse> alunos = aula.getAlunos().stream()
                .map(AulaMapper::toAlunoResumo)
                .collect(Collectors.toList());

        return new AulaResponse(
                aula.getId(),
                aula.getTitulo(),
                aula.getDescricao(),
                aula.getData(),
                aula.getHoraInicio(),
                aula.getHoraFim(),
                calcularDuracaoEmMinutos(aula.getHoraInicio(), aula.getHoraFim()),
                aula.getTipoAula(),
                aula.getPreco(),
                aula.getStatusPagamento(),
                aula.getCapacidade(),
                professores,
                alunos
        );
    }

    private static AlunoResumoResponse toAlunoResumo(Aluno aluno) {
        return new AlunoResumoResponse(
                aluno.getId(),
                aluno.getNome()
        );
    }

    private String definirTitulo(AulaCreateRequest request) {
        if (request.getTitulo() != null && !request.getTitulo().isBlank()) {
            return request.getTitulo();
        }
        if (request.getTipoAula() != null && request.getData() != null) {
            return request.getTipoAula().name() + " - " + request.getData();
        }
        return "Aula";
    }

    private Integer calcularDuracaoEmMinutos(java.time.LocalTime inicio, java.time.LocalTime fim) {
        if (inicio == null || fim == null) {
            return null;
        }
        return (int) Duration.between(inicio, fim).toMinutes();
    }
}
