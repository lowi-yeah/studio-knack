import anime    from 'animejs'
import util     from '../common/util'
import logo     from '../common/logo'
import curtain  from '../common/curtain'
import grid     from '../layout/grid'
import menu     from '../index/menu'

function get(Φ) { return Φ.filter }

function set(Φ, filter) {

  // special case handling:
  // in case we're at a sub-page (e.g. /architecture/) which has been loaded directly
  // (i.e. no by coming from the index page, but rather coming from outside and navigating
  // directly to the section), we cannot just proceed normally, because we don't have 
  // all the content available (only the pages belonging to the respective type have been loaded).
  // in that case, we take a not-ideal shortcut and just navigate back to the index with a hard reload
  console.log('set filter', filter)


  // reset if we apply the current filter again
  if(Φ.filtered && Φ.filtered === filter) filter = 'index'
  Φ.filtered = filter
  curtain.close({toCookie: true})
    .then(grid.update)
    .then(() => { if(filter && filter !== 'index') history.pushState(null, null, `/${filter}`)
                  else history.pushState(null, null, '/')})
    .then(() => { if(filter && filter !== 'index') logo.setText(filter)
                  else logo.removeText()})
    .then(() => { menu.activate(filter) })
    .then(() => document.body.scroll(0, 0))
    .then(() => curtain.open({fromCookie: true}))
  return filter
}

function init(Φ) {
  this.set = _.partial(set, Φ)
  this.get = _.partial(get, Φ)
  return Φ
}


export default { init, get }