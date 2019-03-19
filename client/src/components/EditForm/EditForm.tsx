import React, { Component } from "react";
import Axios, { AxiosResponse } from "axios";
import classNames from "classnames";
import "./EditForm.css";

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev
  ? "http://localhost:3001"
  : "https://www.api.euronotify.diogocardoso.me";

interface IEditFormState {
  email: string;
  minPrize: number;
}

interface IEditFormProps {
  setMessage: (message: string) => void;
  clearMessage: () => void;
}

export default class EditForm extends Component<
  IEditFormProps,
  IEditFormState
> {
  constructor(props: IEditFormProps) {
    super(props);
    // this.state = { email: '', minPrize: 0, validationError: false };
    this.state = { email: "", minPrize: 0 };
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  };

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    this.props.clearMessage();
    const email = this.state.email;
    const minPrize = this.state.minPrize;
    try {
      const res: AxiosResponse = await Axios.post(
        `${API_BASE_URL}/editnotification/request`,
        { email, minPrize }
      );
      console.log("Success! Notification edited.");
    } catch (error) {
      console.log("Error:", error);
    }
  };

  public render() {
    const emailInputClass = classNames("form-input-email", {
      // 'form-input-url-invalid': this.state.validationError,
    });
    const minprizeInputClass = classNames("form-input-minprize", {
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
        <div className="form-minprize-container">
          <input
            name="minPrize"
            className={minprizeInputClass}
            type="number"
            value={this.state.minPrize}
            onChange={this.handleChange}
            min={15}
            max={300}
            required
          />
          <span className="form-input-minprize-currency">M€</span>
        </div>
        <button className="form-submit-url" type="submit">
          Notify me !
        </button>
      </form>
    );
  }
}
