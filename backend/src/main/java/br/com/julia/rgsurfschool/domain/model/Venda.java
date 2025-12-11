package br.com.julia.rgsurfschool.domain.model;

import br.com.julia.rgsurfschool.domain.enums.MetodoPagamento;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.enums.TipoItemVenda;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity(name = "tb_venda")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Venda {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne
    @JoinColumn(name = "loja_id")
    Loja produto;

    @ManyToOne
    @JoinColumn(name = "equipamento_id")
    Equipamento equipamento;

    @ManyToOne
    @JoinColumn(name = "aula_id")
    Aula aula;

    @ManyToOne
    @JoinColumn(name = "trip_id")
    Trip trip;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_item", nullable = false)
    TipoItemVenda tipoItem;

    @ManyToOne
    @JoinColumn(name = "aluno_id")
    Aluno aluno;

    @Column(name = "nome_comprador")
    String nomeComprador;

    @Column(nullable = false)
    Integer quantidade;

    @Column(name = "valor_unitario", nullable = false, precision = 10, scale = 2)
    BigDecimal valorUnitario;

    @Column(name = "valor_total", nullable = false, precision = 10, scale = 2)
    BigDecimal valorTotal;

    @Enumerated(EnumType.STRING)
    @Column(name = "metodo_pagamento", nullable = false)
    MetodoPagamento metodoPagamento;

    @Enumerated(EnumType.STRING)
    @Column(name = "status_pagamento", nullable = false)
    StatusPagamento statusPagamento;

    @Column(name = "data_venda", nullable = false)
    LocalDateTime dataVenda;
}
