const express = require('express');
const router = express.Router();
const { BooksModel } = require('../models/books_model');

const booksModel = new BooksModel();

router.get('/list/names', async (req, res) => {
    try {
        const data = await booksModel.getBookNames(req.query['api-key']);

        return res.status(200).json(data);
    } catch (e) {
        return res.status(500).send(typeof e === 'string' ? e : 'Something went wrong. Please try again later.');
    }
});

router.get('/list/all', async (req, res) => {
    try {
        const data = await booksModel.getBookList(req.query['api-key'], req.query.list);

        return res.status(200).json(data);
    } catch (e) {
        return res.status(e.status || 500).send(e.message ? e.message : typeof e === 'string' ? e : 'Something went wrong. Please try again later.');
    }
})

module.exports = router;