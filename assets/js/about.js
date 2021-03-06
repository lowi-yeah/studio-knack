import '../sass/index.sass'

import menu       from './about/menu'
import grid       from './layout/grid'
import images     from './common/images'
import logo       from './common/logo'
import util       from './common/util'
import gradient   from './common/gradient'
import pattern    from './common/pattern'
import curtain    from './common/curtain'
import search     from './common/search'

let Worker = require('worker-loader!./lib/knack.worker.js')

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

let gridOptions = { container:  '#grid',
                    items:      '.grid-item'}

// triggered upon js load at the very top
window.dawnPromise = 
  gradient.init(0)
    .then(() => {
      document.getElementById('whiteout').classList.add('invisible')
      document.getElementById('rainbow').classList.remove('invisible') })

// triggered after the document is ready
function init() {
  console.log(`about ready! ${window.innerWidth} — ${util.getDevice()}`)

  let worker = new Worker()
  images.init(worker)
    .then(worker => search.init(worker))
    .then(worker => { worker.terminate()})

  window.dawnPromise
    .then(()  => pattern.init())
    .then(()  => logo.init())
    .then(()  => grid.init(gridOptions))  
  
    // scroll to the desired position
    // either the top, or the imprint anchor, depending on the hash
    .then(()  => {
      if(window.location.hash) {
        let element = document.querySelector(window.location.hash)
        console.log('window.location', window.location.hash)
        console.log('element', element)
        if(element) {
          let offset = util.boundingBox(element).y - 64
          document.body.scroll(0, offset) } }
      else document.body.scroll(0, 1) })

    .then(()  => curtain.open({}))
    .catch( (reason) => console.log(`rejection: ${reason}`))
}

document.addEventListener('DOMContentLoaded', init)