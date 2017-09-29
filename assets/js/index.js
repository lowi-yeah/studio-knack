import '../sass/index.sass'

import menu       from './menu'
import about      from './about'
import grid       from './grid'
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
  logo.begin().then(() => { voronoi.init()
                            menu.init() })
  transition.init()
  


// logo.init()
// menu.init()
// about.init()
// grid.init(menu)
// initDetail()
// filter.init()
// transition.init()
// boring.boringHero()
// hero.init()
// bam.init()
// initHover()

}

ready(setTimeout(init, 100))

