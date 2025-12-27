package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
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
    private final AlunoService alunoService;
    private final String numeroMonitorado;

    public MensagemService(MensagemRepository mensagemRepository,
            VendaService vendaService,
            AlunoService alunoService,
            @Value("${evolution.api.numero-monitorado:}") String numeroMonitorado) {
        this.mensagemRepository = mensagemRepository;
        this.vendaService = vendaService;
        this.alunoService = alunoService;
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

        // 1. Processar apenas mensagens recebidas (não enviadas por nós)
        if (Boolean.TRUE.equals(key.fromMe())) {
            return;
        }

        // 2. Verificar se vem do grupo monitorado
        if (numeroMonitorado == null || !numeroMonitorado.equals(key.remoteJid())) {
            return; // Ignora mensagens de outras origens
        }

        String texto = extrairTexto(webhookRequest.data().message());
        if (texto == null) {
            return;
        }

        String textoUpper = texto.trim().toUpperCase();

        // 3. Verificar se é um comando válido
        if (!textoUpper.startsWith("PAGO ") && !textoUpper.startsWith("PENDENTE ") && !textoUpper.startsWith("ALUNO ")) {
            return; // Ignora mensagens que não são comandos
        }

        String remoteJid = key.remoteJid();
        String participant = key.participant();

        logger.info("Webhook recebido: remoteJid={}, participant={}, texto={}", remoteJid, participant, texto);

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

        // 4. Salvar apenas mensagens válidas
        mensagemRepository.save(mensagem);

        // 5. Executar lógica
        if (textoUpper.startsWith("ALUNO ")) {
            processarComandoAluno(texto.trim());
        } else {
            processarComandoFinanceiro(texto);
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

    private void processarComandoAluno(String texto) {
        // Formato: ALUNO nome ou ALUNO nome email ou ALUNO nome email telefone
        // Remove "ALUNO " ou "aluno " (case insensitive) e espaços extras
        String textoSemPrefixo = texto.replaceFirst("(?i)^aluno\\s+", "").trim();
        if (textoSemPrefixo.isEmpty()) {
            logger.warn("Comando ALUNO incompleto: nome não fornecido. Texto: {}", texto);
            return;
        }

        String[] partes = textoSemPrefixo.split("\\s+", 3);
        String nome = partes[0];
        String email = null;
        String telefone = null;

        if (partes.length >= 2) {
            email = partes[1];
        }
        if (partes.length >= 3) {
            telefone = partes[2];
        }

        try {
            AlunoCreateRequest request = new AlunoCreateRequest(nome, email, telefone);
            alunoService.create(request);
            logger.info("Aluno cadastrado com sucesso: nome={}, email={}, telefone={}", nome, email, telefone);
        } catch (RuntimeException e) {
            logger.error("Erro ao processar comando ALUNO: {}", e.getMessage());
        } catch (Exception e) {
            logger.error("Erro inesperado ao processar comando ALUNO: {}", e.getMessage());
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
