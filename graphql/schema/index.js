const { buildSchema } = require('graphql');

module.exports = buildSchema(`


type User {
  _id: ID!
  email: String!
  password: String
}

type AuthData {
  userId: ID!
  token: String!
  tokenExpiration: Int!
}
type UserDetails {
  userId: ID!
  fname:String!
  lname:String
  email:String!
  dob:String!
}

input UserInput {
  fname: String!
  lname: String
  email: String!
  password: String!
  dob: String!
}

type RootQuery {
    login(email: String!, password: String!): AuthData!
    userDetails(userId: String!): UserDetails
}

type RootMutation {
    createUser(userInput: UserInput): User
   
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);
