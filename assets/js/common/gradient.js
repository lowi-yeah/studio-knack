import anime              from 'animejs'
import {scaleLinear,
        scaleSequential,
        interpolateWarm } from 'd3-scale'
import {interpolateCubehelix,
        interpolateLab}   from 'd3-interpolate'
import noise              from '../lib/noise'
import util               from './util'

const XMLNS   = 'http://www.w3.org/2000/svg',
      XLINKNS = 'http://www.w3.org/1999/xlink'

const EASINGS     = ['linear'],
      STOP_COLORS = ['#ffff00', '#ff00ff', '#00ffff']


function _alphaCoordinates(α) {
  α = α * (Math.PI / 180)
  return {
    'x1': Math.round(50 + Math.sin(α) * 50) + '%',
    'y1': Math.round(50 + Math.cos(α) * 50) + '%',
    'x2': Math.round(50 + Math.sin(α + Math.PI) * 50) + '%',
    'y2': Math.round(50 + Math.cos(α + Math.PI) * 50) + '%' }}

function _animate() {
  noise.seed(Math.random())
  let gradient  = document.getElementById('rainbow-gradient'),
      [s0, s1]  = gradient.querySelectorAll('stop'),
      startTime = performance.now(),
      // colorΣ    = scaleSequential(interpolateCubehelix('#ffff00', '#ff00ff', '#00ffff')),
      colorΣ    = scaleSequential(interpolateLab('#ffff00', '#ff00ff', '#00ffff')),
      rotationΣ = scaleLinear()
                    .domain([-1, 1])
                    .rangeRound([0, 360]),
      τ, c0, c1, α,
      update    = () => { 
                          τ   = (performance.now() - startTime) 
                          c0  = colorΣ((noise.simplex2(0, τ / 40000) + 1)/2)
                          c1  = colorΣ((noise.simplex2(1, τ / 40000) + 1)/2)
                          α   = _alphaCoordinates(rotationΣ(noise.simplex2(2, τ / 60000)))

                          gradient.setAttribute('x1', α.x1) 
                          gradient.setAttribute('x2', α.x2) 
                          gradient.setAttribute('y1', α.y1) 
                          gradient.setAttribute('y2', α.y2) 

                          s0.setAttribute('stop-color', c0) 
                          s1.setAttribute('stop-color', c1) 
                          // s0.setAttribute('stop-color', '#000000') 
                          // s1.setAttribute('stop-color', '#ffffff') 
                        }
  update()
  util.startAnimation(8, update)
}


function init() {
  console.log('init gradient')
  
  return new Promise( resolve => {
    let γ = document.getElementById('gradient'),
        ℓ = γ.querySelectorAll('linearGradient'),
        δ = { x1: '0%', y1: '0%', x2: '0%', y2: '100%'}
    γ.setAttribute('width',   `${window.innerWidth}px`)
    γ.setAttribute('heigt',   `${window.innerHeight}px` )
    γ.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}` )
  
    γ.style.display = 'block'
    γ.style.opacity = 0
  
    _.each(ℓ, ι => {
      ι.setAttribute('x1', δ.x1)
      ι.setAttribute('y1', δ.y1)
      ι.setAttribute('x2', δ.x2)
      ι.setAttribute('y2', δ.y2) })
    
    // shuffle()
    _animate()

    // set the opacity of the gradients to 0
    // they will appear durin the curtain opening
    _.each(document.querySelectorAll('rect.gradient'), r => r.style.opacity = 0  )
    
    γ.style.opacity = 1

    _.defer(resolve)
  })
}

function shuffle() {
  _.each(document.querySelectorAll('#gradient linearGradient'), 
    ℓ => {
      let stops   = ℓ.querySelectorAll('stop.animated'),
          offsets = _(stops)
                      .map( s => _.random(100))
                      .sortBy( s => s)
                      .value()
      _.each(stops, (s, i) => {
        s.setAttribute('offset', `${offsets[i]}%`)
      })
    })
}

export default {init, shuffle}

