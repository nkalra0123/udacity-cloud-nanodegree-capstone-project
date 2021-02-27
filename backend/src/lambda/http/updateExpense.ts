import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'

import { UpdateExpenseRequest } from '../../requests/UpdateExpenseRequest'
import {updateExpense} from "../../bussinessLogic/expense";
import {Expense} from "../../models/Expense";
import {parseUserId} from "../../auth/utils";

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    try {

        const expenseId = event.pathParameters.expenseId
        const updateExpenseRequest: UpdateExpenseRequest = JSON.parse(event.body)

        const authorization = event.headers.Authorization
        const split = authorization.split(' ')
        const jwtToken = split[1]
        const userId = parseUserId(jwtToken)

        const expense : Expense = await updateExpense(updateExpenseRequest, expenseId, userId)

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
