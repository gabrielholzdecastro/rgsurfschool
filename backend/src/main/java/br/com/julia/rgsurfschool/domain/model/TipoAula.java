package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity(name = "tb_tipo_aula")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TipoAula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nome;

    @Column(name = "valor_padrao", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPadrao;
}

