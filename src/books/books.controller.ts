import {Body, Controller, Get, HttpStatus, Param, Post, Res} from '@nestjs/common';
import {BooksService} from "./books.service";
import { IBook } from './ibook';

@Controller('books')
export class BooksController {

    constructor(private bookService: BooksService){}

    @Post()
    createBook(@Body() book:IBook){
        return this.bookService.createBook(book);                
    }

    @Get("/:isbn")
    getBookByISBN(@Param('isbn') isbn:number){        
        return this.bookService.getBook(isbn);
    }

    @Get("/author/:lastName/:firstName")    
    getBooksByAuthor(@Param('lastName')lastName: string, @Param('firstName')firstName: string) {
        return this.bookService.getAuthorBooks(lastName, firstName);
    }
}
































