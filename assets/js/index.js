import '../sass/index.sass'

import anime      from 'animejs'

import menu       from './index/menu'
import layout     from './index/layout'
import images     from './index/images'
import logo       from './common/logo'
import util       from './common/util'
import gradient   from './common/gradient'
import overlay    from './common/overlay'
import pattern    from './common/pattern'
import curtain  from './common/curtain'

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']


function init() {
  console.log('ready!')
  images.init()  
  pattern.init()
  menu.init()
  overlay.init()
  document.getElementById('footer').style.display = 'flex'
  
  window.dawnPromise
    .then(layout.init)
    .then(logo.begin)
    .then(layout.show)
    .then(curtain.open)
}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

