import {CreateExpenseRequest} from "../requests/CreateExpenseRequest";
import {Expense} from "../models/Expense";
import {ExpenseAccess} from "../dataLayer/ExpenseAccess";
import {UpdateExpenseRequest} from "../requests/UpdateExpenseRequest";

const expenseAccess = new ExpenseAccess();

export async function createExpense(createExpenseRequest: CreateExpenseRequest, userId: string) : Promise<Expense>{
    return await expenseAccess.putExpense(createExpenseRequest, userId);
}

export async function getAllExpenses(userId: string) : Promise<Expense[]>{
    return await expenseAccess.getAllExpenses(userId);
}

export async function getExpense(expenseId: string, userId: string) : Promise<Expense>{
    return await expenseAccess.getExpensebyId(expenseId, userId);
}

export async function deleteExpense(expenseId: string, userId: string) : Promise<void>{
    return await expenseAccess.deleteExpensebyId(expenseId, userId);
}

export async function updateExpense(updateExpenseRequest : UpdateExpenseRequest, expenseId: string, userId: string) : Promise<Expense>{
    return await expenseAccess.updateExpense(updateExpenseRequest, expenseId, userId);
}

