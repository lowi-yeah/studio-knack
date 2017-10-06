  import '../sass/index.sass'

import menu       from './menu'
import about      from './about'
import layout     from './layout'
import images     from './images'
import transition from './transition'
import voronoi    from './voronoi'
import logo       from './logo'
import util       from './util'
import anime      from 'animejs'

// // import grid       from './grid'
// import initDetail from './init-detail'
// import hero       from './hero'
// import bam        from './bam'
// import filter     from './filter'
// import boring     from './boring'

let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn)
}

function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  
  let begin = performance.now()

  // logo.begin().then(() => { voronoi.init()
  //                           menu.init() })
  
  images.init()

  layout.init()
    .then(logo.begin)
    .then( () => {

      anime({ targets:            '#grid-wrap', 
              opacity:            [0, 1], 
              duration:           420 + Math.random() * 640,
              autoplay:           true,
              easing:             _.sample(EASINGS) })

      anime({ targets:            '#grid-wrap', 
              translateY:         [window.innerHeight, 144], 
              duration:           420 + Math.random() * 640,
              autoplay:           true,
              easing:             _.sample(EASINGS) })

    })




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

