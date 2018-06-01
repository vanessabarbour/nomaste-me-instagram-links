import React, { Component } from 'react';
import './App.css';
import Gallery from 'react-photo-gallery';
import request from 'superagent';

var initialWindowSize = 0
const photoResolutionThreshold = 1000

const numberOfColumns = 2
const photosMargin = 1

var instagramPhotos = []
var galleryPhotos = []

function recipeLink(instagramPost) {
  let caption = instagramPost.caption.text
  let linkIndex = caption.indexOf("bit.ly")
  if (linkIndex === -1) {
    return null
  }

  return "https://" + caption.substring(linkIndex, caption.length)
}

function photoSelected(event, info) {
  window.location.href = instagramPhotos[info.index].recipe_link
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
          margin = {photosMargin}
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
        var i = 0

        instagramPhotos = res.body.data
        for (i = 0; i < instagramPhotos.length; i++) {
          let link = recipeLink(instagramPhotos[i])
          instagramPhotos[i].recipe_link = link
        }
        instagramPhotos = instagramPhotos.filter((elem, index, arr) => elem.recipe_link != null)

        galleryPhotos = []
        for (i = 0; i < Math.floor(instagramPhotos.length / numberOfColumns) * numberOfColumns; i++) {
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
