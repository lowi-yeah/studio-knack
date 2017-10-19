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

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']


function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  images.init()  
  pattern.init()
  
  window.curtainPromise
    .then(layout.init)
    .then(logo.begin)
    .then(layout.show)
    .then(menu.init)
    .then(overlay.init)
    .then(() => document.getElementById('footer').style.display = 'flex')
    

  
  // logo.begin()

  //   .then( menu.init )
  //   .then( layout.update )

}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

