import { isLoggedIn, getAccessToken } from './auth';
const epUrl = 'http://localhost:9000/graphql';

async function graphqlRequest(query, variables = {}) {
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ query, variables })
  };
  if (isLoggedIn()) {
    options.headers['authorization'] = 'Bearer ' + getAccessToken();
  }
  const response = await fetch(epUrl, options);
  const resBody = await response.json();
  if (resBody.errors) {
    const message = resBody.errors.map(err => err.message).join('\n');
    throw new Error(message);
  }
  return resBody.data;
}

export async function createJob(input) {
  const mutation = `mutation CreateJob($input: CreateJobInput){
    job: createJob(input: $input){
      id
      title
      company{
        id
        name
      }
    }
  }
  `;
  const { job } = await graphqlRequest(mutation, { input });
  return job;
}

export async function loadCompany(id) {
  const query = `query CompanyQuery($id: ID!){
    company(id: $id){
      id    
      description
      name
      jobs{
        id
        title
      }
      }
    }`;
  const data = await graphqlRequest(query, { id });
  return data.company;
}

export async function loadJobs() {
  const query = `{
    jobs{
      id
      title
      company{
        id
        name
      }
    }
  }`;

  const { jobs } = await graphqlRequest(query);
  return jobs;
}

export async function loadJob(id) {
  const query = `query JobQuery($id: ID!){
    job(id: $id){
      id
      title
      description
      company{
        id
        name
      }
      }
    }`;
  const data = await graphqlRequest(query, { id });
  return data.job;
}
