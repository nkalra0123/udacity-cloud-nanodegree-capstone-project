import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import {CreateExpenseRequest} from "../../requests/CreateExpenseRequest";
import { createExpense } from '../../bussinessLogic/expense';


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
            expense: {
                ...expense,
            }
        })
    }

}
