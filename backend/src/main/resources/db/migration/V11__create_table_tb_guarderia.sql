-- Criar tabela tb_guarderia
CREATE TABLE tb_guarderia (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    tipo_guarderia_id BIGINT NOT NULL,
    valor NUMERIC(10, 2) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    pago BOOLEAN NOT NULL DEFAULT FALSE,
    data_pagamento DATE,
    CONSTRAINT fk_guarderia_aluno FOREIGN KEY (aluno_id) REFERENCES tb_aluno(id),
    CONSTRAINT fk_guarderia_tipo_guarderia FOREIGN KEY (tipo_guarderia_id) REFERENCES tb_tipo_guarderia(id)
);

