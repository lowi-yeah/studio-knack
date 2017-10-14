import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import noise          from './noise'
import util           from './util'

const XMLNS   = 'http://www.w3.org/2000/svg',
      XLINKNS = 'http://www.w3.org/1999/xlink'

const EASINGS = ['linear']

let ηΣ  = scaleLinear()
            .domain([-1, 1])
            .range([0, 100]),
    startTime

function _updateGradient(σ, ι, δ) {
  return () => {
    let τ = (performance.now() - δ) / /*81000*/20000,
        ϕ = ηΣ(noise.simplex2(ι, τ))
    σ.setAttribute('offset', `${ϕ}%`) }}

function _animateStop(σ, ι, δ) {
  let ϕ = ηΣ(noise.simplex2(ι, performance.now() * Math.random()))
  σ.setAttribute('offset', `${ϕ}%`)
  // _updateGradient(σ, ι, δ)
  // util.startAnimation(16, _updateGradient(σ, ι, δ))
}

function _initGradients(stops) {
  startTime = performance.now()
  _.each(stops, (σ, ι) => _animateStop(σ, ι, startTime))  
}



function init() {
  console.log('init gradient')
  
  return new Promise( resolve => {
    let γ = document.getElementById('gradient'),
        ℓ = γ.querySelectorAll('linearGradient'),
        ς = γ.querySelectorAll('stop.animated'),
        δ = { x1: '0%', y1: '0%', x2: '0%', y2: '100%'}
    γ.setAttribute('width',   `${window.innerWidth}px`)
    γ.setAttribute('heigt',   `${window.innerHeight}px` )
    γ.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}` )
  
    γ.style.display = 'block'
    γ.style.opacity = 0
    

    noise.seed(Math.random())
  
    _.each(ℓ, ι => {
      ι.setAttribute('x1', δ.x1)
      ι.setAttribute('y1', δ.y1)
      ι.setAttribute('x2', δ.x2)
      ι.setAttribute('y2', δ.y2) })

    _.each(document.querySelectorAll('rect.gradient'), 
      r => r.style.opacity = _.random(0.2, 1, true )  )

    
    
    // _initLogoMask()
    _initGradients(ς)
    
    γ.style.opacity = 1

    _.defer(resolve)
  })
}

export default {init}

