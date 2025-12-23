package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity(name = "tb_guarderia")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Guarderia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_guarderia_id", nullable = false)
    private TipoGuarderia tipoGuarderia;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal valor;

    @Column(name = "data_inicio", nullable = false)
    private LocalDate dataInicio;

    @Column(name = "data_fim", nullable = false)
    private LocalDate dataFim;

    @Column(name = "data_vencimento", nullable = false)
    private LocalDate dataVencimento;

    @Column(nullable = false)
    private Boolean pago;

    @Column(name = "data_pagamento")
    private LocalDate dataPagamento;
}

