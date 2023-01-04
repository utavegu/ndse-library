require('reflect-metadata');
const { Container } = require('inversify');
const BooksRepository = require('./classes/BooksRepository');

const IoCContainer = new Container();
IoCContainer.bind(BooksRepository).toSelf();

module.exports = IoCContainer;