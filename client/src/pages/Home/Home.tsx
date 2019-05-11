import React, { Component, Fragment } from "react";

import AddForm from "../../components/Forms/AddForm/AddForm";
import EditForm from "../../components/Forms/EditForm/EditForm";
import DeleteForm from "../../components/Forms/DeleteForm/DeleteForm";
import ActionMenu from "../../components/ActionMenu/ActionMenu";
import ResMessage from "../../components/ResMessage/ResMessage";

import "../../components/Forms/Forms.css";

enum FormTypes {
  add = "add",
  edit = "edit",
  delete = "delete"
}

interface IHomeState {
  formType: FormTypes;
  message: string;
}

interface IHomeProps {
  formType: FormTypes;
}

class Home extends Component<IHomeProps, IHomeState> {
  constructor(props: IHomeProps) {
    super(props);
    this.state = {
      formType: this.props.formType,
      message: ""
    };
  }

  static getDerivedStateFromProps(nextProps: IHomeProps) {
    return {
      formType: nextProps.formType
    };
  }

  private setMessage = (message: string) => {
    this.setState({ ...this.state, message });
  };

  private clearMessage = () => {
    this.setState({ ...this.state, message: "" });
  };

  public render() {
    return (
      <Fragment>
        {this.state.message.length > 0 && (
          <ResMessage message={this.state.message} />
        )}
        {this.state.formType === FormTypes.add && (
          <AddForm
            setMessage={this.setMessage}
            clearMessage={this.clearMessage}
          />
        )}
        {this.state.formType === FormTypes.edit && (
          <EditForm
            setMessage={this.setMessage}
            clearMessage={this.clearMessage}
          />
        )}
        {this.state.formType === FormTypes.delete && (
          <DeleteForm
            setMessage={this.setMessage}
            clearMessage={this.clearMessage}
          />
        )}
        <ActionMenu formType={this.state.formType} />
      </Fragment>
    );
  }
}

export default Home;
