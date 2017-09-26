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

// import initHover  from './init-hover'




menu.init()
about.init()
grid.init(menu)
// initDetail()
filter.init()
transition.init()

boring.boringHero()

// hero.init()
// bam.init()
// initHover()
