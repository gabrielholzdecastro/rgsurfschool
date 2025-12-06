package br.com.julia.rgsurfschool.domain.model;

import br.com.julia.rgsurfschool.domain.enums.Condicao;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity(name = "tb_loja")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Loja {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(nullable = false)
    String nome;

    @Column(name = "qtd_estoque", nullable = false)
    Integer qtdEstoque;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    Condicao condicao;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal preco;

    @Column(nullable = false, precision = 10, scale = 2)
    BigDecimal custo;

    @Column(name = "data_aquisicao", nullable = false)
    LocalDate dataAquisicao;

    @Column(nullable = false)
    String fornecedor;

}

