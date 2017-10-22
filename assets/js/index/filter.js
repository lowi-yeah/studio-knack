import anime  from 'animejs'
import util   from '../common/util'
import logo   from '../common/logo'
import layout from './layout'

let EASINGS = ['linear', 'easeInOutQuad',
 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function get() { return document.getElementById('grid').getAttribute('data-filter') }

function set(filter) {
  let currentFilter = get()
  if(currentFilter && filter === currentFilter) filter = 'all'

  if(filter === 'all')
    document.getElementById('grid').setAttribute('data-filter', filter)
  else
    document.getElementById('grid').setAttribute('data-filter', filter)

  console.log('set', filter)

  // filter the grid items
  let items     = document.querySelectorAll('.grid-item'),
      filtered  = _.filter(items, ι => 
                    {
                      console.log('item', ι.getAttribute('data-type'))
                      console.log('currentFilter', filter)
                      return (ι.getAttribute('data-type') !== filter) && filter !== 'all' 
                    }),
      remaining = _.difference(items, filtered)

  console.log('filtered', filtered)
  console.log('remaining', remaining)

  _.each(filtered,  ι => ι.setAttribute('data-visible', 0))
  _.each(remaining, ι => ι.setAttribute('data-visible', 1))
  
  layout.update() 


  // let text = category === 'all' ? '' : category
  // logo.setText(text)
  return filter
}


export default { set, get }