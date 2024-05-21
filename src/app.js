const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const { config } = require('dotenv')
config()

//Esto va a ser únicamente la ruta de los libros
const bookRoutes = require('./routes/book.routes')

//Usamos express para el middleware
const app = express()
app.use(bodyParser.json()) //parseador de bodies

//Conectar BBDD de mongoose:
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME })
const db = mongoose.connection;

//Buscará solo la ruta de los libros y pondremos lo que importamos
app.use('/books', bookRoutes) 

const port = process.env.PORT || 3000

app.listen(port, () =>{
    console.log(`Servidor iniciado en el puerto ${port}`)
})

