package br.com.julia.rgsurfschool.domain.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity(name = "tb_mensagem")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Mensagem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @Column(name = "numero_remetente", nullable = false)
    String numeroRemetente;

    @Column(columnDefinition = "TEXT")
    String texto;

    @Column(name = "data_recebimento", nullable = false)
    LocalDateTime dataRecebimento;

    @Column(name = "tipo")
    String tipo;

    @Column(name = "from_me")
    Boolean fromMe;

    @Column(name = "message_id")
    String messageId;

}

