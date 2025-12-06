package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.EvolutionWebhookRequest;
import br.com.julia.rgsurfschool.domain.enums.StatusPagamento;
import br.com.julia.rgsurfschool.domain.model.Mensagem;
import br.com.julia.rgsurfschool.domain.repository.MensagemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Service
public class MensagemService {

    private static final Logger logger = LoggerFactory.getLogger(MensagemService.class);

    private final MensagemRepository mensagemRepository;
    private final VendaService vendaService;
    private final String numeroMonitorado;

    public MensagemService(MensagemRepository mensagemRepository,
                           VendaService vendaService,
                           @Value("${evolution.api.numero-monitorado:}") String numeroMonitorado) {
        this.mensagemRepository = mensagemRepository;
        this.vendaService = vendaService;
        this.numeroMonitorado = numeroMonitorado;
    }

    public void processarWebhook(EvolutionWebhookRequest webhookRequest) {
        if (webhookRequest.event() == null || !webhookRequest.event().equalsIgnoreCase("messages.upsert")) {
            return;
        }

        if (webhookRequest.data() == null || webhookRequest.data().key() == null) {
            return;
        }

        EvolutionWebhookRequest.MessageKey key = webhookRequest.data().key();

        String remoteJid = key.remoteJid();
        String participant = key.participant();
        String texto = extrairTexto(webhookRequest.data().message());

        logger.info("Webhook recebido: remoteJid={}, participant={}, texto={}", remoteJid, participant, texto);
        
        // Processar apenas mensagens recebidas (não enviadas por nós)
        if (Boolean.TRUE.equals(key.fromMe())) {
            return;
        }

        String numeroRemetente = extrairNumero(key.remoteJid());
        String messageId = key.id();
        LocalDateTime dataRecebimento = converterTimestamp(webhookRequest.data().messageTimestamp());

        Mensagem mensagem = Mensagem.builder()
                .numeroRemetente(numeroRemetente)
                .texto(texto)
                .dataRecebimento(dataRecebimento != null ? dataRecebimento : LocalDateTime.now())
                .tipo(webhookRequest.data().messageType())
                .fromMe(key.fromMe())
                .messageId(messageId)
                .build();

        mensagemRepository.save(mensagem);

        // Processar mensagens apenas se vierem do grupo monitorado
        if (numeroMonitorado != null && !numeroMonitorado.isEmpty() && numeroMonitorado.equals(key.remoteJid())) {
            
            if (texto != null) {
                String textoUpper = texto.trim().toUpperCase();
                // Comandos Financeiros: PAGO {id} ou PENDENTE {id}
                if (textoUpper.startsWith("PAGO ") || textoUpper.startsWith("PENDENTE ")) {
                    processarComandoFinanceiro(texto);
                }
            }
        }
    }

    private void processarComandoFinanceiro(String texto) {
        // Formato: PAGO {id_venda} ou PENDENTE {id_venda}
        String[] partes = texto.trim().split("\\s+");
        if (partes.length < 2) {
            logger.warn("Comando FINANCEIRO incompleto: {}", texto);
            return;
        }

        try {
            String comando = partes[0].toUpperCase();
            Long idVenda = Long.parseLong(partes[1]);
            
            StatusPagamento status = comando.equals("PAGO") ? StatusPagamento.PAGO : StatusPagamento.PENDENTE;
            
            vendaService.atualizarStatusPagamento(idVenda, status);
            logger.info("Venda ID {} atualizada para status {}", idVenda, status);
        } catch (NumberFormatException e) {
            logger.error("ID inválido no comando FINANCEIRO: {}", texto);
        } catch (RuntimeException e) {
            logger.error("Erro ao processar comando FINANCEIRO: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Erro inesperado ao processar comando FINANCEIRO: {}", e.getMessage());
        }
    }

    private String extrairNumero(String remoteJid) {
        if (remoteJid == null) {
            return null;
        }
        // Remove @s.whatsapp.net ou @g.us do final
        return remoteJid.split("@")[0];
    }

    private String extrairTexto(EvolutionWebhookRequest.MessageContent message) {
        if (message == null) {
            return null;
        }
        if (message.conversation() != null) {
            return message.conversation();
        }
        if (message.extendedTextMessage() != null && message.extendedTextMessage().text() != null) {
            return message.extendedTextMessage().text();
        }
        return null;
    }

    private LocalDateTime converterTimestamp(Long timestamp) {
        if (timestamp == null) {
            return null;
        }
        return LocalDateTime.ofInstant(Instant.ofEpochSecond(timestamp), ZoneId.systemDefault());
    }
}
