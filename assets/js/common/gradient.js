import anime              from 'animejs'
import Cookie             from 'js-cookie'
import {scaleLinear,
        scaleSequential } from 'd3-scale'
import {cubehelix, 
        hsl, 
        color}            from 'd3-color'
import {interpolateCubehelix,
        interpolateCubehelixLong,
        interpolateHslLong,
        interpolateRgb,
        interpolateLab,
        interpolateHsl}   from 'd3-interpolate'
import noise              from '../lib/noise'
import util               from './util'

const XMLNS   = 'http://www.w3.org/2000/svg',
      XLINKNS = 'http://www.w3.org/1999/xlink'

let seed

function _alphaCoordinates(α) {
  α = α * (Math.PI / 180)
  return {
    'x1': Math.round(50 + Math.sin(α) * 50) + '%',
    'y1': Math.round(50 + Math.cos(α) * 50) + '%',
    'x2': Math.round(50 + Math.sin(α + Math.PI) * 50) + '%',
    'y2': Math.round(50 + Math.cos(α + Math.PI) * 50) + '%' }}

function _animate(interpolator, numStops) {

  interpolator = interpolator || interpolateCubehelixLong(cubehelix(0, 0.75, 0.92), cubehelix(360,  0.75, 0.92))
  noise.seed(seed)
  let gradient  = document.getElementById('rainbow-gradient'),
      matrix    = document.querySelector('#gamma feColorMatrix'),
      stops     = gradient.querySelectorAll('stop'),
      offset    = 0,
      colorΣ    = scaleSequential()
                    .domain([-1, 1])
                    .interpolator(interpolator),
      rotationΣ = scaleLinear()
                    .domain([-1, 1])
                    .rangeRound([0, 360]),
      rect      = document.getElementById('logo-rect'),
      colors    = ι => {  let η = noise.simplex2(ι, τ / 80000)
                          return colorΣ(η) },
      noises, rects, 
      τ, α,
      update    = () => { 
                          τ = _.now() - offset
                          α = _alphaCoordinates(rotationΣ(noise.simplex2(200, τ / 60000)))
                          gradient.setAttribute('x1', α.x1) 
                          gradient.setAttribute('x2', α.x2) 
                          gradient.setAttribute('y1', α.y1) 
                          gradient.setAttribute('y2', α.y2) 
                          _.each(stops, (ſ, ι) => ſ.setAttribute('stop-color', colors(ι)) )
                        }
  _.defer(update)

  if( util.getBrowserName() !== 'Safari' ) util.startAnimation(15, update)
  else console.log('disabling animation on safari') 
}

function _makeStops(numStops) {
  let g = document.getElementById('rainbow-gradient')
  _(numStops)
    .range()
    .each(ι => {
      let ſ = document.createElementNS(XMLNS, 'stop'),
          o = Math.round(100 * ι/(numStops-1))
      ſ.setAttribute( 'offset', `${o}%`)
      g.appendChild(ſ) })}

function init(numStops) {
  numStops = _.isNumber(numStops)? numStops : 2
  console.log('init gradient', numStops)
  return new Promise( resolve => {

    let stops = _makeStops(numStops)

    seed = parseFloat(Cookie.get('noise-seed'))
    // console.log('seed', seed)
    if(!_.isNumber(seed)) {
      seed = Math.random()  
      Cookie.set('noise-seed', seed) }

    let w = document.getElementById('wrap'),
        γ = document.getElementById('gradient'),
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
    
    // if(interpolateHslLong(hsl(0, 1, 0.5), hsl(359, 1, 0.5)))
    let type = w.getAttribute('data-type').toLowerCase(),
        interpolator = interpolateCubehelixLong(cubehelix(0, 0.75, 0.92), cubehelix(360,  0.75, 0.92))
    if(type === 'about') interpolator = interpolateHslLong(hsl(0, 1, 0.64), hsl(359, 1, 0.5))
    _animate(interpolator, numStops)

    // set the opacity of the gradients to 0
    // they will appear durin the curtain opening
    _.each(document.querySelectorAll('rect.gradient'), r => r.style.opacity = 0  )
    
    γ.style.opacity = 1

    _.defer(resolve)
  })
}

export default { init }

