import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache
} from 'apollo-boost';
import gql from 'graphql-tag';
import { isLoggedIn, getAccessToken } from './auth';

const epUrl = 'http://localhost:9000/graphql';

const authLink = new ApolloLink((operation, forward) => {
  if (isLoggedIn()) {
    //options.headers['authorization'] = 'Bearer ' + getAccessToken();
    operation.setContext({
      headers: {
        authorization: 'Bearer ' + getAccessToken()
      }
    });
  }
  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: ApolloLink.from([authLink, new HttpLink({ uri: epUrl })]),
  cache: new InMemoryCache()
});

// async function graphqlRequest(query, variables = {}) {
//   const options = {
//     method: 'POST',
//     headers: { 'content-type': 'application/json' },
//     body: JSON.stringify({ query, variables })
//   };
//   if (isLoggedIn()) {
//     options.headers['authorization'] = 'Bearer ' + getAccessToken();
//   }
//   const response = await fetch(epUrl, options);
//   const resBody = await response.json();
//   if (resBody.errors) {
//     const message = resBody.errors.map(err => err.message).join('\n');
//     throw new Error(message);
//   }
//   return resBody.data;
// }

export async function createJob(input) {
  const mutation = gql`
    mutation CreateJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  //const { job } = await graphqlRequest(mutation, { input });
  const {
    data: { job }
  } = await apolloClient.mutate({ mutation, variables: { input } });
  return job;
}

export async function loadCompany(id) {
  const query = gql`
    query CompanyQuery($id: ID!) {
      company(id: $id) {
        id
        description
        name
        jobs {
          id
          title
        }
      }
    }
  `;
  //const data = await graphqlRequest(query, { id });
  const {
    data: { company }
  } = await apolloClient.query({ query, variables: { id } });
  return company;
}

export async function loadJob(id) {
  const query = gql`
    query JobQuery($id: ID!) {
      job(id: $id) {
        id
        title
        description
        company {
          id
          name
        }
      }
    }
  `;

  //const data = await graphqlRequest(query, { id });
  const {
    data: { job }
  } = await apolloClient.query({ query, variables: { id } });
  return job;
}

export async function loadJobs() {
  const query = gql`
    {
      jobs {
        id
        title
        company {
          id
          name
        }
      }
    }
  `;
  const {
    data: { jobs }
  } = await apolloClient.query({ query });
  return jobs;
}
