import util from './util'
let ImageWorker   = require('worker-loader!./workers/image-worker.js')

function _urls(attribute) {
  let items = document.querySelectorAll('.grid-item')
  return _.map(items, i => {
    return {id:   i.getAttribute('id'),
            url:  i.getAttribute(attribute)} }) }

function _imageUrls() {
  let items = document.querySelectorAll('.grid-item')
  return _.map(items, i => {
    return {id:   i.getAttribute('id'),
            url:  i.getAttribute('data-image-url')} }) }

function _infoUrls() {
  let items = document.querySelectorAll('.grid-item')
  return _.map(items, i => {
    return {id:   i.getAttribute('id'),
            url:  i.getAttribute('data-image-url')} }) }


function init() {
  let ιUrls   = _urls('data-image-url'),
      pUrls   = _urls('data-image-palette'),
      ιWorker = new ImageWorker(),
      ηι      = 0

  let debug = false

  ιWorker.onmessage = function (event) {
    let {ι, id, τ} = event.data

    if(τ === 'image')
      document.querySelector(`#${id} .image`).style.backgroundImage = ι

    if(τ === 'palette'){
      let c = ι['dominant_colors'].vibrant
      c = c || ι['dominant_colors']['vibrant_dark']
      c = c || ι['dominant_colors']['vibrant_light']
      c = c || {hex: '#000000'}

      // let c = ι['dominant_colors'].muted
      // c = c || ι['dominant_colors']['muted_dark']
      // c = c || ι['dominant_colors']['muted_light']
      // c = c || {hex: '#000000'}

      document.querySelector(`#${id} .text`).style.color = c.hex
      }


    ηι += 1
    if(ηι === (ιUrls.length + pUrls.length)) {
      console.log('image worker finished')
      ιWorker.terminate() // Terminate the worker
      ιWorker = null }} 
  ιWorker.postMessage(_.concat(ιUrls, pUrls)) // send urls to worker
}

export default { init }