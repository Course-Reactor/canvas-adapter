"use strict";

const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

const ACCOUNT_ID = process.env.ACCOUNT_ID;

axios.defaults.baseURL = process.env.BASE_URL;
axios.defaults.headers.common["Authorization"] =
  process.env.AUTHORIZATION_HEADER;

const typeDefs = gql`
  type EnrollmentTerm {
    id: Int
    name: String
    start_at: String
    end_at: String
    workflow_state: String
  }

  type User {
    id: Int
    name: String
    sortable_name: String
    short_name: String
    login_id: String
    avatar_url: String
    email: String
    last_login: String
  }

  type Query {
    enrollment_terms: [EnrollmentTerm]
    users: [User]
  }
`;

const resolvers = {
  Query: {
    enrollment_terms: async () => {
      try {
        const response = await axios.get(`/accounts/${ACCOUNT_ID}/terms`);
        return response.data.enrollment_terms;
      } catch (e) {
        console.error("Error fetching enrollment_terms: ", e);
      }
    },
    users: async () => {
      try {
        const response = await axios.get(`/accounts/${ACCOUNT_ID}/users`, {
          params: {
            include: ["last_login", "avatar_url", "email"],
          },
        });
        return response.data;
      } catch (e) {
        console.error("Error fetching accounts: ", e);
      }
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`🚀 Server ready at ${url}`));
