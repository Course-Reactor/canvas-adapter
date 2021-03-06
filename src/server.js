"use strict";

const fs = require("fs");
const { ApolloServer, gql } = require("apollo-server");
const axios = require("axios");

if (!fs.existsSync(process.cwd() + ".env")) {
  require("dotenv").config();
}

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

  type Course {
    id: Int
    name: String
    course_code: String
    workflow_state: String
    enrollment_term_id: Int
    start_at: String
    end_at: String
    total_students: Int
  }

  type Query {
    enrollment_terms: [EnrollmentTerm]
    enrollment_term(id: String!): EnrollmentTerm
    courses: [Course]
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
    enrollment_term: async (_parent, { id }) => {
      try {
        const response = await axios.get(`/accounts/${ACCOUNT_ID}/terms/${id}`);
        return response.data;
      } catch (e) {
        console.error("Error fetching enrollment_term: ", e);
      }
    },
    courses: async () => {
      try {
        const response = await axios.get(
          `/accounts/${ACCOUNT_ID}/courses?include[]=total_students`
        );
        return response.data;
      } catch (e) {
        console.error("Error fetching courses: ", e);
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
