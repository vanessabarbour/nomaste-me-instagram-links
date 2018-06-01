import React, { Component } from 'react';
import './App.css';
import Gallery from 'react-photo-gallery';
import request from 'superagent';

var initialWindowSize = 0
const photoResolutionThreshold = 1000

const minimumNumberOfPhotos = 10
const numberOfColumns = 2
const photosMargin = 1

var recipePosts = []
var galleryPhotos = []

var instagramAccessToken = "5595710377.1677ed0.c25766714d014a689bd34cadda11e520"

function recipeLink(instagramPost) {
  let caption = instagramPost.caption.text
  let linkIndex = caption.indexOf("bit.ly")
  if (linkIndex === -1) {
    return null
  }

  return "https://" + caption.substring(linkIndex, caption.length)
}

function photoSelected(event, info) {
  window.location.href = recipePosts[info.index].recipe_link
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
    request.get("https://api.instagram.com/v1/users/self/media/recent/?access_token=" + instagramAccessToken)
      .then((res) => {
        galleryPhotos = []

        recipePosts = this.filterInstagramResultsToRecipes(res)
        this.addPosts(recipePosts)
        this.fetchMorePhotosIfNeeded(res.body.pagination.next_url)

      })
  }

  fetchMorePhotosIfNeeded(nextURL) {
    if (nextURL == null || recipePosts.length >= minimumNumberOfPhotos) {
      this.removeExtras()
      this.forceUpdate()
      return
    }

    request.get(nextURL)
      .then((res) => {
        let nextRecipePosts = this.filterInstagramResultsToRecipes(res)
        this.addPosts(nextRecipePosts)
        recipePosts = recipePosts.concat(nextRecipePosts)
        this.fetchMorePhotosIfNeeded(res.body.pagination.next_url)
      })
  }

  removeExtras() {
    while (recipePosts.length % numberOfColumns != 0) {
      recipePosts.pop()
      galleryPhotos.pop()
    }
  }

  filterInstagramResultsToRecipes(res) {
    var posts = res.body.data
    for (var i = 0; i < posts.length; i++) {
      let link = recipeLink(posts[i])
      posts[i].recipe_link = link
    }
    return posts.filter((elem, index, arr) => elem.recipe_link != null)
  }


  addPosts(posts) {
    for (var i = 0; i < posts.length; i++) {
      if (initialWindowSize > photoResolutionThreshold) {
        galleryPhotos.push({
          src: posts[i].images.standard_resolution.url,
          width: 1,
          height: 1
        })
      }
      else {
        galleryPhotos.push({
          src: posts[i].images.low_resolution.url,
          width: 1,
          height: 1
        })
      }
    }

    this.forceUpdate()
  }
}

export default App;
