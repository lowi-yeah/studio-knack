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
  let urls   = _urls('data-image-url'),
      worker = new ImageWorker()

  worker.onmessage = function (event) {
    let {ι, id} = event.data,
        image    = document.querySelector(`#${id} .image`)

     // update the image
    _.defer(() => { image.style.backgroundImage = ι
                    image.classList.remove('blurred')})

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