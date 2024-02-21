import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($username: String!, $email: String!) {
    addUser(username: $username, email: $email) {
      id
      username
      email
    }
  }
`;
