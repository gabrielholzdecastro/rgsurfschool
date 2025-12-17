package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

@Entity(name = "tb_professor")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Professor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String nome;

    String email;

    String telefone;

}

