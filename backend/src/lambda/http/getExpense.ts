import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {getExpense} from "../../bussinessLogic/expense";
import {parseUserId} from "../../auth/utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        console.log('Processing event: ', event)
        const expenseId = event.pathParameters.expenseId

        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)

        const expense = await getExpense(expenseId, userId);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                expense: expense
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

