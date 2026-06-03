# 📚 API Biblioteca

Uma API REST simples e eficiente para gerenciamento do acervo de livros e controle de empréstimos/devoluções de uma biblioteca.

---

## 🛠️ Tecnologias Utilizadas

Este projeto foi desenvolvido utilizando as seguintes tecnologias e dependências:

* **Node.js** (Ambiente de execução)
* **Express 5** (Framework web para as rotas)
* **Swagger (swagger-jsdoc & swagger-ui-express)** (Documentação interativa da API)
* **CommonJS** (Sistema de módulos nativo utilizando `require`)

---

## 🚀 Como Executar o Projeto

Siga os passos abaixo para clonar e rodar o projeto localmente na sua máquina.

### Pré-requisitos
Certifique-se de ter o [Node.js](https://nodejs.org/) instalado em sua máquina.

### 1. Clonar o repositório
```bash
git clone https://github.com/liandersonDesen/API-Biblioteca.git
cd api-biblioteca
```

### 2. Instalar as dependências
Instale todos os pacotes necessários listados no package.json:

```Bash
npm install
```
### 3. Executar o servidor de desenvolvimento
Para iniciar o servidor utilizando o script configurado:

```Bash
npm run dev
```
O servidor iniciará, por padrão, na porta 3000 (ou na porta configurada no seu index.js).

## 📖 Documentação da API (Swagger)
A API possui uma documentação interativa e visual gerada automaticamente com o Swagger. Nela, você pode testar as rotas de Livros e Empréstimos diretamente pelo navegador.

Com o servidor rodando, acesse:

👉 http://localhost:3000/api-docs 

## 🛣️ Principais Rotas Cadastradas
### 📖 Livros (/livros)
GET /livros - Lista todo o acervo de livros.

GET /livros/:id - Busca um livro específico pelo seu ID (Timestamp).

POST /livros - Cadastra um novo livro no acervo.

PUT /livros/:id - Atualiza os dados de um livro existente.

DELETE /livros/:id - Remove um livro do acervo.

### 📝 Empréstimos (/emprestimos)
GET /emprestimos - Lista o histórico de empréstimos.

GET /emprestimos/:id - Busca os detalhes de um empréstimo específico.

POST /emprestimos - Registra o empréstimo de um livro para um aluno.

PATCH /emprestimos/:id/devolver - Processa a devolução do livro e calcula se houve atraso na entrega.

## ⚙️ Detalhes de Implementação
Formato de Datas: As requisições de empréstimo aceitam o formato de data ISO (AAAA-MM-DD). O servidor trata os fusos horários locais e armazena/retorna as informações no formato brasileiro (DD/MM/AAAA).

Validação de Prazos: A rota de devolução analisa dinamicamente se a data de entrega foi posterior ao prazo estipulado, injetando a propriedade lógica estaAtrasado para o consumo do front-end.

