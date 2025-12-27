package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity(name = "tb_produto")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String nome;

    @Column(name = "qtd_estoque", nullable = false)
    Integer qtdEstoque;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal preco;

    @Column(precision = 10, scale = 2)
    BigDecimal custo;

    @Column(name = "data_aquisicao")
    LocalDate dataAquisicao;

    @Column
    String fornecedor;

}

