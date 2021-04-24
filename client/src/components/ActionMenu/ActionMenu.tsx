import React, { Component, Fragment } from "react";
import "./ActionMenu.css";
import { Redirect } from "react-router-dom";

interface IActionsMenuState {
  redirectToEdit: boolean;
  redirectToDelete: boolean;
  redirectToCreate: boolean;
}

enum FormTypes {
  add = "add",
  edit = "edit",
  delete = "delete"
}

interface IActionsMenuProps {
  formType: FormTypes;
}

// This is the website navigation. The reason why its not a simple function with anchor
// tags is that this offers a better UX since there are no page reloads and it feels a lot smoother
class ActionMenu extends Component<IActionsMenuProps, IActionsMenuState> {
  constructor(props: IActionsMenuProps) {
    super(props);
    this.state = {
      redirectToEdit: false,
      redirectToDelete: false,
      redirectToCreate: false
    };
  }

  private toggleRedirectToEdit = () =>
    this.setState({
      ...this.state,
      redirectToEdit: true,
    });

  private toggleRedirectToCreate = () =>
    this.setState({
      ...this.state,
      redirectToCreate: true,
    });

  private toggleRedirectToDelete = () =>
    this.setState({
      ...this.state,
      redirectToDelete: true,
    });

  private renderRedirectToEdit = () => <Redirect to="/editnotification" />;

  private renderRedirectToDelete = () => <Redirect to="/deletenotification" />;

  private renderRedirectToCreate = () => <Redirect to="/" />;

  public render() {
    return (
      <Fragment>
        {this.state.redirectToEdit && this.renderRedirectToEdit()}
        {this.state.redirectToDelete && this.renderRedirectToDelete()}
        {this.state.redirectToCreate && this.renderRedirectToCreate()}
        <nav className="actionmenu-container">
          {this.props.formType !== FormTypes.add && (
            <span onClick={() => this.toggleRedirectToCreate()}>
              Create Notification
            </span>
          )}
          {this.props.formType !== FormTypes.edit && (
            <span onClick={() => this.toggleRedirectToEdit()}>
              Edit Notification
            </span>
          )}
          {this.props.formType !== FormTypes.delete && (
            <span onClick={() => this.toggleRedirectToDelete()}>
              Delete Notification
            </span>
          )}
        </nav>
      </Fragment>
    );
  }
}

export default ActionMenu;
