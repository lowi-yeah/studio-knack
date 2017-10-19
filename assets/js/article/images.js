import util from '../common/util'
let ImageWorker   = require('worker-loader!../workers/image-worker.js')

function _urls(attribute) {
  let images = document.querySelectorAll('.worker.image')
  return _(images)
            .map(i => {
              if( !i.getAttribute(attribute) ) return
              return {id:   i.getAttribute('id'),
                      url:  i.getAttribute(attribute)} })
            .compact()
            .value() }

function init() {

  console.log('loading article images')
  let ιUrls   = _urls('data-image-url'),
      // pUrls   = _urls('data-image-palette'),
      // iUrls   = _urls('data-image-info'),
      pUrls   = [],
      iUrls   = [],
      ιWorker = new ImageWorker(),
      ηι      = 0

  let debug = false

  ιWorker.onmessage = function (event) {
    let {ι, id, τ} = event.data,
        item       = document.getElementById(id)

    // if(τ === 'palette') _.defer(() => item.setAttribute('data-luminance', ι.average_luminance))
    if(τ === 'image') _.defer(() => item.style.backgroundImage = ι)
    // if(τ === 'info') console.log('got info', id, ι)

    ηι += 1
    if(ηι === (ιUrls.length + pUrls.length + iUrls.length)) {
      _.delay( () => {
        console.log('image worker finished')
        ιWorker.terminate() // Terminate the worker
        ιWorker = null }, 2000)}
    } 
  ιWorker.postMessage(_.concat(ιUrls, pUrls, iUrls)) // send urls to worker
}

export default { init }