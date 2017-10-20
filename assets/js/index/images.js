import util from '../common/util'
let ImageWorker   = require('worker-loader!../workers/image-worker.js')

function _urls(attribute) {
  let items = document.querySelectorAll('.grid-item')
  return _(items)
            .map(i => {
              if( !i.getAttribute(attribute) ) return
              return {id:   i.getAttribute('id'),
                      url:  i.getAttribute(attribute)} })
            .compact()
            .value() }

function init() {
  // console.log('worker: loading images')
  let ιUrls   = _urls('data-image-url'),
      // pUrls   = _urls('data-image-palette'),
      pUrls   = [],
      ιWorker = new ImageWorker(),
      ηι      = 0

  let debug = false

  ιWorker.onmessage = function (event) {
    let {ι, id, τ} = event.data
    if(τ === 'image')
      document.querySelector(`#${id} .image`).style.backgroundImage = ι

    ηι += 1
    if(ηι === (ιUrls.length + pUrls.length)) {
      ιWorker.terminate() // Terminate the worker
      ιWorker = null }} 
      
  ιWorker.postMessage(_.concat(ιUrls, pUrls)) // send urls to worker
}

export default { init }