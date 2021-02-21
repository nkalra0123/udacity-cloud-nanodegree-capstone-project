import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {Expense} from "./createExpense";
import {DocumentClient} from "aws-sdk/clients/dynamodb";
import * as AWS from "aws-sdk";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ', event)

    const expenses = await getAllExpenses("123")

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: expenses
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

async function getAllExpenses(userId: string): Promise<Expense[]> {
    console.log('Getting all groups')

    let docClient: DocumentClient = createDynamoDBClient();
    let expenseTable = process.env.EXPENSES_TABLE;
    let indexTable = process.env.INDEX_TABLE;

    const result = await docClient.query({
        TableName: expenseTable,
        IndexName: indexTable,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
            ':userId': userId
        }
    }).promise()

    const items = result.Items
    return items as Expense[]
}
