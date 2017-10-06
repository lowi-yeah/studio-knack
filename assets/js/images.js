import util from './util'
let ImageWorker = require('worker-loader!./workers/image-worker.js')

function _imageUrls() {
  let items = document.querySelectorAll('.grid-item')
  return _.map(items, i => {
    return {id:   i.getAttribute('id'),
            url:  i.getAttribute('data-image-url')} }) }

function init() {
  console.log('_loadImages')
  let urls = _imageUrls(),
      ιWorker = new ImageWorker(),
      η = 0

  let debug = false

  ιWorker.onmessage = function (event) {
    let {ι, id} = event.data
    document.querySelector(`#${id} .image`).style.backgroundImage = ι

    η += 1
    if(η === urls.length) {
      console.log('image worker finished')
      ιWorker.terminate() // Terminate the worker
      ιWorker = null  
    }
  } 

  ιWorker.postMessage(urls) // send message to worker
}

export default { init }