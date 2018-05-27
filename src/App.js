import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import { Collection, AutoSizer } from 'react-virtualized'
import 'react-virtualized/styles.css'; // only needs to be imported once

const viewHeight = 500
const numberOfItemsPerRow = 3
const itemWidth = 300
const itemHeight = 300
const itemsPadding = 20

// Collection data as an array of objects
const list = [
  { name: 'Brian Vaughn 1'},
  { name: 'Brian Vaughn 2'},
  { name: 'Brian Vaughn 3'},
  { name: 'Brian Vaughn 4'},
  { name: 'Brian Vaughn 5'},
  { name: 'Brian Vaughn 6'},
  { name: 'Brian Vaughn 11'},
  { name: 'Brian Vaughn 22'},
  { name: 'Brian Vaughn 33'},
  { name: 'Brian Vaughn 44'},
  { name: 'Brian Vaughn 55'},
  { name: 'Brian Vaughn 66'}

  // And so on...
];

function cellRenderer ({ index, key, style }) {
  let borderStyle = { border: '1px solid black' }

  return (
    <div key={key} style={style}>
      <p style={{ border: '1px solid black' }}>
        {list[index].name}
      </p>
    </div>
  )
}

function cellSizeAndPositionGetter ({ index }) {
  const row = Math.floor(index / numberOfItemsPerRow)
  const column = index % numberOfItemsPerRow

  return {
    width: itemWidth,
    height: itemHeight,
    x: itemsPadding + (itemsPadding+itemWidth)*column,
    y: 2*itemsPadding*row,
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>

        <div style={{ border: '1px solid green' }}>


          <AutoSizer >
            {({height, width}) => {
              console.log(`width: ${width}`);
              console.log(`height: ${height}`);
              return (
                <Collection
                  style={{ border: '1px solid blue' }}
                  cellCount={list.length}
                  cellRenderer={cellRenderer}
                  cellSizeAndPositionGetter={cellSizeAndPositionGetter}
                  height={viewHeight}
                  width={width}
                />
                );
              }}
            </AutoSizer>
        </div>
      </div>
    );
  }
}

export default App;
