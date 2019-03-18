import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";
import Layout from "../Layout/Layout";
import Home from "../../pages/Home/Home";
import Delete from "../../pages/Delete/Delete";
import Edit from "../../pages/Edit/Edit";

enum FormTypes {
  add = "add",
  edit = "edit",
  delete = "delete"
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route
            exact
            path="/"
            render={props => <Home formType={FormTypes.add} {...props} />}
          />
          <Route path="/editnotification/:token/:minPrize" component={Edit} />
          <Route
            exact
            path="/editnotification"
            render={props => <Home formType={FormTypes.edit} {...props} />}
          />
          <Route path="/deletenotification/:token" component={Delete} />
          <Route
            exact
            path="/deletenotification"
            render={props => <Home formType={FormTypes.delete} {...props} />}
          />
          <Redirect to="/" />
        </Switch>
      </Layout>
    </Router>
  );
};

export default App;
