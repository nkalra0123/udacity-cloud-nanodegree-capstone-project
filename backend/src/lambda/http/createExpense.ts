import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import {CreateExpenseRequest} from "../../requests/CreateExpenseRequest";
import { createExpense } from '../../bussinessLogic/expense';
import {parseUserId} from "../../auth/utils";


export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Processing event: ', event)

        const newExpense: CreateExpenseRequest = JSON.parse(event.body)
        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)

        const expense = await createExpense(newExpense, userId)
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
    catch(e) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({e})
        }
    }
}
