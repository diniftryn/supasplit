import { gql } from "@apollo/client";

export const ADD_USER = gql`
  mutation AddUser($username: String!, $imageUrl: String!) {
    addUser(username: $username, imageUrl: $imageUrl) {
      id
      username
      imageUrl
    }
  }
`;

export const ADD_GROUP = gql`
  mutation AddGroup($groupName: String!, $imageUrl: String!, $usersId: [String!]) {
    addGroup(groupName: $groupName, imageUrl: $imageUrl, usersId: $usersId) {
      id
      groupName
      imageUrl
      usersId
    }
  }
`;
