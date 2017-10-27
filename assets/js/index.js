import '../sass/index.sass'

import anime      from 'animejs'

import menu       from './index/menu'
// import layout     from './index/layout'
import grid       from './layout/grid'
import images     from './index/images'
import filter     from './index/filter'
import logo       from './common/logo'
import util       from './common/util'
import gradient   from './common/gradient'
import overlay    from './common/overlay'
import pattern    from './common/pattern'
import curtain    from './common/curtain'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

let gridOptions = { container:  '#grid',
                    items:      '.grid-item'}

function init() {
  console.log('ready!')
  images.init()  
  pattern.init()
  menu.init()
  // document.getElementById('footer').style.display = 'flex'
  
  window.dawnPromise
    // .then(layout.init)
    // .then(logo.begin)
    .then(()  => grid.init(gridOptions))
    .then(Φ   => filter.init(Φ))
    .then(Φ   => overlay.init(Φ))
    .then(curtain.open)
    .catch( (reason) => console.log(`rejection: ${reason}`))
    
}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

