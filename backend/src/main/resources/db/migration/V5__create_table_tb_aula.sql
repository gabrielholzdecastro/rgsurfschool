CREATE TABLE tb_aula (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    data DATE NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fim TIME NOT NULL,
    tipo_aula VARCHAR(20) NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    status_pagamento VARCHAR(20) NOT NULL,

    FOREIGN KEY (aluno_id) REFERENCES tb_aluno(id)
);
