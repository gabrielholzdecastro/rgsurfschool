-- Novas tabelas conforme modelos de domínio

CREATE TABLE tb_professor (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR,
    telefone VARCHAR(30),
    especialidade VARCHAR
);

CREATE TABLE tb_aula (
    id BIGSERIAL PRIMARY KEY,
    titulo VARCHAR NOT NULL,
    descricao TEXT,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    preco NUMERIC(10, 2),
    tipo_aula VARCHAR(20) NOT NULL,
    status_pagamento VARCHAR(20) NOT NULL,
    capacidade INTEGER
);

CREATE TABLE tb_aula_professor (
    aula_id BIGINT NOT NULL,
    professor_id BIGINT NOT NULL,
    PRIMARY KEY (aula_id, professor_id),
    CONSTRAINT fk_aula_professor_aula FOREIGN KEY (aula_id) REFERENCES tb_aula(id),
    CONSTRAINT fk_aula_professor_professor FOREIGN KEY (professor_id) REFERENCES tb_professor(id)
);

CREATE TABLE tb_aula_aluno (
    aula_id BIGINT NOT NULL,
    aluno_id BIGINT NOT NULL,
    PRIMARY KEY (aula_id, aluno_id),
    CONSTRAINT fk_aula_aluno_aula FOREIGN KEY (aula_id) REFERENCES tb_aula(id),
    CONSTRAINT fk_aula_aluno_aluno FOREIGN KEY (aluno_id) REFERENCES tb_aluno(id)
);

CREATE TABLE tb_trip (
    id BIGSERIAL PRIMARY KEY,
    destino VARCHAR NOT NULL,
    descricao TEXT,
    data_saida DATE,
    data_retorno DATE,
    preco NUMERIC(10, 2),
    vagas INTEGER
);

CREATE TABLE tb_trip_aluno (
    trip_id BIGINT NOT NULL,
    aluno_id BIGINT NOT NULL,
    PRIMARY KEY (trip_id, aluno_id),
    CONSTRAINT fk_trip_aluno_trip FOREIGN KEY (trip_id) REFERENCES tb_trip(id),
    CONSTRAINT fk_trip_aluno_aluno FOREIGN KEY (aluno_id) REFERENCES tb_aluno(id)
);

CREATE TABLE tb_equipamento (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    qtd_estoque INTEGER NOT NULL,
    condicao VARCHAR NOT NULL,
    preco NUMERIC(10, 2) NOT NULL,
    custo NUMERIC(10, 2) NOT NULL,
    data_aquisicao DATE NOT NULL,
    fornecedor VARCHAR NOT NULL,
    em_uso BOOLEAN NOT NULL,
    disponivel_venda BOOLEAN NOT NULL
);

-- Ajustes na tabela de vendas para suportar serviços e equipamentos
ALTER TABLE tb_venda
    ADD COLUMN tipo_item VARCHAR NOT NULL DEFAULT 'LOJA',
    ADD COLUMN equipamento_id BIGINT,
    ADD COLUMN aula_id BIGINT,
    ADD COLUMN trip_id BIGINT,
    ALTER COLUMN loja_id DROP NOT NULL;

ALTER TABLE tb_venda
    ADD CONSTRAINT fk_venda_equipamento FOREIGN KEY (equipamento_id) REFERENCES tb_equipamento(id),
    ADD CONSTRAINT fk_venda_aula FOREIGN KEY (aula_id) REFERENCES tb_aula(id),
    ADD CONSTRAINT fk_venda_trip FOREIGN KEY (trip_id) REFERENCES tb_trip(id);

-- Opcional: manter valores antigos como LOJA; default já cuida dos existentes
ALTER TABLE tb_venda
    ALTER COLUMN tipo_item DROP DEFAULT;
