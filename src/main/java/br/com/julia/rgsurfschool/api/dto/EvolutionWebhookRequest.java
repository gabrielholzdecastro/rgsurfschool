package br.com.julia.rgsurfschool.api.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EvolutionWebhookRequest(
        String event,
        String instance,
        EvolutionData data
) {
    public record EvolutionData(
            @JsonProperty("key")
            MessageKey key,
            @JsonProperty("message")
            MessageContent message,
            @JsonProperty("messageType")
            String messageType,
            @JsonProperty("messageTimestamp")
            Long messageTimestamp
    ) {
    }

    public record MessageKey(
            @JsonProperty("remoteJid")
            String remoteJid,
            @JsonProperty("fromMe")
            Boolean fromMe,
            @JsonProperty("id")
            String id,
            @JsonProperty("participant")
            String participant
    ) {
    }

    public record MessageContent(
            @JsonProperty("conversation")
            String conversation,
            @JsonProperty("extendedTextMessage")
            ExtendedTextMessage extendedTextMessage
    ) {
    }

    public record ExtendedTextMessage(
            @JsonProperty("text")
            String text
    ) {
    }
}

