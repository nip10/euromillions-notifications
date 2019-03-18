import React, { Component, Fragment } from "react";
import "./Home.css";

import AddForm from "../../components/AddForm/AddForm";
import EditForm from "../../components/EditForm/EditForm";
import DeleteForm from "../../components/DeleteForm/DeleteForm";
import ActionMenu from "../../components/ActionMenu/ActionMenu";

enum FormTypes {
  add = "add",
  edit = "edit",
  delete = "delete"
}

interface IHomeState {
  formType: FormTypes;
}

interface IHomeProps {
  formType: FormTypes;
}

class Home extends Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      formType: this.props.formType
    };
  }

  static getDerivedStateFromProps(nextProps: IHomeProps) {
    return {
      formType: nextProps.formType
    };
  }

  public render() {
    return (
      <Fragment>
        {this.state.formType === FormTypes.add && <AddForm />}
        {this.state.formType === FormTypes.edit && <EditForm />}
        {this.state.formType === FormTypes.delete && <DeleteForm />}
        <ActionMenu formType={this.state.formType} />
      </Fragment>
    );
  }
}

export default Home;
