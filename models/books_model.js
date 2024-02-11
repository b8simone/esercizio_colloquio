const request = require('request-promise');

module.exports.BooksModel = class BooksModel {
    constructor() {
        this.ny_baseUrl = 'https://api.nytimes.com/svc/books/v3/';
        this.gb_baseUrl = `https://www.googleapis.com/books/v1/volumes`;

    }

    async getBookNames(apiKey) {
        try {
            return (await request.get(`${this.ny_baseUrl}/lists/names.json`, { json: true, qs: { 'api-key': apiKey } })).results;
        } catch (e) {
            throw e.error.fault.faultstring;
        }
    }

    async getBookList(apiKey, list) {
        if (!list) throw { status: 400, message: 'Missing required parameters' };

        const books = (await request.get(`${this.ny_baseUrl}/lists.json`, { json: true, qs: { list: list, 'api-key': apiKey } })).results;

        for (const book of books) {
            book.gb_preview_link = await this.getGooglePreview(book.book_details[0].primary_isbn13);
        }

        return books;
    }

    async getGooglePreview(isbn) {
        const response = await request.get(this.gb_baseUrl, { qs: { q: `isbn:${isbn}` }, json: true });

        if (response.totalItems > 0) {
            const previewLink = response.items[0].volumeInfo.previewLink;
            return previewLink;
        } else {
            return null;
        }
    }
}