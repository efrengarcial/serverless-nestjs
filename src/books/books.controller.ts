import {Body, Controller, Get, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {BooksService} from "./books.service";
import { IBook } from './ibook';

@Controller('books')
export class BooksController {

    constructor(private bookService: BooksService){}

    @Post()
    async createBook(@Body() book:IBook, @Res() res: any){
        const result: object = await this.bookService.createBook(book);
        return res.status(HttpStatus.CREATED).send(result);
    }

    @Get("/:isbn")
    async getBookByISBN(@Param('isbn') isbn:number, @Res() res: any){
        const book: IBook = await this.bookService.getBook(isbn);
        return res.status(HttpStatus.OK).send(book);
    }

    @Get("/author/:lastName/:firstName")
    async getBooksByAuthor(@Param('lastName')lastName: string, @Param('firstName')firstName: string, @Res() res: any) {
        const books: IBook[] = await this.bookService.getAuthorBooks(lastName, firstName);
        return res.status(HttpStatus.OK).send(books);
    }
}
































