import '../sass/index.sass'

import menu       from './menu'
import layout     from './layout'
import images     from './images'
import logo       from './logo'
import util       from './util'
import gradient   from './gradient'
import single     from './single'
import anime      from 'animejs'

let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  images.init()
  

  layout.init()
    .then(menu.init)
    .then(logo.begin)

  
  // logo.begin()

  //   .then( menu.init )
  //   .then( single.init )
  //   .then( layout.update )

}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

