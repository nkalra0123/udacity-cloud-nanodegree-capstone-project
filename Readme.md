# Expense Tracking App

Implementing a Expense Tracking App for Capstone project of https://www.udacity.com/course/cloud-developer-nanodegree--nd9990

# Functionality of the application

This application will allow creating/removing/updating/fetching (CRUD) Expenses. 

The application stores Expense items, and each Expense item contains the following fields:

* `expenseId` (string) - a unique id for an item
* `userId` (string) - a unique id for the user who created it
* `date` (string) - date and time when an item was created or updated
* `name` (string) - name of a Expense item (e.g. "Shopping Mall bill")
* `description` (string) - description of the bill (e.g. "shirts for friends")
* `amount` (float) - amount of the bill

In this project, auth is configured in `serverless.yml` file:

* `Auth` - this function implements a custom authorizer for API Gateway and all lambda functions use it.

* `GetExpenses` - returns all Expenses for a current user. A user id can be extracted from a JWT token that is sent by the postman

It returns data that looks like this:

```json
{
  "expense": [
    {
      "amount": 190,
      "date": "2021-02-28T08:08:27.802Z",
      "description": "test expense2 - description- 1st account-1",
      "name": "test expense2 - 1st account1",
      "userId": "google-oauth2|115387772605073873555",
      "expenseId": "1c84526b-28c0-4f0c-ad6a-2ec7e3b9a7db"
    },
    {
      "amount": 45500.9,
      "date": "2021-02-28T08:09:15.341Z",
      "description": "test expense4 - description- 1st account-1",
      "name": "test expense4 - 1st account1",
      "userId": "google-oauth2|115387772605073873555",
      "expenseId": "29cdba07-8c7e-444f-8e34-0a5dc4bc8535"
    },
    {
      "amount": 90,
      "date": "2021-02-28T08:09:56.728Z",
      "description": "test expense - modified",
      "name": "test expense -- modified ",
      "userId": "google-oauth2|115387772605073873555",
      "expenseId": "3e90561d-d636-486c-8d6d-d43d32196608"
    }
  ]
}
```

* `CreateExpense` - creates a new Expense for a current user. A shape of data send by a client application to this function can be found in the `CreateExpenseRequest.ts` file

```json
{
  "name" : "test expense4 - 1st account1",
  "description" : "test expense4 - description- 1st account-1",
  "amount": 45500.90
}
```

It should return a new Expense item that looks like this:

```json
{
  "expense": {
    "userId": "google-oauth2|115387772605073873555",
    "expenseId": "29cdba07-8c7e-444f-8e34-0a5dc4bc8535",
    "name": "test expense4 - 1st account1",
    "description": "test expense4 - description- 1st account-1",
    "date": "2021-02-28T08:09:15.341Z",
    "amount": 45500.9
  }
}
```

* `UpdateExpense` - should update a Expense item created by a current user. A shape of data send by a client application to this function can be found in the `UpdateExpenseRequest.ts` file

It receives an object that contains three fields that can be updated in a TODO item:

```json
{
  "name" : "test expense -- modified ",
  "description" : "test expense - modified",
  "amount" : 90
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return the updated Expense item that looks like this:

```json
{
  "expense": {
    "userId": "google-oauth2|115387772605073873555",
    "expenseId": "29cdba07-8c7e-444f-8e34-0a5dc4bc8535",
    "name": "test expense -- modified ",
    "description": "test expense - modified",
    "date": "2021-02-28T08:09:15.341Z",
    "amount": 90
  }
}
```
* `DeleteExpense` - should delete a Expense item created by a current user. Expects an id of a Expense item to remove.

It should return an empty body.

All functions are connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

## Authentication

To implement authentication, an Auth0 application was created and symmetrically encrypted JWT token is used

# Database Schema
```yml

ExpensesTable:
  Type: AWS::DynamoDB::Table
  Properties:
    AttributeDefinitions:
      - AttributeName: userId
        AttributeType: S
      - AttributeName: expenseId
        AttributeType: S
      - AttributeName: createdAt
        AttributeType: S
    KeySchema:
      - AttributeName: userId
        KeyType: HASH
      - AttributeName: expenseId
        KeyType: RANGE
    BillingMode: PAY_PER_REQUEST
    TableName: ${self:provider.environment.EXPENSES_TABLE}
    LocalSecondaryIndexes:
      - IndexName: ${self:provider.environment.INDEX_NAME}
        KeySchema:
          - AttributeName: userId
            KeyType: HASH
          - AttributeName: createdAt
            KeyType: RANGE
        Projection:
          ProjectionType: ALL # What attributes will be copied to an index


```
# How to run the application

# Postman collection

You can use the Postman collection that contains sample requests. You can find a Postman collection in this project. To import this collection, do the following.

<h4> Use udacity-capstone-project.postman_collection.json </h4>

Click on the import button:

![Alt text](images/import-collection-1.png?raw=true "Image 1")


Click on the "Choose Files":

![Alt text](images/import-collection-2.png?raw=true "Image 2")


Select a file to import:

![Alt text](images/import-collection-3.png?raw=true "Image 3")

Edit the Collection, and go to Authorization tab, click Get New Access Token
![Alt text](images/get_new_access_token.png?raw=true "Image 4")

Your Brower, will open, Login using Google, and click Open Postman (You might have to turn on Allow Popups) 
![Alt text](images/chrome_redirect_to_postman.png?raw=true "Image 5")

Postman will show Authentication Complete Window, Click Proceed, or wait 5 sec
![Alt text](images/postman_successful_auth.png?raw=true "Image 6")

Click Use Token
![Alt text](images/access_token_postman.png?raw=true "Image 7")

Click Update

![Alt text](images/update_postman_access_token.png?raw=true "Image 8")

If your authentication is not successful, API will show "Unauthorized Error, with 401 code"
![Alt text](images/unauthorized_access.png?raw=true "Image 10")

If your authentication is successful, you will get empty response on GetALLExpenses, until you create an Expense
![Alt text](images/empty_getexpense_response.png?raw=true "Image 11")

Go to CreateExpense request, and send some request with data
![Alt text](images/create_new_expense.png?raw=true "Image 12")

Successful getExpense call, will show the expense you have added
![Alt text](images/successful_get_expense.png?raw=true "Image 13")

Successful getExpense call, will show the all the expense you have added, after multiple create requests

![Alt text](images/get_expense_after_multuiple_posts.png?raw=true "Image 14")


You have to follow Same steps to get a new token, this time you can login with a different account in your browser window.

Tracing request in AWS
![Alt text](images/tracing_in_aws.png?raw=true "Image 15")
