import React, { Fragment } from 'react';
import { NavBar } from './components/layouts/NavBar';
import { Landing } from './components/layouts/Landing';
import './App.css';

const App = () => (
  <Fragment>
    <NavBar></NavBar>
    <Landing></Landing>
  </Fragment>
);

export default App;



// <header className="App-header">
// <img src={logo} className="App-logo" alt="logo" />
// <p>
//   Edit <code>src/App.js</code> and save to reload.
// </p>
// <a
//   className="App-link"
//   href="https://reactjs.org"
//   target="_blank"
//   rel="noopener noreferrer"
// >
//   Learn React
// </a>
// </header>