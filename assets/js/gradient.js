import anime  from 'animejs'
import util   from './util'

function _update(ς) {
  ς.setAttribute('offset', `${_.random(100)}%`)
}

function _allOrNothing() {
  // console.log('_allOrNothing', _.sample([true, false]))
  if(_.sample([true, false])) return '100%'
  else return '0%'
}

function _animateStop(ς) {
  // ς.setAttribute('offset', `${_.random(100)}%`)
  util.startAnimation(10, _update(ς))
}

function init() {
  let γ = document.getElementById('gradient'),
      ℓ = γ.querySelectorAll('linearGradient'),
      ς = γ.querySelectorAll('stop.animated')

  γ.setAttribute('width', `${window.innerWidth}px`)
  γ.setAttribute('heigt', `${window.innerHeight}px` )
  γ.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}` )

  _.each(ℓ, ι => {
    ι.setAttribute('x1', '0%')
    ι.setAttribute('y1', '0%')
    ι.setAttribute('x2', _allOrNothing())
    ι.setAttribute('y2', _allOrNothing())
  })

  // _.each(ς, _animateStop)
  _.each(ς, _update)
  
}

export default {init}