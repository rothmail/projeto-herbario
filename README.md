## projeto-herbario

# Banco de Dados

CREATE DATABASE projeto_herbario;
USE projeto_herbario;

CREATE TABLE plantas(
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome_popular VARCHAR(255) NOT NULL,
    nome_cientifico VARCHAR(255) NOT NULL,
    familia_botanica VARCHAR(255),
    origem VARCHAR(255),
    uso_medicinal VARCHAR(255),
    principio_ativo VARCHAR(255),
    parte_utilizada VARCHAR(255),
    modo_preparo VARCHAR(255),
    contraindicacao VARCHAR(255),
    imagem VARCHAR(255)
);

SELECT * FROM plantas;