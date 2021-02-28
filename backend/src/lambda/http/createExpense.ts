import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import {CreateExpenseRequest} from "../../requests/CreateExpenseRequest";
import { createExpense } from '../../bussinessLogic/expense';
import {parseUserId} from "../../auth/utils";
import {createLogger} from "../../utils/logger";

const logger = createLogger('createExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        logger.info('createExpense request received')

        const newExpense: CreateExpenseRequest = JSON.parse(event.body)
        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)

        logger.info(`createExpense request received for userId ${userId}`)

        const expense = await createExpense(newExpense, userId)

        logger.info(`createExpense request successful for userId ${userId}, ${expense.expenseId}`)

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
