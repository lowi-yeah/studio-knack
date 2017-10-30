import anime              from 'animejs'
import Cookie             from 'js-cookie'
import {scaleLinear,
        scaleSequential } from 'd3-scale'
import {cubehelix, hsl}        from 'd3-color'
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

function _animate() {
  noise.seed(seed)
  let gradient  = document.getElementById('rainbow-gradient'),
      [s0, s1]  = gradient.querySelectorAll('stop'),
      offset    = 0,
      colorΣ    = scaleSequential()
                    .domain([-1, 1])
                    .interpolator(interpolateCubehelixLong(cubehelix(0, 0.75, 0.92), cubehelix(360,  0.75, 0.92))),
                    // .interpolator(interpolateCubehelixLong(cubehelix(0, 1, 0.5), cubehelix(360, 1, 0.5))),
      rotationΣ = scaleLinear()
                    .domain([-1, 1])
                    .rangeRound([0, 360]),
      τ, c0, c1, η0, η1, α,
      update    = () => { 
                          τ   = (_.now() - offset) 
                          η0  = noise.simplex2(0,  τ / 80000)
                          η1  = noise.simplex2(42, τ / 80000)
                          c0  = colorΣ(η0)
                          c1  = colorΣ(η1)

                          α   = _alphaCoordinates(rotationΣ(noise.simplex2(2, τ / 60000)))
                          gradient.setAttribute('x1', α.x1) 
                          gradient.setAttribute('x2', α.x2) 
                          gradient.setAttribute('y1', α.y1) 
                          gradient.setAttribute('y2', α.y2) 

                          s0.setAttribute('stop-color', c0) 
                          s1.setAttribute('stop-color', c1) 
                        }
  _.defer(update)
  util.startAnimation(24, update)
}


function init() {
  console.log('init gradient')
  return new Promise( resolve => {
    seed = parseFloat(Cookie.get('noise-seed'))
    // console.log('seed', seed)
    if(!_.isNumber(seed)) {
      seed = Math.random()  
      console.log('cookie seed!', seed)
      Cookie.set('noise-seed', seed) }

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

