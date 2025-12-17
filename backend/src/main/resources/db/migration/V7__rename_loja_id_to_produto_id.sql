-- Renomear coluna loja_id para produto_id
ALTER TABLE tb_venda RENAME COLUMN loja_id TO produto_id;

-- Remover constraint antiga
ALTER TABLE tb_venda DROP CONSTRAINT IF EXISTS fk_venda_loja;

-- Adicionar nova constraint com nome atualizado
ALTER TABLE tb_venda 
ADD CONSTRAINT fk_venda_produto FOREIGN KEY (produto_id) REFERENCES tb_produto(id);

