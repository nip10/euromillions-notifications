import React, { Component, Fragment } from 'react';
import GithubCorner from 'react-github-corner';
import './App.css';

import Title from '../../components/Title/Title';
import Form from '../../components/Form/Form';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Title />
        <Form />
        <GithubCorner href='https://github.com/nip10/euromillions-notifications' />
      </Fragment>
    );
  }
}

export default App;
