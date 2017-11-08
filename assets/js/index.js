import '../sass/index.sass'

import anime      from 'animejs'

import menu       from './index/menu'
// import layout     from './index/layout'
import grid       from './layout/grid'
import filter     from './index/filter'
import images     from './common/images'
import logo       from './common/logo'
import util       from './common/util'
import gradient   from './common/gradient'
// import overlay    from './common/overlay'
import pattern    from './common/pattern'
import curtain    from './common/curtain'
import search     from './common/search'

let Worker = require('worker-loader!./lib/knack.worker.js')

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

let gridOptions = { container:  '#grid',
                    items:      '.grid-item'}

// function _history() {
//   window.onpopstate = function(e) {
//     let f = window.location.pathname.substring(1)
//     if(f === '') f = 'index'
//     filter.set(f)
//   }
// }

function init() {
  console.log(`ready! ${window.innerWidth} — ${util.getDevice()}`)

  let worker = new Worker()
  images.init(worker)
    .then(worker => search.init(worker))
    .then(worker => { worker.terminate()})
  

  // document.getElementById('footer').style.display = 'flex'
  
  window.dawnPromise
    .then(()  => pattern.init())
    .then(()  => logo.init())
    .then(()  => menu.init())
    .then(()  => grid.init(gridOptions))
    .then(Φ   => filter.init(Φ))
    .then(()  => curtain.open({}))
    .catch( (reason) => console.log(`rejection: ${reason}`))
}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

