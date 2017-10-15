import '../sass/index.sass'

import menu       from './menu'
import layout     from './layout'
import images     from './images'
import logo       from './logo'
import util       from './util'
import gradient   from './gradient'
import overlay    from './overlay'
import pattern    from './pattern'
import single     from './single'

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
    

  
  // logo.begin()

  //   .then( menu.init )
  //   .then( single.init )
  //   .then( layout.update )

}

document.addEventListener('DOMContentLoaded', init)
// ready(setTimeout(init, 100))

