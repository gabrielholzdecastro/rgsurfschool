CREATE TABLE tb_aluno (
    id BIGSERIAL PRIMARY KEY,
    nome VARCHAR NOT NULL,
    email VARCHAR,
    telefone VARCHAR(30) NOT NULL,
    nivel_aluno VARCHAR,
    data_inicio DATE
);

