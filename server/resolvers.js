const db = require('./db');
const Query = {
  //first argument to a resolver function is the parent value. In this case is the root object
  // we are not going to use the root object parameter anyway. What we are really intrested is
  // is the second param 'args'. This will contain the argument passed in graph query
  //  job: (root, args) => db.jobs.get(args.id),
  job: (root, { id }) => db.jobs.get(id),
  jobs: () => db.jobs.list(),
  company: (root, args) => db.companies.get(args.id)
};

const Mutation = {
  createJob: (root, { input }, context) => {
    console.log(context);
    if (!context.user) {
      throw new Error('Unauthorized');
    }
    const id = db.jobs.create({ ...input, companyId: context.user.companyId });
    return db.jobs.get(id);
  }
};

const Company = {
  jobs: company => db.jobs.list().filter(job => job.companyId === company.id)
};

//'Job' exact name is present in schema file. Appolo server maps the name between schema and resolver
const Job = {
  // in this case parent is the 'job' for which we want to resolve the company
  company: job => db.companies.get(job.companyId)
};

module.exports = { Query, Mutation, Company, Job };
