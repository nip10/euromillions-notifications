import React from 'react';
import Axios, { AxiosResponse } from 'axios';
import classNames from 'classnames';
import './Form.css';

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev ? "http://localhost:3001" : "https://www.api.em.diogocardoso.me";

interface IFormState {
  email: string,
  minPrize: number,
  // validationError: boolean,
}

// interface IFormProps {
//   errorHandler: (message: string) => void,
// }

export default class Form extends React.Component<{}, IFormState> {
  constructor(props: {}) {
    super(props);
    // this.state = { email: '', minPrize: 0, validationError: false };
    this.state = { email: '', minPrize: 0 };
  }

  private handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ ...this.state, [event.target.name]: event.target.value });
  }

  private handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const email = this.state.email;
    const minPrize = this.state.minPrize;
    try {
      const res: AxiosResponse = await Axios.post(`${API_BASE_URL}/createnotification`, { email, minPrize });
      console.log('Success! Notification created.');
      // this.props.errorHandler('');
      // this.setState({ ...this.state, validationError: false });
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // this.props.errorHandler('Invalid request.');
        // this.setState({ ...this.state, validationError: true });
      } else {
        // this.props.errorHandler('Server error. Please try again.');
        // this.setState({ ...this.state, validationError: false });
      }
    }
  }

  public render() {
    const emailInputClass = classNames('form-input-email', {
      // 'form-input-url-invalid': this.state.validationError,
    });
    const minprizeInputClass = classNames('form-input-minprize', {
      // 'form-input-url-invalid': this.state.validationError,
    });
    return (
      <form onSubmit={this.handleSubmit}>
        <input name="email" className={emailInputClass} type="email" value={this.state.email} onChange={this.handleChange} placeholder="Your email address" required/>
        <input name="minPrize" className={minprizeInputClass} type="number" value={this.state.minPrize} onChange={this.handleChange} min={15} max={300} required></input>
        <span className="form-input-minprize-currency">M€</span>
        <button className="form-submit-url" type="submit"> Notify Me </button>
      </form>
    );
  }
}