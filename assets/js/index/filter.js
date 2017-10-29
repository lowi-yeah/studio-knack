import anime    from 'animejs'
import util     from '../common/util'
import logo     from '../common/logo'
import curtain  from '../common/curtain'
import grid     from '../layout/grid'

let EASINGS = ['linear', 'easeInOutQuad',
 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function get(Φ) { return Φ.filter }

function set(Φ, filter) {
  // reset if we apply the current filter again
  if(Φ.filtered && Φ.filtered === filter) filter = 'all'
  Φ.filtered = filter
  curtain.close({toCookie: true})
    .then(grid.update)
    .then(() => { 
                  console.log('history', filter)
                  if(filter && filter !== 'all') history.pushState(null, null, `/${filter}`)
                  else history.pushState(null, null, '/')})
    .then(() => { if(filter && filter !== 'all') logo.setText(filter)
                  else logo.removeText()})
    .then(() => window.scroll(0, 0))
    .then(() => curtain.open({fromCookie: true}))
  
  // let text = category === 'all' ? '' : category
  return filter
}

function init(Φ) {
  this.set = _.partial(set, Φ)
  this.get = _.partial(get, Φ)
  return Φ
}


export default { init, get }