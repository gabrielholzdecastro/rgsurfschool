CREATE TABLE tb_mensagem (
    id BIGSERIAL PRIMARY KEY,
    numero_remetente VARCHAR NOT NULL,
    texto TEXT,
    data_recebimento TIMESTAMP NOT NULL,
    tipo VARCHAR,
    from_me BOOLEAN,
    message_id VARCHAR
);

