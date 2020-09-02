import React from 'react';
import logo from './logo.svg';
import './App.css';
import MultipleLevelSelection from 'components/MultipleLevelSelection';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <main className="App-main">
        <div className="flex flex-row flex-align-center flex-justify-center example">
          <MultipleLevelSelection />
        </div>
      </main>
    </div>
  );
}

export default App;
