const express = require("express")
const router = express.Router()

const { livros } = require("../data/db.js")

const { GENEROS_PADRAO } = require("../utils/constantes.js")

/**
 * @swagger
 * tags:
 *      name: Livros
 *      description: Gerenciamento do acervo de livros da biblioteca
 */

/**
 * @swagger
 * components:
 *      schemas:
 *          Livro:
 *              type: object
 *              properties:
 *                  id:
 *                      type: integer
 *                      example: 1717189200000
 *                  titulo:
 *                      type: string
 *                      example: "O Senhor dos Anéis"
 *                  autor:
 *                      type: string
 *                      example: "J.R.R. Tolkien"
 *                  genero:
 *                      type: string
 *                      example: "Fantasia"
 *                  disponivel:
 *                      type: boolean
 *                      example: true
 */



/**
 * @swagger
 * /livros:
 *  get:
 *      summary: Lista todos os livros
 *      tags: [Livros]
 *      parameters:
 *        - in: query
 *          name: genero
 *          required: false
 *          schema:
 *              type: string
 *              enum: [
 *                  "Ficção Científica",
 *                  "Fantasia",
 *                  "Mistério / Suspense",
 *                  "Romance",
 *                  "Biografia",
 *                  "História",
 *                  "Autoajuda",
 *                  "Infanto-Juvenil"
 *               ]
 *          description: Filtrar os livros por um gênero específico
 *      responses:
 *          200:
 *              description: Lista de livros retornada com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#/components/schemas/Livro'
 *          400:
 *              description: Gênero de busca inválido
 */
router.get("/", (req, res) => {
    const { genero } = req.query

    let livrosValidos = livros.filter(livro => !livro.excluido)

    if (genero) {
        const generoValido = GENEROS_PADRAO.find(g => g.toLowerCase() === genero.trim().toLowerCase())

        if (!generoValido) {
            return res.status(400).send(`Gênero de busca inválido! Escolha um dos seguintes: ${GENEROS_PADRAO.join(", ")}`)
        }

        livrosValidos = livrosValidos.filter(livro => livro.genero === generoValido)
    }

    res.status(200).json(livrosValidos)
})

/**
 * @swagger
 * /livros/{id}:
 *  get:
 *      summary: Busca um livro pelo ID
 *      tags: [Livros]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: ID numérico do livro a ser buscado
 *      responses:
 *          200:
 *              description: Livro encontrado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Livro'
 *          404:
 *              description: Livro com esse id não foi encontrado
 */
router.get("/:id", (req, res) => {
    const { id } = req.params

    const findLivro = livros.find((livro) => livro.id === Number(id))

    if (!findLivro) {
        return res.status(404).send("Livro com esse id não foi encontrado")
    }

    res.status(200).json(findLivro)
})

/**
 * @swagger
 * /livros:
 *  post:
 *      summary: Cadastra um novo livro
 *      tags: [Livros]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      required:
 *                          - titulo
 *                          - autor
 *                          - genero
 *                      properties:
 *                          titulo:
 *                              type: string
 *                              example: "Dom Casmurro"
 *                          autor:
 *                              type: string
 *                              example: "Machado de Assis"
 *                          genero:
 *                              type: string
 *                              enum: [
 *                                  "Ficção Científica",
 *                                  "Fantasia",
 *                                  "Mistério / Suspense",
 *                                  "Romance",
 *                                  "Biografia",
 *                                  "História",
 *                                  "Autoajuda",
 *                                  "Infanto-Juvenil"
 *                              ]
 *                              example: "Romance"
 *      responses:
 *         201:
 *             description: Livro cadastrado com sucesso
 *             content:
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/Livro'
 *         400:
 *             description: Campos obrigatórios ausentes ou gênero inválido
 * 
 */
router.post("/", (req, res) => {
    const { titulo, autor, genero } = req.body

    if (!titulo || !autor || !genero) {
        return res.status(400).send("os campos titulo, autor e generos são obrigatorios ")
    }
    const generoValido = GENEROS_PADRAO.find(g => g.toLowerCase() === genero.trim().toLowerCase())

    if (!generoValido) {
        return res.status(400).send(`Gênero inválido! Escolha um dos seguintes: ${GENEROS_PADRAO.join(", ")}`)
    }
    
    const novoLivro = {
        id: Date.now(),
        titulo,
        autor,
        genero:generoValido,
        disponivel: true,
        excluido: false
    }

    livros.push(novoLivro)

    res.status(201).json(novoLivro)
})

/**
 * @swagger
 * /livros/{id}:
 *  put:
 *      summary: Atualiza os dados de um livro pelo ID
 *      tags: [Livros]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: ID numérico do livro a ser atualizado
 *      requestBody:
 *           required: true
 *           content:
 *               application/json:
 *                  schema:
 *                      type: object
 *                      properties:
 *                          titulo:
 *                              type: string
 *                              example: "Dom Casmurro - Edição Especial"
 *                          autor:
 *                              type: string
 *                              example: "Machado de Assis"
 *                          genero:
 *                              type: string
 *                              example: "Clássico"
 *      responses:
 *          200:
 *              description: Livro atualizado com sucesso
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/components/schemas/Livro'
 *          404:
 *              description: Livro com esse id não foi encontrado
 */
router.put("/:id", (req, res) => {
    const { titulo, autor, genero } = req.body
    const { id } = req.params

    const livroIndex = livros.findIndex((livro) => livro.id === Number(id))

    if (livroIndex === -1) {
        return res.status(404).send("Livro com esse id não foi encontrado")
    }

    const livroAntigo = livros[livroIndex]

    const livroAtualizado = {
        ...livroAntigo,
        titulo: titulo ?? livroAntigo.titulo,
        autor: autor ?? livroAntigo.autor,
        genero: genero ?? livroAntigo.genero
    }

    livros[livroIndex] = livroAtualizado

    res.status(200).json(livroAtualizado)
})


/**
 * @swagger
 * /livros/{id}:
 *  delete:
 *      summary: Remove um livro pelo ID
 *      tags: [Livros]
 *      parameters:
 *          - in: path
 *            name: id
 *            required: true
 *            schema:
 *              type: integer
 *            description: ID numérico do livro a ser deletado
 *      responses:
 *          200:
 *              description: Livro deletado com sucesso
 *          404:
 *              description: Livro com esse id não foi encontrado
 */
router.delete("/:id", (req, res) => {
    const { id } = req.params

    const livro = livros.find((l) => l.id === Number(id))

    if (!livro) {
        return res.status(404).send("Livro não encontrado")
    }

    livro.excluido = true

    res.status(200).send("Livro deletado")
})


module.exports = router