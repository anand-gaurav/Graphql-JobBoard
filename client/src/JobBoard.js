import React, { Component } from 'react';
import { JobList } from './JobList';
import { loadJobs } from './request';
import { Redirect } from 'react-router-dom';
import { isLoggedIn } from './auth';

export class JobBoard extends Component {
  constructor(props) {
    super(props);
    this.state = { jobs: [] };
  }

  async componentDidMount() {
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      const jobs = await loadJobs();
      this.setState({ jobs });
    } else {
      return null;
    }
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
    const loggedIn = isLoggedIn();
    if (loggedIn) {
      const { jobs } = this.state;
      return (
        <div>
          <h1 className="title">Job Board</h1>
          <JobList jobs={jobs} />
        </div>
      );
    } else {
      return <Redirect to="/login" />;
    }
  }
}
