import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {parseUserId} from '../../auth/utils'

import {getAllExpenses} from "../../bussinessLogic/expense";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)

        const expenses = await getAllExpenses(userId)

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                expense: expenses
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

