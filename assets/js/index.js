import '../sass/index.sass'

import menu       from './menu'
import about      from './about'
import layout    from './layout'
import images    from './images'
import transition from './transition'
import voronoi    from './voronoi'
import logo       from './logo'
import util       from './util'

// // import grid       from './grid'
// import initDetail from './init-detail'
// import hero       from './hero'
// import bam        from './bam'
// import filter     from './filter'
// import boring     from './boring'

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn)
}

function init() {
  console.log('ready!')
  console.log('device',  util.getDevice(window.innerWidth))
  
  let begin = performance.now()

  logo.begin().then(() => { voronoi.init()
                            menu.init() })

  layout.init()
    .then( () => {
      setTimeout(transition.init, 810)
      
    })

  images.init()


  // brikkery.init()


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

