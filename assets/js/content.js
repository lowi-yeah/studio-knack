import anime  from 'animejs'
import util   from './util'

let ImageWorker   = require('worker-loader!./workers/image-worker.js'), 
    LayoutWorker  = require('worker-loader!./workers/layout-worker.js'), 
    ιWorker, ℓWorker

function _imageUrls() {
  let items = document.querySelectorAll('.grid-item')
  console.log('items', items)
  return _.map(items, i => {
    return {id:   i.getAttribute('id'),
            url:  i.getAttribute('data-image-url')} }) }

function _itemIds() {
  let items = document.querySelectorAll('.grid-item')
  return _.map(items, i => i.getAttribute('id')) }

function _loadImages() {
  console.log('_loadImages')
  // ιWorker.postMessage(_imageUrls()) //send message to worker
}

function _stop() {
  ιWorker.terminate() //Terminate the worker
  ιWorker = null
}


function _randomDimensions(device) {
  // console.log('random', device)
  switch (device) {
    case 'mobile':
      return { x: _.random(3, 8), y: _.random(3, 8) }
    case 'tablet':
      return { x: _.random(3, 8), y: _.random(3, 8) }
    case 'desktop':
      return { x: _.random(10, 16), y: _.random(24, 48) }
    case 'widescreen':
      return { x: _.random(3, 8), y: _.random(3, 8) }
    default:
      return { x: _.random(3, 8), y: _.random(3, 8) }
    }
}

function _gridResize(items) {
  return new Promise( (resolve, reject) => {
    let device  = util.getDevice(window.innerWidth),
        Δ       = _.partial(_randomDimensions, device)
    _.each(items, item => {
      let δ = Δ()
      item.style['grid-column'] = `span ${δ.x}`
      item.style['grid-row']    = `span ${δ.y}`
      item.setAttribute('data-column', `${δ.x}`)
      item.setAttribute('data-row',    `${δ.y}`) })
    resolve() })

  
  // body...
}
function _layout() {
  let items = document.querySelectorAll('.grid-item')

  _gridResize(items)
    .then( () => console.log('then'))

      

  

  // ℓWorker = new LayoutWorker()


  // ℓWorker.onmessage = μ => {
  //   console.log('layout message', μ )
    
  //     }

  // ℓWorker.postMessage({width, ids})

  // console.log('ℓWorker', ℓWorker)
}


function init() {
  console.log('init content')

  _layout()

  // ιWorker = new ImageWorker()
  
  // console.log('ImageWorker', ImageWorker)
  // console.log('ιWorker', ιWorker)

  // ιWorker.onmessage = function (image) {
  //   // console.log("eventt : " )
  //   let { id, ι } = image.data,
  //       item = document.getElementById(id),
  //       img  = item.querySelector('img')



  //   console.log('image arrived:', id, ι.substring(0, 24))
  //   // console.log(ι)
  //   console.log('item:', item)
  //   console.log('img:', img)

  //   // img.setAttribute('src', `data:image/jpg;base64,${ι}`)



  // }; 
  
  // _.defer(_loadImages)    

}
export default { init }