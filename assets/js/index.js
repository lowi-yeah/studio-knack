import '../sass/index.sass'
import menu       from './menu'
import about      from './about'
import initGrid   from './init-grid'
import initDetail from './init-detail'
import transition from './transition'
import hero       from './hero'
import bam        from './bam'
import boring     from './boring'

// import initHover  from './init-hover'




menu.init()
about.init()
initGrid(menu)
initDetail()
transition.init()

boring.boringHero()

// hero.init()
// bam.init()
// initHover()
