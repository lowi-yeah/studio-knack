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
  let urls   = _urls('data-image-url'),
      worker = new ImageWorker()

  worker.onmessage = function (event) {
    let {ι, id} = event.data,
        item    = document.getElementById(id)

    // update the image
    _.defer(() => { item.style.backgroundImage = ι
                    item.classList.remove('blurred')})

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