package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

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

    @Column(length = 30)
    String telefone;

}
