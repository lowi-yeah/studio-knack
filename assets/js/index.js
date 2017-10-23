import '../sass/index.sass'

import anime      from 'animejs'

import menu       from './index/menu'
// import layout     from './index/layout'
import grid       from './layout/grid'
import images     from './index/images'
import logo       from './common/logo'
import util       from './common/util'
import gradient   from './common/gradient'
import overlay    from './common/overlay'
import pattern    from './common/pattern'
import curtain  from './common/curtain'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

let gridOptions = { container:  '#grid',
                    items:      '.grid-item'}

function init() {
  console.log('ready!')
  // images.init()  
  // pattern.init()
  menu.init()
  // overlay.init()
  // document.getElementById('footer').style.display = 'flex'
  
  document.getElementById('logo-frame').style.display = 'none'
  document.getElementById('logo-frame').style.visibility = 'hidden'
  
  window.dawnPromise
    // .then(layout.init)
    .then(() => grid.init(gridOptions))
    .then(logo.begin)
    // .then(layout.show)
    .then(curtain.open)
}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

