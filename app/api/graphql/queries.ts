import { gql } from "@apollo/client";

export const GET_GROUPS = gql`
  query getGroups {
    groups {
      id
      name
      users {
        id
        username
      }
    }
  }
`;

export const GET_GROUP = gql`
  query getGroup($id: ID!) {
    group {
      id
      name
      users {
        id
        username
      }
      expenses {
        id
        description
        amount
        date
        payer {
          id
          username
        }
      }
    }
  }
`;

export const GET_EXPENSES = gql`
  query getExpenses {
    expenses {
      id
      description
      amount
      date
      payer {
        id
        username
      }
    }
  }
`;

export const GET_EXPENSE = gql`
  query getExpense($id: ID!) {
    expense {
      id
      description
      amount
      date
      payer {
        id
        username
      }
      participants {
        id
        shareAmount
        user {
          id
          username
        }
      }
    }
  }
`;

export const GET_PARTICIPANTS = gql`
  query participants {
    id
    shareAmount
    user {
      id
      username
    }
  }
`;
