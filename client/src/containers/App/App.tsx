import React, { Fragment } from 'react';

import GithubCorner from 'react-github-corner';
import Title from '../../components/Title/Title';

const App = ({ children }: any) => {
  return (
    <Fragment>
      <Title />
      {children}
      <GithubCorner href='https://github.com/nip10/euromillions-notifications' />
    </Fragment>
  );
};

export default App;
