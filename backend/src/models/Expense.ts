export interface Expense {
    userId: string
    expenseId: string
    name: string
    description: string
    date: string
    amount: number
    attachmentUrl?: string
    tag?: string
}
