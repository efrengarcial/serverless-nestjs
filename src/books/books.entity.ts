import { Table, Entity } from "dynamodb-toolbox";
import { IBook } from "./ibook";

export const UserEntity =  new Entity<IBook,{ id: string, userId: string }>({
    name: 'Customer',
    timestamps: true,
    created: 'createdAt',
    modified: 'modifiedAt',
    attributes: {
      PK: { type: 'string', hidden: true, partitionKey: true, default: (data: any) => `CUSTOMER#${data.id}` },
      SK: { type: 'string', hidden: true, sortKey: true, default: (data: any) => data.pk },
      id: { type: 'string', required: true },
      status: { type: 'string', required: true },
      email: { type: 'string', required: true },
      firstName: 'string',
      lastName: 'string',
      country: 'string',
      phone: 'string',
    },
    table: dynamoTable,
  });
