CREATE TABLE tb_loja (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    qtd_estoque INTEGER NOT NULL,
    condicao VARCHAR NOT NULL,
    preco DECIMAL(10, 2) NOT NULL,
    custo DECIMAL(10, 2) NOT NULL,
    data_aquisicao DATE NOT NULL,
    fornecedor VARCHAR NOT NULL
);

