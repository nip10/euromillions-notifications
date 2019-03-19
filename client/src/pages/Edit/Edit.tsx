import React, { useEffect, useState } from "react";
import { match } from "react-router-dom";
import Axios, { AxiosResponse } from "axios";
import "./Edit.css";

interface IMatch {
  token: string;
  minPrize: string;
}

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev
  ? "http://localhost:3001"
  : "https://www.api.euronotify.diogocardoso.me";

const Edit = (match: match<IMatch>) => {
  const [message, setMessage] = useState("");
  // More info on why this is done like this: https://www.robinwieruch.de/react-hooks-fetch-data/
  useEffect(() => {
    const reqEdit = async () => {
      const { token, minPrize } = match.params;
      try {
        const res: AxiosResponse = await Axios.post(
          `${API_BASE_URL}/editnotification/confirm`,
          { token, minPrize }
        );
        setMessage("Success! Notification edited.");
        // console.log("Success! Notification edited.");
      } catch (error) {
        setMessage("Error!");
        // console.log("Error:", error);
      }
    };
    reqEdit();
  }, []);

  return (
    <div>
      <p> {message} </p>
    </div>
  );
};

export default Edit;
