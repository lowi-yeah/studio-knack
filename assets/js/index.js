import '../sass/index.sass'

import menu       from './menu'
import layout     from './layout'
import images     from './images'
import logo       from './logo'
import util       from './util'
import gradient   from './gradient'
import overlay    from './overlay'
import single     from './single'

function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  images.init()
  

  layout.init()
    .then(overlay.init)
    .then(menu.init)
    .then(logo.begin)
    

  
  // logo.begin()

  //   .then( menu.init )
  //   .then( single.init )
  //   .then( layout.update )

}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

