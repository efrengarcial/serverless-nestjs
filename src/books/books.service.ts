import { Injectable } from '@nestjs/common';
import {BooksRepository} from "./books.repository";
import { IBook } from './ibook';

@Injectable()
export class BooksService {

    constructor(private bookRepo: BooksRepository) {}

    getBook(isbn: number) {
        return this.bookRepo.getBook(isbn);
    }

    getAuthorBooks(lastName: string, firstName: string) {
        return this.bookRepo.getBooksByAuthor(lastName, firstName);
    }

    createBook(book: IBook) {
        return this.bookRepo.createBook(book);
    }
}
