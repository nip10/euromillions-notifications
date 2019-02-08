import React from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

import App from '../App/App';
import Home from '../../pages/Home/Home';
import Edit from '../../pages/Edit/Edit';
import Delete from '../../pages/Delete/Delete';

const Root = (props: any) => {
  return (
    <Router>
      <App>
        <Switch>
          <Route exact path="/" component={ Home } />
          <Route path="/editnotification/:token/:minPrize" component={ Edit } />
          <Route path="/deletenotification/:token" component={ Delete } />
          <Redirect to="/" />
        </Switch>
      </App>
    </Router>
  );
};

export default Root;