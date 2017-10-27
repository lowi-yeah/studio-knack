import anime  from 'animejs'
import util   from '../common/util'
import logo   from '../common/logo'
import grid   from '../layout/grid'

let EASINGS = ['linear', 'easeInOutQuad',
 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function get(Φ) { return Φ.filter }

function set(Φ, filter) {
  // reset if we apply the current filter agian
  if(Φ.filtered && Φ.filtered === filter) filter = 'all'
  Φ.filtered = filter

  // // filter the grid items
  // let filtered  = _.filter(Φ, φ => (φ.type !== filter) && filter !== 'all' ),
  //     remaining = _.difference(Φ, filtered)

  // console.log('filtered', filtered)
  // console.log('remaining', remaining)

  // _.each(filtered,  φ => .setAttribute('data-visible', 0))
  // _.each(remaining, φ => .setAttribute('data-visible', 1))
  
  grid.update() 


  // let text = category === 'all' ? '' : category
  return filter
}

function init(Φ) {
  this.set = _.partial(set, Φ)
  this.get = _.partial(get, Φ)
  return Φ
}


export default { init, get }