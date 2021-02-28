import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import {deleteExpense} from "../../bussinessLogic/expense";
import {parseUserId} from "../../auth/utils";
import {createLogger} from "../../utils/logger";
const logger = createLogger('deleteExpense')

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
   try {

       logger.info('deleteExpense request received')

       const expenseId = event.pathParameters.expenseId

       const authorization = event.headers.Authorization
       const split = authorization.split(' ')
       const jwtToken = split[1]
       const userId = parseUserId(jwtToken)

       await deleteExpense(expenseId, userId);
       logger.info(`deleteExpense successful for ${expenseId}, ${userId}`)

       return {
           statusCode: 200,
           headers: {
               'Access-Control-Allow-Origin': '*'
           },
           body: ''
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

