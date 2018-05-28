import React, { Component } from 'react';
import './App.css';
import Gallery from 'react-photo-gallery';
import request from 'superagent';

var initialWindowSize = 0
const photoResolutionThreshold = 1000

const numberOfColumns = 3

var instagramPhotos = []
var galleryPhotos = []

function photoSelected(event, info) {
  // console.log(info)
  let instagramPhoto = instagramPhotos[info.index]
  let caption = instagramPhoto.caption.text
  let linkIndex = caption.indexOf("bit.ly")
  if (linkIndex !== -1) {
    let link = caption.substring(linkIndex, caption.length)
    window.location.href = "https://" + link
  }
}

function getImageComponent({ index, onClick, photo, margin}) {
  const imgWithClick = { cursor: 'pointer' };
  const imgStyle = { display: 'block', float: 'left', margin: margin, objectFit: 'cover' };

  return (
    <img
        style={onClick ? { ...imgStyle, ...imgWithClick } : imgStyle}
        {...photo}
        onClick={(e) => photoSelected(e, {index, photo})}
        alt="Failed to load"
      />
  )
}

class App extends Component {
  render() {
    return (
      <div className="App">
        <Gallery
          photos = {galleryPhotos}
          columns = {numberOfColumns}
          onClick = {photoSelected}
          ImageComponent = {getImageComponent}
        />
      </div>
    );
  }

  componentWillMount() {
    initialWindowSize = window.innerWidth
    this.fetchPhotos()
  }

  fetchPhotos() {
    request
      .get('https://api.instagram.com/v1/users/self/media/recent/?access_token=5595710377.1677ed0.c25766714d014a689bd34cadda11e520')
      .then((res) => {
        instagramPhotos = res.body.data
        galleryPhotos = []

        for (var i = 0; i <  Math.floor(instagramPhotos.length / 3) * 3; i++) {
          if (initialWindowSize > photoResolutionThreshold) {
            galleryPhotos.push({
              src: instagramPhotos[i].images.standard_resolution.url,
              width: 1,
              height: 1
            })
          }
          else {
            galleryPhotos.push({
              src: instagramPhotos[i].images.low_resolution.url,
              width: 1,
              height: 1
            })
          }
        }

        this.forceUpdate()
      })
  }
}

export default App;
