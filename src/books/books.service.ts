import { Injectable } from '@nestjs/common';
import {BooksRepository} from "./books.repository";
import { IBook } from './ibook';

@Injectable()
export class BooksService {

    constructor(private bookRepo: BooksRepository) {}

    async getBook(isbn: number) {
        return await this.bookRepo.getBook(isbn);
    }

    async getAuthorBooks(lastName: string, firstName: string) {
        return await this.bookRepo.getBooksByAuthor(lastName, firstName);
    }

    async createBook(book: IBook) {
        return await this.bookRepo.createBook(book);
    }
}
