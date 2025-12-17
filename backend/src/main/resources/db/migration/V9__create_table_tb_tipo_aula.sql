-- Criar tabela tb_tipo_aula
CREATE TABLE tb_tipo_aula (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL UNIQUE,
    valor_padrao NUMERIC(10, 2) NOT NULL
);

-- Remover coluna antiga tipo_aula
ALTER TABLE tb_aula DROP COLUMN IF EXISTS tipo_aula;

-- Adicionar coluna tipo_aula_id na tabela tb_aula (nullable primeiro)
ALTER TABLE tb_aula ADD COLUMN tipo_aula_id BIGINT;

-- Criar foreign key
ALTER TABLE tb_aula ADD CONSTRAINT fk_aula_tipo_aula 
    FOREIGN KEY (tipo_aula_id) REFERENCES tb_tipo_aula(id);

-- Deletar registros existentes de tb_aula (já que não haverá migração de dados)
DELETE FROM tb_aula;

-- Agora podemos tornar a coluna NOT NULL
ALTER TABLE tb_aula ALTER COLUMN tipo_aula_id SET NOT NULL;

