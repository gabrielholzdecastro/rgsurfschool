package br.com.julia.rgsurfschool.api.controller;

import br.com.julia.rgsurfschool.api.dto.EvolutionWebhookRequest;
import br.com.julia.rgsurfschool.domain.service.MensagemService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/webhook")
public class WebhookController {

    private final MensagemService mensagemService;

    public WebhookController(MensagemService mensagemService) {
        this.mensagemService = mensagemService;
    }

    @PostMapping("/evolution")
    public ResponseEntity<Void> receberWebhook(@RequestBody EvolutionWebhookRequest webhookRequest) {
        mensagemService.processarWebhook(webhookRequest);
        return new ResponseEntity<>(HttpStatus.OK);
    }
}

