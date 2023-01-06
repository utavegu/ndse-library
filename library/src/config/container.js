require('reflect-metadata');
const { Container, decorate, injectable } = require('inversify');
const BooksRepository = require('../classes/BooksRepository');

decorate(injectable(), BooksRepository)

const IoCContainer = new Container();

IoCContainer
  .bind(BooksRepository)
  .toSelf()
  .inSingletonScope();

module.exports = IoCContainer;