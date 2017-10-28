import util from '../common/util'
let Worker = require('worker-loader!../lib/knack.worker.js')

function _urls(attribute) {
  let images = document.querySelectorAll('.worker.image')
  return _(images)
            .map(i => {
              if( !i.getAttribute(attribute) ) return
              return {type: 'image',
                      id:   i.getAttribute('id'),
                      bg:   i.tagName !== 'IMG',
                      url:  i.getAttribute(attribute)} })
            .compact()
            .value() }

function init() {
  let urls   = _urls('data-image-url'),
      worker = new Worker()

  worker.onmessage = function (event) {
    let {ι, id, bg} = event.data,
        image        = document.getElementById(id)

    // update the image
    image.classList.remove('blurred')
    if(bg) image.style.backgroundImage = ι
    else images.setAttribute('src', ι)

    // remove the head of the urls
    urls = _.tail(urls)
     
    // if the url list is empty, we're done and terminate the worker
    if(_.isEmpty(urls)) 
      _.defer( () => {worker.terminate() // Terminate the worker
                      worker = null })

    // if there's more, tell the worker 
    else _.defer( () => worker.postMessage(_.first(urls))) } 

  // send first url to worker
  if(!_.isEmpty(urls)) worker.postMessage(_.first(urls)) 
}

export default { init }