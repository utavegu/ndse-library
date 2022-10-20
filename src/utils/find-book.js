module.exports = (library, req) => library.findIndex(book => book.id === req.params.id);
