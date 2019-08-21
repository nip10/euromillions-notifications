import React, { useEffect, useState } from "react";
import { match } from "react-router-dom";
import Axios from "axios";

interface IMatch {
  token: string;
}

const isDev = process.env.NODE_ENV === "development";
const API_BASE_URL = isDev
  ? "http://localhost:3001"
  : "https://www.api.euronotify.diogocardoso.me";

const Delete = (match: match<IMatch>) => {
  const [message, setMessage] = useState("");
  // More info on why this is done like this: https://www.robinwieruch.de/react-hooks-fetch-data/
  useEffect(() => {
    const reqDelete = async () => {
      const { token } = match.params;
      try {
        await Axios.post(`${API_BASE_URL}/deletenotification/confirm`, {
          token
        });
        setMessage("Success! Notification deleted.");
        // console.log("Success! Notification deleted.");
      } catch (error) {
        setMessage("Error!");
        // console.log("Error:", error);
      }
    };
    reqDelete();

  }, [match.params]);

  return (
    <div>
      <p> {message} </p>
    </div>
  );
};

export default Delete;
