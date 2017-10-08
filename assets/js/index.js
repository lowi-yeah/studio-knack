import '../sass/index.sass'

import menu       from './menu'
import layout     from './layout'
import images     from './images'
import logo       from './logo'
import util       from './util'
import gradient   from './gradient'
import anime      from 'animejs'

let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn)
}

function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  // let begin = performance.now()
  // logo.begin().then(() => { voronoi.init()
  //                           menu.init() })
  images.init()
  layout.init()
  gradient.init()
  logo.begin()
    .then( menu.init )
    .then( layout.update )

// logo.init()
// menu.init()
// about.init()
// initDetail()
// filter.init()
// transition.init()
// boring.boringHero()
// hero.init()
// bam.init()
// initHover()

}

ready(setTimeout(init, 100))

