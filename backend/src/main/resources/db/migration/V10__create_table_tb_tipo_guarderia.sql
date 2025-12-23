-- Criar tabela tb_tipo_guarderia
CREATE TABLE tb_tipo_guarderia (
    id BIGSERIAL PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL UNIQUE,
    valor_padrao NUMERIC(10, 2) NOT NULL
);

-- Inserir tipos padrão
INSERT INTO tb_tipo_guarderia (tipo, valor_padrao) VALUES
    ('DIARIA', 0.00),
    ('MENSAL', 0.00),
    ('TRIMESTRAL', 0.00),
    ('ANUAL', 0.00);

