import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb"; 
import { Entity, Table } from 'dynamodb-toolbox';
import * as AWS from 'aws-sdk';
import { IBook } from "./ibook";

@Injectable()
export class BooksRepository {

    private tableName: string;
    private db: DocumentClient;   

    private bookPrefix = 'BOOK#';
    private authorPrefix = 'AUTH#'    
    private bookEntity: Entity<IBook, undefined, Table<string, "PK", "SK">>;


    constructor() {
        this.tableName = process.env.ONLINE_LIBRARY_TABLE_NAME;     
        console.log(this.tableName)   
        if (process.env.IS_OFFLINE === 'true') {
            this.db = new AWS.DynamoDB.DocumentClient({
                region: 'localhost',
                endpoint: process.env.DYNAMODB_ENDPOINT,
            });
        } else {
            this.db = new AWS.DynamoDB.DocumentClient();
        }

        const table = new Table({
            name: this.tableName,
            partitionKey: 'PK',
            sortKey: 'SK',
            DocumentClient:  this.db ,
          });

        this.bookEntity = new Entity<IBook, undefined, Table<string, "PK", "SK">>({
            name: 'Book',
            attributes: {
                isbn: {  partitionKey: true, prefix: 'BOOK#' },
                sk: { hidden: true, sortKey: true , prefix: 'BOOK#' , default: (data) => `${data.isbn}` },
                title: { type: 'string', required: true },   
                reserved:  { type : 'boolean' , default: false},
                edition:  { type : 'number'},
                publisher:  { type : 'string'}
                //isbn:  ['sk',0, { type: 'string', save: false} ],  
            },
            table,
        } as const);
        //const isbn = 1

       //const b =  this.bookEntity.getBatch({ isbn: isbn, sk: isbn})
       //console.log(b);
    }

    createBook(book: IBook) {
        try {
           return this.bookEntity.put(book);

        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


    async getBook(isbn: number) {
        let book: IBook;
       
        try {
            const response = await this.bookEntity.get( { isbn: isbn, sk: isbn } );
            book = response.Item;    

        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!book) {
            throw new NotFoundException(`Book with ISBN '${isbn}' not found`);
        }

        return book;
    }

    async getBooksByAuthor(lastName: string, firstName: string) {
        let books = [];
        console.log(this.authorPrefix.concat(lastName.toUpperCase()).concat("_").concat(firstName.toUpperCase()));
       
        try {
            const result = await this.bookEntity.query(
                this.authorPrefix.concat(lastName.toUpperCase()).concat("_").concat(firstName.toUpperCase()), // partition key
                {
                  limit: 50, // limit to 50 items
                  beginsWith: this.bookPrefix, // select items where sort key begins with value
                  reverse: true, // return items in descending order (newest first)
                  capacity: 'indexes', // return the total capacity consumed by the indexes
                  //filters: { attr: 'total', gt: 100 }, // only show orders above $100
                  //index: 'GSI1' // query the GSI1 secondary index
                }
              );
    
            books = result.Items;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return books;
    }
}
