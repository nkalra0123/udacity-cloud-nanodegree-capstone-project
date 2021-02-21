export interface CreateExpenseRequest {
    name: string
    description: string
    date: string
}
import * as uuid from 'uuid'

import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'


export interface Expense {
    userId: string
    expenseId: string
    name: string
    description: string
    date: string
    attachmentUrl?: string
    tag?: string
}

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)
    const newExpense: CreateExpenseRequest = JSON.parse(event.body)

    const expense = await createExpense(newExpense)
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            item: {
                ...expense,
            }
        })
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


async function createExpense(createExpenseRequest: CreateExpenseRequest) : Promise<Expense>{

    //let indexTable = process.env.INDEX_NAME;
    const itemId = uuid.v4()

    return await putExpense({
        description: createExpenseRequest.description,
        expenseId: itemId,
        name: createExpenseRequest.name,
        date: createExpenseRequest.date,
        userId: '123'
    })
}

async function putExpense(expense: Expense) : Promise<Expense>{
    let docClient: DocumentClient = createDynamoDBClient();
    let expenseTable = process.env.EXPENSES_TABLE;

    await docClient.put({
        TableName: expenseTable,
        Item: expense
    }).promise()

    return expense
}
