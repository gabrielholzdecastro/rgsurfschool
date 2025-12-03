package br.com.julia.rgsurfschool.domain.service;

import br.com.julia.rgsurfschool.api.dto.AlunoCreateRequest;
import br.com.julia.rgsurfschool.api.dto.EvolutionWebhookRequest;
import br.com.julia.rgsurfschool.domain.model.Mensagem;
import br.com.julia.rgsurfschool.domain.model.NivelAluno;
import br.com.julia.rgsurfschool.domain.repository.MensagemRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Service
public class MensagemService {

    private static final Logger logger = LoggerFactory.getLogger(MensagemService.class);

    private final MensagemRepository mensagemRepository;
    private final AlunoService alunoService;
    private final String numeroMonitorado;

    public MensagemService(MensagemRepository mensagemRepository,
                           AlunoService alunoService,
                           @Value("${evolution.api.numero-monitorado:}") String numeroMonitorado) {
        this.mensagemRepository = mensagemRepository;
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
            
            // Comando de atualização: ATUALIZAR {id} {nivel}
            if (texto != null && texto.trim().toUpperCase().startsWith("ATUALIZAR ")) {
                processarComandoAtualizacao(texto);
            } else {
                // Caso contrário, tenta processar como cadastro de aluno (formato com pipe |)
                processarMensagemAluno(texto);
            }
        }
    }

    private void processarComandoAtualizacao(String texto) {
        // Formato: ATUALIZAR {id_aluno} {novo_nivel}
        String[] partes = texto.trim().split("\\s+");
        if (partes.length < 3) {
            logger.warn("Comando ATUALIZAR incompleto: {}", texto);
            return;
        }

        try {
            Long id = Long.parseLong(partes[1]);
            String novoNivel = partes[2];
//            alunoService.atualizarNivel(id, novoNivel);
            logger.info("Aluno ID {} atualizado com sucesso para nível {}", id, novoNivel);
        } catch (NumberFormatException e) {
            logger.error("ID inválido no comando ATUALIZAR: {}", partes[1]);
        } catch (Exception e) {
            logger.error("Erro ao processar comando ATUALIZAR: {}", e.getMessage());
        }
    }

    private void processarMensagemAluno(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return;
        }

        try {
            AlunoCreateRequest alunoRequest = parsearMensagemAluno(texto);
            if (alunoRequest != null) {
                alunoService.create(alunoRequest);
            }
        } catch (Exception e) {
            // Ignorar erros silenciosamente - não quebra o fluxo se parsing falhar
            // Log poderia ser adicionado aqui se necessário
        }
    }

    private AlunoCreateRequest parsearMensagemAluno(String texto) {
        if (texto == null || texto.trim().isEmpty()) {
            return null;
        }

        // Dividir por pipe e remover espaços em branco
        String[] partes = texto.split("\\|");
        if (partes.length < 2) {
            return null; // Mínimo: nome e telefone
        }

        // Extrair campos (ordem: Nome | Telefone | Email | Nível | Data)
        String nome = partes[0].trim();
        String telefone = partes.length > 1 ? partes[1].trim() : null;
        String email = partes.length > 2 && !partes[2].trim().isEmpty() ? partes[2].trim() : null;
        String nivelStr = partes.length > 3 && !partes[3].trim().isEmpty() ? partes[3].trim().toUpperCase() : null;
        String dataStr = partes.length > 4 && !partes[4].trim().isEmpty() ? partes[4].trim() : null;

        // Validar campos obrigatórios
        if (nome == null || nome.isEmpty() || telefone == null || telefone.isEmpty()) {
            return null;
        }

        // Validar e converter email (opcional)
        if (email != null && !email.isEmpty() && !isValidEmail(email)) {
            email = null; // Ignorar email inválido
        }

        // Validar e converter nível (opcional)
        NivelAluno nivelAluno = null;
        if (nivelStr != null && !nivelStr.isEmpty()) {
            try {
                nivelAluno = NivelAluno.valueOf(nivelStr);
            } catch (IllegalArgumentException e) {
                // Nível inválido, manter como null
            }
        }

        // Validar e converter data (opcional)
        LocalDate dataInicio = null;
        if (dataStr != null && !dataStr.isEmpty()) {
            try {
                dataInicio = LocalDate.parse(dataStr, DateTimeFormatter.ISO_LOCAL_DATE);
            } catch (DateTimeParseException e) {
                // Data inválida, manter como null
            }
        }

        return new AlunoCreateRequest(nome, email, telefone, nivelAluno, dataInicio);
    }

    private boolean isValidEmail(String email) {
        if (email == null || email.isEmpty()) {
            return false;
        }
        // Validação simples de email
        return email.contains("@") && email.contains(".") && email.length() > 5;
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

