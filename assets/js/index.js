import '../sass/index.sass'

import menu       from './menu'
import about      from './about'
// import grid       from './grid'
import content    from './content'
import brikkery   from './brikkery'
import initDetail from './init-detail'
import transition from './transition'
import hero       from './hero'
import bam        from './bam'
import filter     from './filter'
import boring     from './boring'
import voronoi    from './voronoi'
import logo       from './logo'

function ready(fn) {
  if (document.attachEvent ? document.readyState === 'complete' : document.readyState !== 'loading') fn()
  else document.addEventListener('DOMContentLoaded', fn)
}

function init() {
  console.log('ready!')
  
  let begin = performance.now()

  logo.begin().then(() => { voronoi.init()
                            menu.init() })
  
  content.init()
    .then( () => {
      console.log('layout complete.', `Took ${ Math.round(performance.now() - begin) }ms`) 

      setTimeout(transition.init, 810)
      
    })


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

