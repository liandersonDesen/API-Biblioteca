const express = require("express")

const app = express()

const port = process.env.PORT || 3000
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger.js');
const livroRouter = require("./routes/livros.js");
const emprestimosRouter = require("./routes/emprestimos.js");


app.use(express.json())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/livros", livroRouter)
app.use("/emprestimos", emprestimosRouter)


app.get("/", (req, res) => {
    res.send({
        status: "Servidor rodando perfeitamente",
        docs: "http://localhost:3000/api-docs"
    })
})

app.listen(port, () => {
    console.log(`servidor rodando em http://localhost:${port}`)  
    console.log(`Documentação em http://localhost:${port}/api-docs`);
})
