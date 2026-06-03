const express = require("express")
const router = express.Router()

const { livros, emprestimos } = require("../data/db.js")
const { formatarDataBR, isDepois } = require("../utils/data.js")

/**
 * @swagger
 * tags:
 *      name: Empréstimos
 *      description: Gerenciamento de empréstimos e devoluções de livros
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Emprestimo:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      example: 1717189200000
 *                  livroId:
 *                      type: integer
 *                      example: 1717189100000
 *                  nomeAluno:
 *                      type: string
 *                      example: "Ana Silva"
 *                  dataEmprestimo:
 *                      type: string
 *                      description: Data em que o empréstimo foi realizado (Formato BR)
 *                      example: "03/06/2026"
 *                  dataDevolucao:
 *                      type: string
 *                      description: Data limite para a devolução acordada (Formato BR)
 *                      example: "10/06/2026"
 *                  devolvido:
 *                      type: boolean
 *                      example: false
 */

/**
 * @swagger
 * /emprestimos:
 *  get:
 *      summary: Lista todos os empréstimos
 *      tags: [Empréstimos]
 *      responses:
 *          200:
 *              description: Lista de empréstimos retornada com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Emprestimo'
 */
router.get("/", (req, res) => {
    res.status(200).json(emprestimos)
})

/**
 * @swagger
 * /emprestimos/{id}:
 *  get:
 *      summary: Busca um empréstimo pelo ID
 *      tags: [Empréstimos]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *               type: integer
 *            description: ID numérico do empréstimo a ser buscado
 *      responses:
 *          200:
 *              description: Empréstimo encontrado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Emprestimo'
 *          404:
 *              description: Empréstimo com esse id não foi encontrado
 */
router.get("/:id", (req, res) => {
    const { id } = req.params

    const findEmprestimo = emprestimos.find((emprestimo) => emprestimo.id === Number(id))

    if (!findEmprestimo) {
        return res.status(404).send("Empréstimo com esse id não foi encontrado")
    }

    res.status(200).json(findEmprestimo)
})

/**
 * @swagger
 * /emprestimos:
 *  post:
 *      summary: Registra um novo empréstimo
 *      tags: [Empréstimos]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - livroId
 *                          - nomeAluno
 *                          - dataDevolucao
 *                      properties:
 *                          livroId:
 *                              type: integer
 *                              example: 1717189100000
 *                          nomeAluno:
 *                              type: string
 *                              example: "Ana Silva"
 *                          dataDevolucao:
 *                              type: string
 *                              format: date
 *                              example: "2026-06-02"
 *      responses:
 *          201:
 *              description: Empréstimo realizado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Emprestimo'
 *          400:
 *              description: Campos obrigatórios ausentes, formato inválido ou livro indisponível
 *          404:
 *              description: Livro com o ID informado não foi encontrado
 */
router.post("/", (req, res) => {
    const { livroId, nomeAluno, dataDevolucao } = req.body

    if (!livroId || !nomeAluno || !dataDevolucao) {
        return res.status(400).send("os campos livroId, nomeAluno e dataDevolucao são obrigatorios ")
    }

    const idNumero = Number(livroId)

    if (Number.isNaN(idNumero)) {
        return res.status(400).send("o livroId precisa ser um numero")
    }

    const findLivroIndex = livros.findIndex((livro) => livro.id === idNumero)

    if (findLivroIndex === -1) {
        return res.status(404).send("Livro com esse id não foi encontrado")
    }

    const livroencontrado = livros[findLivroIndex]

    if (!livroencontrado.disponivel) {
        return res.status(400).send("O Livro não se encontra disponivel")
    }

    const dataAtualBruta = new Date()
    const dataDevolucaoBruta = new Date(dataDevolucao.replace(/-/g, '/'))

    if (isNaN(dataDevolucaoBruta.getTime())) {
        return res.status(400).send("Data de devolução inválida.")
    }
    
    if (!isDepois(dataAtualBruta, dataDevolucaoBruta)) {
        return res.status(400).send("A data de devolução deve ser posterior à data de hoje.")
    }    

    livros[findLivroIndex] = { ...livroencontrado, disponivel: false }

    const dataAtualFormatada = formatarDataBR(dataAtualBruta)
    const dataDevolucaoFormatada = formatarDataBR(dataDevolucaoBruta)
    
    const novoEmprestimo = {
        id: Date.now(),
        livroId: idNumero,
        nomeAluno,
        dataEmprestimo: dataAtualFormatada,
        dataDevolucao: dataDevolucaoFormatada,
        devolvido: false,
    }

    emprestimos.push(novoEmprestimo)

    res.status(201).json(novoEmprestimo)
})
/**
 * @swagger
 * /emprestimos/{id}/devolver:
 *  patch:
 *      summary: Realiza a devolução de um livro emprestado
 *      tags: [Empréstimos]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *                  type: integer
 *            description: ID numérico do empréstimo a ser encerrado
 *      responses:
 *          200:
 *              description: Devolução processada com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Emprestimo'
 *          404:
 *              description: Empréstimo ou livro correspondente não foi encontrado
 */

router.patch("/:id/devolver", (req, res) => {
    const { id } = req.params

    const emprestimoIndex = emprestimos.findIndex((emprestimo) => emprestimo.id === Number(id))

    if (emprestimoIndex === -1) {
        return res.status(404).send("Empréstimo com esse id não foi encontrado")
    }
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    
    const emprestimoAtualizado = { ...emprestimos[emprestimoIndex], devolvido: true, dataEntregaEfetiva: formatarDataBR(hoje) }
    emprestimos[emprestimoIndex] = emprestimoAtualizado
    
    const [dia, mes, ano] = emprestimoAtualizado.dataDevolucao.split("/");
    const dataLimiteDevolucao = new Date(ano, mes - 1, dia);
    
    dataLimiteDevolucao.setHours(0, 0, 0, 0);

    const estaAtrasado = dataLimiteDevolucao.getTime() < hoje.getTime();

    const livroIndex = livros.findIndex((livro) => livro.id === Number(emprestimoAtualizado.livroId))

    if (livroIndex !== -1) {
        livros[livroIndex] = { ...livros[livroIndex], disponivel: true }
    }

    res.status(200).json({ ...emprestimoAtualizado, estaAtrasado })
})

module.exports = router