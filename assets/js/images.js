import util from './util'
let ImageWorker   = require('worker-loader!./workers/image-worker.js')

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

  console.log('worker: loading images')
  let ιUrls   = _urls('data-image-url'),
      pUrls   = _urls('data-image-palette'),
      // pUrls   = [],
      ιWorker = new ImageWorker(),
      ηι      = 0

  let debug = false

  ιWorker.onmessage = function (event) {
    let {ι, id, τ} = event.data

    // console.log('worker message', id)

    if(τ === 'image')
      document.querySelector(`#${id} .image`).style.backgroundImage = ι

    if(τ === 'palette'){
      // let cv = ι['dominant_colors'].vibrant
      // cv = cv || ι['dominant_colors']['vibrant_dark']
      // cv = cv || ι['dominant_colors']['vibrant_light']
      // cv = cv || {hex: '#ffffff'}

      let cm = ι['dominant_colors'].muted
      cm = cm || ι['dominant_colors']['muted_dark']
      cm = cm || ι['dominant_colors']['muted_light']
      cm = cm || {hex: '#000000'}

      // document.querySelector(`#${id}`).setAttribute('data-image-palette', cm.hex)
      document.querySelector(`#${id} .overlay .caption`).style.color = cm.hex
      }


    ηι += 1
    if(ηι === (ιUrls.length + pUrls.length)) {
      console.log('image worker finished')
      ιWorker.terminate() // Terminate the worker
      ιWorker = null }} 
      
  ιWorker.postMessage(_.concat(ιUrls, pUrls)) // send urls to worker
}

export default { init }