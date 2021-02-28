import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateExpenseRequest } from '../../requests/UpdateExpenseRequest'
import {updateExpense} from "../../bussinessLogic/expense";
import {Expense} from "../../models/Expense";
import {parseUserId} from "../../auth/utils";
import {createLogger} from "../../utils/logger";
const logger = createLogger('updateExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {
        const expenseId = event.pathParameters.expenseId
        logger.info(`updateExpense request is for expenseId ${expenseId}`)

        const updateExpenseRequest: UpdateExpenseRequest = JSON.parse(event.body)
        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)


        logger.info(`updateExpense request is for userId ${userId}`)

        const expense : Expense = await updateExpense(updateExpenseRequest, expenseId, userId)

        logger.info(`updateExpense request is for userId ${userId} , expenseId ${expenseId}`)

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
    catch(e){
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
