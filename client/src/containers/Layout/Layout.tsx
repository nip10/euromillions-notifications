import React, { Fragment } from "react";
import GithubCorner from "react-github-corner";
import Title from "../../components/Title/Title";
import "./Layout.css";

interface ILayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: ILayoutProps) => {
  return (
    <Fragment>
      <Title />
      {children}
      <GithubCorner href="https://github.com/nip10/euromillions-notifications" />
    </Fragment>
  );
};

export default Layout;
