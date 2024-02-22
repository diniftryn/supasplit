import { gql } from "@apollo/client";

export const GET_USERS = gql`
  query getUsers {
    users {
      id
      username
      email
    }
  }
`;

export const GET_GROUPS = gql`
  query getGroups {
    groups {
      id
      groupName
      imageUrl
      users {
        id
        username
      }
    }
  }
`;

export const GET_GROUP = gql`
  query getGroup($id: Int!) {
    group(id: $id) {
      id
      groupName
      users {
        id
        username
      }
      expenses {
        id
        description
        amount
        createdAt
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
      createdAt
      payer {
        id
        username
      }
    }
  }
`;

export const GET_EXPENSE = gql`
  query getExpense($id: Int!) {
    expense {
      id
      description
      amount
      createdAt
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
