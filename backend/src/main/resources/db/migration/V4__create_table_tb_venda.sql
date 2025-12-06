CREATE TABLE tb_venda (
    id BIGSERIAL PRIMARY KEY,
    loja_id BIGINT NOT NULL,
    aluno_id BIGINT,
    nome_comprador VARCHAR,
    quantidade INTEGER NOT NULL,
    valor_unitario DECIMAL(10, 2) NOT NULL,
    valor_total DECIMAL(10, 2) NOT NULL,
    metodo_pagamento VARCHAR NOT NULL,
    status_pagamento VARCHAR NOT NULL,
    data_venda TIMESTAMP NOT NULL,
    
    CONSTRAINT fk_venda_loja FOREIGN KEY (loja_id) REFERENCES tb_loja(id),
    CONSTRAINT fk_venda_aluno FOREIGN KEY (aluno_id) REFERENCES tb_aluno(id)
);
