require('reflect-metadata');
const { Container, decorate, injectable } = require('inversify');
import { BooksRepository } from '../entities/books/books.service';

decorate(injectable(), BooksRepository)

const IoCContainer = new Container();

IoCContainer
  .bind(BooksRepository)
  .toSelf()
  .inSingletonScope();

export { IoCContainer };