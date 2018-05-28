import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import Gallery from 'react-photo-gallery';
import request from 'superagent';

var instagramPhotos = []
var galleryPhotos = []

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
          <Gallery
            photos = {galleryPhotos}
            columns = '3'
          />
        </div>
      </div>
    );
  }

  componentWillMount() {
    this.fetchPhotos()
  }

  fetchPhotos() {
    request
      .get('https://api.instagram.com/v1/users/self/media/recent/?access_token=5595710377.1677ed0.c25766714d014a689bd34cadda11e520')
      .then((res) => {
        instagramPhotos = res.body.data
        galleryPhotos = []

        for (var i = 0; i <  Math.floor(instagramPhotos.length / 3) * 3; i++) {
          galleryPhotos.push({
            src: instagramPhotos[i].images.low_resolution.url,
            width: 1,
            height: 1
          })
        }

        console.log(galleryPhotos)
        this.forceUpdate()
      })
  }
}

export default App;
