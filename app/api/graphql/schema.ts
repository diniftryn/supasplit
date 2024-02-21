export const typeDefs = `#graphql 
  type User {
    id: Int
    username: String
    email: String
    expenses: [Expense]
    paymentsPayer: [Payment]
    paymentsPayee: [Payment]
    groups: [Group]
    participants: [Participant]
  }

  type Group {
    id: Int
    groupName: String
    users: [User]
    expenses: [Expense]
  }

  type Expense {
    id: Int
    description: String
    amount: Float
    date: DateTime
    payerId: Int
    groupId: Int
    payer: User
    participants: [Participant]
    group: Group
  }

  type Participant {
    id: Int
    expenseId: Int
    userId: Int
    shareAmount: Float
    user: User
    expense: Expense
  }

  type Payment {
    id: Int
    payerId: Int
    payeeId: Int
    amount: Float
    date: DateTime
    payer: User
    payee: User
  }

  type DateTime {
    value: String
  }
`;
