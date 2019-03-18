import React, { Component } from "react";
import Axios, { AxiosResponse } from "axios";
import classNames from "classnames";
import "./DeleteForm.css";

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev
  ? "http://localhost:3001"
  : "https://www.api.em.diogocardoso.me";

interface IDeleteFormState {
  email: string;
}

export default class DeleteForm extends Component<{}, IDeleteFormState> {
  constructor(props: {}) {
    super(props);
    this.state = { email: "" };
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = this.state.email;
    try {
      const res: AxiosResponse = await Axios.post(
        `${API_BASE_URL}/deletenotification`,
        { email }
      );
      console.log("Success! Notification deleted.");
    } catch (error) {
      console.log("Error:", error);
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
