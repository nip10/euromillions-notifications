import React, { Component, Fragment } from 'react';
import GithubCorner from 'react-github-corner';
import './App.css';

import Title from '../../components/Title/Title';
import Form from '../../components/Form/Form';
import ActionMenu from '../../components/ActionMenu/ActionMenu';

interface IAppState {
  formType: string,
}

class App extends Component<{}, IAppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      formType: 'add',
    }
  }

  toggleFormType = (formType: string) => {
    this.setState({ formType });
  }

  render() {
    return (
      <Fragment>
        <Title />
        <Form type={this.state.formType}/>
        <ActionMenu toggleFormType={this.toggleFormType}/>
        <GithubCorner href='https://github.com/nip10/euromillions-notifications' />
      </Fragment>
    );
  }
}

export default App;
