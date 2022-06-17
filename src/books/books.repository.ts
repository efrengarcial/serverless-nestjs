import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { DocumentClient } from "aws-sdk/clients/dynamodb"; 
import * as AWS from 'aws-sdk';

@Injectable()
export class BooksRepository {

    private tableName: string;
    private db: DocumentClient;   

    private bookPrefix = 'BOOK#';
    private authorPrefix = 'AUTH#'    


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
    }


    async getBook(isbn: number) {
        let book: object;
       
        try {
            const result = await this.db
                .get({
                    TableName: this.tableName,
                    Key: { PK: this.bookPrefix.concat(String(isbn)),
                           SK: this.bookPrefix.concat(String(isbn))},
                })
                .promise();

            book = result.Item;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        if (!book) {
            throw new NotFoundException(`Book with ISBN "${isbn}" not found`);
        }

        return book;
    }

    async getBooksByAuthor(lastName: string, firstName: string) {
        let books = [];
        console.log(this.authorPrefix.concat(lastName.toUpperCase()).concat("_").concat(firstName.toUpperCase()));

        try {
            const result = await this.db
                .query({
                    TableName: this.tableName,
                    KeyConditionExpression: '#PK=:PK AND begins_with(#SK, :SK)',
                    ExpressionAttributeNames: {
                        '#PK': 'PK',
                        '#SK': 'SK'
                    },
                    ExpressionAttributeValues: {
                        ':PK': this.authorPrefix.concat(lastName.toUpperCase()).concat("_").concat(firstName.toUpperCase()),
                        ':SK': this.bookPrefix
                    },
                    ScanIndexForward: false,
                    Limit: 100
                })
                .promise();
            books = result.Items;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }

        return books;
    }
}
