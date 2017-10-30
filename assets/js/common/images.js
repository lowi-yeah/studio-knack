import util from '../common/util'

function _urls(attribute) {
  let items = document.querySelectorAll('.grid-item')
  return _(items)
            .map(i => {
              if( !i.getAttribute(attribute) ) return
              return {type: 'image',
                      id:   i.getAttribute('id'),
                      bg:   i.tagName !== 'IMG',
                      url:  i.getAttribute(attribute)} })
            .compact()
            .value() }

function init(worker) {
  console.log('worker: loading images')
  return new Promise( resolve => {
    let urls = _urls('data-image-url'),
        head = _.first(urls),
        image

    worker.onmessage = function (event) {
      let {ι, id, bg, error} = event.data

      if(!error) {
        // update the image
        image = document.querySelector(`#${id} .image`)
        image.classList.remove('blurred')
        if(bg) image.style.backgroundImage = ι
        else image.setAttribute('src', ι) }
      

       // if the url list is empty, we're done and resove the worker for further use
      if(_.isEmpty(urls)) resolve(worker)
      // if there's more, tell the worker 
      else {
         // remove the head of the urls
        head = _.first(urls)
        urls = _.tail(urls)
        worker.postMessage(head)
      }
    } 
        
    // send first url to worker
    if(!_.isEmpty(urls)) _.defer(() => worker.postMessage(head) )
    else resolve(worker)
  })
}

export default { init }