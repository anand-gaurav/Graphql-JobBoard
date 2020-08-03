const db = require('./db');
const Query = {
  //first argument to a resolver function is the parent value. In this case is the root object
  // we are not going to use the root object parameter anyway. What we are really intrested is
  // is the second param 'args'. This will contain the argument passed in graph query
  //  job: (root, args) => db.jobs.get(args.id),
  job: (root, { id }) => db.jobs.get(id),

  allJobs: (root, args, { user }) => {
    console.log(user);
    if (user && user.role && user.role.includes('Admin')) {
      return db.jobs.list();
    } else {
      throw new Error('Unauthorized: Not an admin');
    }
  },

  jobs: (root, args, { user }) => {
    console.log('User:' + JSON.stringify(user));
    if (!user) {
      throw new Error('Unauthorized: User details not found');
    } else if (user && user.role.includes('Admin')) {
      console.log('Admin');
      return db.jobs.list();
    } else if (user && user.role.includes('ExtUser')) {
      return db.jobs.list().filter((job) => job.companyId === user.companyId);
    } else {
      throw new Error('Unauthorized: No roles found');
    }
  },
  company: (root, args) => db.companies.get(args.id),
};

const Mutation = {
  createJob: (root, { input }, context) => {
    console.log(context);
    if (!context.user) {
      throw new Error('Unauthorized in mutation: User details not found');
    }
    const id = db.jobs.create({ ...input, companyId: context.user.companyId });
    return db.jobs.get(id);
  },
};

const Company = {
  jobs: (company) =>
    db.jobs.list().filter((job) => job.companyId === company.id),
  companyDescription: (company) => company.companyDescription,
};

//'Job' exact name is present in schema file. Appolo server maps the name between schema and resolver
const Job = {
  // in this case parent is the 'job' for which we want to resolve the company
  company: (job) => db.companies.get(job.companyId),
  jobDescription: (job) => job.jobDescription,
};

module.exports = { Query, Mutation, Company, Job };
