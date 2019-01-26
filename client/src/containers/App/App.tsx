import React, { Component, Fragment } from 'react';
import './App.css';

import Title from '../../components/Title/Title';
import Form from '../../components/Form/Form';

class App extends Component {
  render() {
    return (
      <Fragment>
        <Title />
        <Form />
      </Fragment>
    );
  }
}

export default App;
