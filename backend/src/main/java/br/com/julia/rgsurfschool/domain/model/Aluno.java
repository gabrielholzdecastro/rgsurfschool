package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity(name = "tb_aluno")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String nome;

    String email;

    @Column(nullable = false, length = 30)
    String telefone;

    @Enumerated(EnumType.STRING)
    @Column(name = "nivel_aluno")
    NivelAluno nivelAluno;

    @Column(name = "data_inicio")
    LocalDate dataInicio;

}
