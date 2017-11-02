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

// function _colorMatrix(c0, c1) {
  
//   let r0  = c0.r/255,
//       g0  = c0.g/255,
//       b0  = c0.b/255,
//       r1  = c1.r/255,
//       g1  = c1.g/255,
//       b1  = c1.b/255,

//       r   = (r0 + r1)/2, 
//       g   = (g0 + g1)/2, 
//       b   = (b0 + b1)/2, 
//       α   = (r1 + b1 + g1)/3, 

//       rς = `${1}  0     0     ${r} 0`,
//       gς = `0     ${1}  0     ${g} 0`,
//       bς = `0     0     ${1}  ${b} 0`,
//       aς = `${0} ${0}   ${0}  ${α} s0`
//       // aς = `0     0       0     ${1}  0`

//   return [rς, gς, bς, aς].join(' ')}

function _colorMatrix(c) {
  
  let ℋ = hsl(c),

      r = c.r/255,
      g = c.g/255,
      b = c.b/255,

      α = 1-ℋ.l,

      rς = `${1}  0     0     0     0`,
      gς = `0     ${1}  0     0     0`,
      bς = `0     0     ${1}  0     0`,
      aς = `0.2   0.2   0.2   ${α}  0`
      // aς = `0     0       0     ${1}  0`

  // console.log('ℋ', ℋ)

  return [rς, gς, bς, aς].join(' ')}

// let avgColorΣ = scaleLinear().domain([0, 1])

function _animate() {
  noise.seed(seed)
  let gradient  = document.getElementById('rainbow-gradient'),
      matrix    = document.querySelector('#gamma feColorMatrix'),
      [s0, s1]  = gradient.querySelectorAll('stop'),
      offset    = 0,
      colorΣ    = scaleSequential()
                    .domain([-1, 1])
                    .interpolator(interpolateCubehelixLong(cubehelix(0, 0.75, 0.92), cubehelix(360,  0.75, 0.92))),
                    // .interpolator(interpolateHslLong(hsl(0, 1, 0.5), hsl(359, 1, 0.5))),
      rotationΣ = scaleLinear()
                    .domain([-1, 1])
                    .rangeRound([0, 360]),
      τ, c0, c1, η0, η1, α, cAvg,

      update    = () => {   
                          τ   = (_.now() - offset) 
                          η0  = noise.simplex2(0,  τ / 80000)
                          η1  = noise.simplex2(1, τ / 80000)
                          c0  = colorΣ(η0)
                          c1  = colorΣ(η1)
                          // avgColorΣ.range([c0, c0])
                          // cAvg = color(avgColorΣ(0.5))
                          // matrix.setAttribute('values', _colorMatrix(cAvg))
                          // matrix.setAttribute('values', _colorMatrix( color(c0),  color(c1)))

                          α = _alphaCoordinates(rotationΣ(noise.simplex2(2, τ / 60000)))
                          gradient.setAttribute('x1', α.x1) 
                          gradient.setAttribute('x2', α.x2) 
                          gradient.setAttribute('y1', α.y1) 
                          gradient.setAttribute('y2', α.y2) 

                          s0.setAttribute('stop-color', c0) 
                          s1.setAttribute('stop-color', c1) 
                        }
  _.defer(update)
  util.startAnimation(15, update)
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

