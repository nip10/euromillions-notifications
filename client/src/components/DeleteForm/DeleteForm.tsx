import React, { Component } from "react";
import Axios, { AxiosResponse } from "axios";
import classNames from "classnames";
import "./DeleteForm.css";

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev
  ? "http://localhost:3001"
  : "https://www.api.euronotify.diogocardoso.me";

interface IDeleteFormState {
  email: string;
}

interface IEditFormProps {
  setMessage: (message: string) => void;
  clearMessage: () => void;
}

export default class DeleteForm extends Component<
  IEditFormProps,
  IDeleteFormState
> {
  constructor(props: IEditFormProps) {
    super(props);
    this.state = { email: "" };
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.clearMessage();
    const email = this.state.email;
    try {
      const res: AxiosResponse = await Axios.post(
        `${API_BASE_URL}/deletenotification`,
        { email }
      );
      console.log("Success! Notification deleted.");
      this.props.setMessage("Success! Notification deleted.");
    } catch (error) {
      console.log("Error:", error);
      this.props.setMessage("Error deleting notification.");
    }
  };

  public render() {
    const emailInputClass = classNames("form-input-email", {
      // 'form-input-url-invalid': this.state.validationError,
    });
    return (
      <form onSubmit={this.handleSubmit}>
        <input
          name="email"
          className={emailInputClass}
          type="email"
          value={this.state.email}
          onChange={this.handleChange}
          placeholder="Your email address"
          required
        />
        <button className="form-submit-url" type="submit">
          Notify me !
        </button>
      </form>
    );
  }
}
