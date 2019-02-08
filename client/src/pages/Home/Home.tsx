import React, { Component, Fragment } from 'react';
import './Home.css';

import AddForm from '../../components/AddForm/AddForm';
import EditForm from '../../components/EditForm/EditForm';
import DeleteForm from '../../components/DeleteForm/DeleteForm';
import ActionMenu from '../../components/ActionMenu/ActionMenu';

interface IHomeState {
  formType: string,
}

class Home extends Component<{}, IHomeState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      formType: 'add',
    }
  }

  private toggleFormType = (formType: string) => {
    this.setState({ formType });
  }

  public render() {
    return (
      <Fragment>
        {this.state.formType === 'add' && <AddForm/>}
        {this.state.formType === 'edit' && <EditForm/>}
        {this.state.formType === 'delete' && <DeleteForm/>}
        <ActionMenu toggleFormType={this.toggleFormType}/>
      </Fragment>
    );
  }
}

export default Home;
