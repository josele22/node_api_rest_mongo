const express = require('express')
const router = express.Router()
const Book = require('../models/books.model')



//MIDDLEWARE:
/**Los middlewares son códigos que se ejecutan antes de que una petición HTTP llegue al manejador de rutas o antes de que un cliente 
 * reciba una respuesta
 */
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({
            message: 'El ID del libro no es válido'
        })
    }

    try {
        book = await Book.findById(id)
        if (!book) {
            return res.status(404).json({
                message: 'El libro no fue encontrado'
            })
        }
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }

    res.book = book;
    next()
}


// Obtener todos los libros [GET ALL]
router.get('/', async (req, res) => {
    try {
        const books = await Book.find()
        console.log('GET ALL', books)
        if (books.length === 0) {
            res.status(204).json([])
        }
        res.json(books)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

//Crear un nuevo libro (recurso) [POST]
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req?.body
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({
            message: 'Los campos titulo, author, género y fecha son obligatorios'
        })
    }

    const book = new Book(
        {
            title,
            author,
            genre,
            publication_date
        }
    )

    try {
        const newBook = await book.save()
        console.log(newBook)
        res.status(201).json(newBook)
    } catch (error) {
        res.status(400).json({
            message: error.message
        })
    }
})

//GET INDIVIDUAL - 1 LIBRO
router.get('/:id', getBook, async (req, res) => {
    res.json(res.book)
})

//PUT
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book // este res.book viene de getBook porque al final de ese get se hace res.book = book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save()

        res.json(updateBook)

    } catch (error) {
        res.status(400).json({
            message:error.message
        })
     }
})

//PUT
router.patch('/:id', getBook, async (req, res) => {

    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_date){
        res.status(400).json({
            message: "Al menos uno de estos campos debe ser enviado: Título, Autor, Género o fecha de publicación"
        })
    }


    try {
        const book = res.book // este res.book viene de getBook porque al final de ese get se hace res.book = book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_date = req.body.publication_date || book.publication_date

        const updateBook = await book.save()

        res.json(updateBook)

    } catch (error) {
        res.status(400).json({
            message:error.message
        })
     }
})

//DELETE
router.delete('/:id', getBook, async (req, res) => {
    try{
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `El libro ${book.title} fue eliminado correctamente`
        })
    } catch (error) {
        res.status(500).json({
            message:error.message
        })
     }
})

module.exports = router