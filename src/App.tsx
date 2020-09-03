import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import MultipleLevelSelection from 'components/MultipleLevelSelection';
import { getCategoriesByParentId } from './seeds';

function App() {
  const [category, setCategory] = useState<Category>();
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
        <div className="example">
          <div className="flex flex-col flex-align-center">
            <p>Selected category: {category?.name}</p>
            <MultipleLevelSelection
              initialItems={getCategoriesByParentId(0)}
              getItemKey={(item) => item.categoryId}
              getItemLabel={(item) => item.name}
              getNestedItems={(item) =>
                getCategoriesByParentId(item.categoryId)
              }
              hasNestedItems={(_, level) => level < 3}
              isEqual={(item, item2) => item.categoryId === item2.categoryId}
              placeholder="Choose category"
              onChange={setCategory}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
