import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import noise          from './noise'
import util           from './util'

 let  ηΣ  = scaleLinear()
              .domain([-1, 1])
              .range([0, 100]),
      Δ   = [ { x1: '0%', y1: '0%',   x2: '100%', y2: '0%'},
              { x1: '0%', y1: '0%',   x2: '0%',   y2: '100%'}]

function _update(ς, ι) {
  return () => {
    let τ = performance.now() / 81000,
        ϕ = ηΣ(noise.simplex2(ι, τ))
    ς.setAttribute('offset', `${ϕ}%`) }}

function _direction() {
  return _.sample(Δ)}

function _animateStop(ς, ι) {
  // ς.setAttribute('offset', `${_.random(100)}%`)
  util.startAnimation(24, _update(ς, ι))
}

function init() {
  let γ = document.getElementById('gradient'),
      ℓ = γ.querySelectorAll('linearGradient'),
      ς = γ.querySelectorAll('stop.animated'),
      δ = _direction()

  γ.setAttribute('width', `${window.innerWidth}px`)
  γ.setAttribute('heigt', `${window.innerHeight}px` )
  γ.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}` )

  noise.seed(Math.random())
  _.each(ℓ, ι => {
    ι.setAttribute('x1', δ.x1)
    ι.setAttribute('y1', δ.y1)
    ι.setAttribute('x2', δ.x2)
    ι.setAttribute('y2', δ.y2) })

  _.each(ς, _animateStop)
  // _.each(ς, _update)
}

export default {init}