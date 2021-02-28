import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {Expense} from "../models/Expense";
import {UpdateExpenseRequest} from "../requests/UpdateExpenseRequest";
import {CreateExpenseRequest} from "../requests/CreateExpenseRequest";
import * as uuid from 'uuid'

export class ExpenseAccess {
    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly expenseTable = process.env.EXPENSES_TABLE,
        private readonly indexTable = process.env.INDEX_TABLE) {
    }

    async putExpense(expenseRequest: CreateExpenseRequest, userId : string) : Promise<Expense>{

        const itemId = uuid.v4()

        let expense: Expense = {
            userId: userId,
            expenseId: itemId,
            name: expenseRequest.name,
            description: expenseRequest.description,
            date: new Date().toISOString(),
            amount: expenseRequest.amount,
        };

        await this.docClient.put({
            TableName: this.expenseTable,
            Item: expense
        }).promise()

        return expense
    }

    async getAllExpenses(userId: string): Promise<Expense[]> {
        console.log('Getting all expenses')

        const result = await this.docClient.query({
            TableName: this.expenseTable,
            IndexName: this.indexTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        const items = result.Items
        return items as Expense[]
    }


    async deleteExpensebyId(expenseId : string,userId: string): Promise<void> {
        console.log('deleteExpensebyId')

        await this.docClient.delete({
            TableName: this.expenseTable,
            Key:{
                "userId": userId,
                "expenseId": expenseId
            },
            ConditionExpression:"userId = :userId and expenseId = :expenseId",
            ExpressionAttributeValues: {
                ':userId': userId,
                ':expenseId' : expenseId
            }
        }).promise()
    }

    async updateExpense(updateExpenseRequest : UpdateExpenseRequest, expenseId: string, userId: string): Promise<Expense> {
        await this.docClient.update({
            TableName: this.expenseTable,
            Key:{
                "userId": userId,
                "expenseId": expenseId
            },
            UpdateExpression: 'set #namefield = :name, #datefield = :date, description = :description, amount = :amount',
            ExpressionAttributeValues: {
                ":name": updateExpenseRequest.name,
                ":date": new Date().toISOString(),
                ":description": updateExpenseRequest.description,
                ":amount": updateExpenseRequest.amount
            },
            ExpressionAttributeNames:
                { "#namefield": "name" ,
                    "#datefield": "date" ,
                },
            ReturnValues:"UPDATED_NEW"
        }).promise()

        return this.getExpensebyId(expenseId, userId)
    }


    async getExpensebyId(expenseId : string,userId: string): Promise<Expense> {
        console.log('Getting all groups')

        const result = await this.docClient.query({
            TableName: this.expenseTable,
            IndexName: this.indexTable,
            KeyConditionExpression: 'userId = :userId and expenseId = :expenseId',
            ExpressionAttributeValues: {
                ':userId': userId,
                ':expenseId' : expenseId
            }
        }).promise()

        const items = result.Items
        return items[0] as Expense
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        console.log('Creating a local DynamoDB instance')
        return new AWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }
    return new AWS.DynamoDB.DocumentClient()
}
