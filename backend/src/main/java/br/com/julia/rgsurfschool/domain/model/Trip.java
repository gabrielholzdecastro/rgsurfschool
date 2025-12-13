package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "tb_trip")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Trip {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String destino;

    String descricao;

    @Column(name = "data_saida")
    LocalDate dataSaida;

    @Column(name = "data_retorno")
    LocalDate dataRetorno;

    @Column(precision = 10, scale = 2)
    BigDecimal preco;

    Integer vagas;

    @ManyToMany
    @JoinTable(
            name = "tb_trip_aluno",
            joinColumns = @JoinColumn(name = "trip_id"),
            inverseJoinColumns = @JoinColumn(name = "aluno_id")
    )
    @Builder.Default
    Set<Aluno> alunos = new HashSet<>();
}
