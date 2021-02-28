import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {parseUserId} from '../../auth/utils'

import {getAllExpenses} from "../../bussinessLogic/expense";
import {createLogger} from "../../utils/logger";
const logger = createLogger('getExpenses')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('getExpenses request received')

        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)

        logger.info(`userid is ${userId}`);

        const expenses = await getAllExpenses(userId)

        logger.info(`getExpenses successful for ${userId}`)

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
        logger.error(`exception ${e}`)

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

