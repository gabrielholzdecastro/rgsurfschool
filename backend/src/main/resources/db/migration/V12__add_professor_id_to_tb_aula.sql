-- Adicionar coluna professor_id na tabela tb_aula (nullable, pois é opcional)
ALTER TABLE tb_aula ADD COLUMN professor_id BIGINT;

-- Criar foreign key para tb_professor
ALTER TABLE tb_aula ADD CONSTRAINT fk_aula_professor 
    FOREIGN KEY (professor_id) REFERENCES tb_professor(id);

