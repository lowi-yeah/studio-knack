import anime  from 'animejs'
import util   from './util'
import layout from './layout'
let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']


function filter(category) {
  document.getElementById('grid').setAttribute('data-filter', category)

  let items     = document.querySelectorAll('.grid-item'),
      filtered  = _.filter(items, ι => 
                    (ι.getAttribute('data-category') !== category) && category !== 'all' ),
      remaining = _.difference(items, filtered)

  _.each(filtered,  ι => ι.setAttribute('data-visible', 0))
  _.each(remaining, ι => ι.setAttribute('data-visible', 1))
  // _.each(items, ι => ι.setAttribute('data-visible', 1))
  layout.update() 
}

export default filter