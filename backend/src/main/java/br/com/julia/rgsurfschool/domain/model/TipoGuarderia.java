package br.com.julia.rgsurfschool.domain.model;

import br.com.julia.rgsurfschool.domain.enums.TempoGuarderia;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity(name = "tb_tipo_guarderia")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class TipoGuarderia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private TempoGuarderia tipo;

    @Column(name = "valor_padrao", nullable = false, precision = 10, scale = 2)
    private BigDecimal valorPadrao;
}

