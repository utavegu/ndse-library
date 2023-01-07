import express from 'express';

import { BooksRepository } from './books.service';
import { IoCContainer } from "../../config/container";

const router = express.Router();
const repo:BooksRepository = IoCContainer.get(BooksRepository)

router.post(
  '/',
  async (request, responce) => {
    try {
      const newBook = await repo.createBook(request.body)
      const convertedNewBook = JSON.parse(JSON.stringify(newBook))
      const fullBook = {
        ...convertedNewBook,
        counter: "0"
      }
      responce
        .status(201)
        .json({
          success: true,
          data: fullBook,
        })
    } catch (error) {
      responce
        .status(500)
        .json(error)
    }
  }
);

router.get(
  '/',
  async (_, responce) => {
    try {
      const books = await repo.getBooks();
      responce
        .status(200)
        .json({
          success: true,
          data: books,
          //@ts-ignore
          quantity: books.length,
        })
    } catch (error) {
      responce
        .status(500)
        .json(error)
    }

  }
);

router.get(
  '/:id',
  async (request, responce) => {
    const { id } = request.params
    try {
      const book = await repo.getBook(id);
      if (book === null) throw new Error;
      responce
        .status(200)
        .json({
          success: true,
          data: book,
        })
    } catch (error) {
      responce
        .status(404)
        .json({
          success: false,
          data: null,
          message: 'Такая книга не найдена!',
        });
    }
  }
);

router.put(
  '/:id',
  (request, responce) => {
    try {
      const { id } = request.params;
      const payload = request.body;
      repo.updateBook(id, payload)
      responce
        .status(301)
        .redirect(`/api/books/${id}`)
    } catch (error) {
      responce
        .status(404)
        .json({
          success: false,
          data: null,
          message: 'Такая книга не найдена!'
        });
    }
  }
);

router.delete(
  '/:id',
  async (request, responce) => {
    const { id } = request.params;
    try {
      const result = await repo.deleteBook(id);
      if (!result) throw new Error("Такая книга не найдена!");
      responce
        .status(200)
        .json({
          success: true,
          message: result
        })
    } catch (error) {
      responce
        .status(404)
        .json({
          success: false,
          data: null,
          message: error
        });
    }
  }
);

export default router;