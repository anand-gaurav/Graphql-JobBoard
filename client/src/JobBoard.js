import React, { Component } from 'react';
import { JobList } from './JobList';
import { loadJobs } from './request';
import { isLoggedIn, logout } from './auth';

export class JobBoard extends Component {
  constructor(props) {
    super(props);
    this.state = { jobs: [], loggedIn: isLoggedIn() };
  }

  async componentDidMount() {
    const jobs = await loadJobs();
    this.setState({ jobs });
  }

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   console.log(prevState.loggedIn);
  //   console.log(nextProps.loggedIn);
  //   if (nextProps.loggedIn && prevState.loggedIn !== nextProps.loggedIn) {
  //     return {
  //       loggedIn: nextProps.loggedIn
  //     };
  //   }

  //   // Return null to indicate no change to state.
  //   return null;
  // }

  render() {
    const { jobs, loggedIn } = this.state;
    if (loggedIn) {
      return (
        <div>
          <h1 className="title">Job Board</h1>
          <JobList jobs={jobs} />
        </div>
      );
    } else {
      return <div>Please Login</div>;
    }
  }
}
