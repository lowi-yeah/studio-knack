import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'

import _ from 'lodash'


let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let knackBase, knackText, knackΣhadow, knackGradients, animation

function _gradients() {
  let gradients = document.querySelectorAll('.text-gradient')

  gradients.forEach( g => {
    let α = Math.round(Math.random() * 180),
        ω = α + 360 + Math.round(Math.random() * 360),
        δ = 24000 + Math.round(Math.random() * 24000)
    g.setAttribute('gradientTransform', `rotate(${α})`)
    anime({ targets:            g, 
            direction:          'alternate',
            gradientTransform:  `rotate(${ω})`, 
            duration:           δ,
            loop:               true,
            easing:             'linear' })})}

function _getRatio() {
  let ww = window.innerWidth,
      kw = knackBase.getBoundingClientRect().width
  return ww/kw }

function _clip() {
  let rect   = document.querySelector('#knack-text > rect'),
      ratio  = _getRatio(),
      offset = Math.random() < 0.5 ? window.innerWidth/ratio : -window.innerWidth/ratio
  rect.setAttribute('transform', `translate(${offset})`)
}

function resize() {
  let ww = window.innerWidth,
      wh = window.innerHeight,
      kw = knackBase.getBoundingClientRect().width,
      kh = knackBase.getBoundingClientRect().height,
      r  = _getRatio(),
      ς  = r * 0.81,
      σx = ww * .095 / r,
      σy = ((wh - (kh * r)) / 2) / r

  knackBase.style.transform   = `scale(${ς}) translate(${σx}px, ${σy}px)` 
  // knackΣhadow.style.transform = `scale(${ς}) translate(${σx}px, ${σy}px)` 
  // knackGradients.forEach(knack => knack.style.transform = `scale(${ς}) translate(${σx}px, ${σy}px)` )

  // document.querySelector('#knack-text > rect').setAttribute('width',  `${ww/r}`)
  // document.querySelector('#knack-text > rect').setAttribute('height', `${wh/r}`)

  // document.querySelectorAll('g.knack > rect')
  //   .forEach(knack => {
  //     knack.setAttribute('width',   `${100/r}%`)
  //     knack.setAttribute('height',  `${wh/r}px`)
  //   } ) 
  }

function startAnimation(fps, fn){
  let fpsInterval   = 1000 / fps, 
      then          = Date.now() + 2000,
      startTime     = then, now, elapsed,
      animate     = () => {
                      requestAnimationFrame(animate)
                      now = Date.now()
                      elapsed = now - then
                      if (elapsed > fpsInterval) {
                        then = now - (elapsed % fpsInterval)
                        fn() }}
  animate() }

const Ɲ         = 128
const ʀ = randomNormal(50, 1)

function _glitchRangeSeldom(i) {
  if(Math.random() > 0.998) return Math.random() * 100
  if(Math.random() > 0.992) return Math.random() * 38
  else return 0 
  // return 100.0*i/Ɲ
}

function _glitchRange(i) {
  if(Math.random() > 0.992) return Math.random() * 100
  if(Math.random() > 0.98) return Math.random() * 38
  // if(Math.random() > 0.92) return Math.random() * 12
  else return 0 
  // return 100.0*i/Ɲ
}

function init() {
  return new Promise( resolve => {
    knackBase       = document.querySelector('#knack-base')
   
    let Δ         = 12000,                     // time scale
        timeΣ     = scaleLinear()
                      .domain([0, Δ/2, Δ])
                      .range( [0,   1, 0]),

        d         = _(Ɲ)                      // glitch scales common
                      .range()
                      .map(i => i / (Ɲ-1))
                      .value(),
  
        rL        = _(Ɲ)
                      .range()
                      .map(_glitchRange)
                      .value(),
        glitchΣL  = scaleLinear()
                      .domain(d)
                      .range(rL),
        αL        = anime({ targets:            '#left-shift', 
                            dx:                 [0, -4], 
                            duration:           100,
                            autoplay:           false,
                            easing:             'linear' }),

        rR        = _(Ɲ)
                      .range()
                      .map(_glitchRange)
                      .value(),
        glitchΣR  = scaleLinear()
                      .domain(d)
                      .range(rR),
        αR        = anime({ targets:            '#right-shift', 
                            dx:                 [0, 4], 
                            duration:           100,
                            autoplay:           false,
                            easing:             'linear' }),

        r0        = _(Ɲ)
                      .range()
                      .map(_glitchRangeSeldom)
                      .value(),
        glitchΣ0  = scaleLinear()
                      .domain(d)
                      .range(r0),
        α0        = anime({ targets:            '#blocks-0', 
                            dx:                 [0, -12], 
                            duration:           100,
                            autoplay:           false,
                            easing:             'linear' }),
        
        r1        = _(Ɲ)
                      .range()
                      .map(_glitchRangeSeldom)
                      .value(),
        glitchΣ1  = scaleLinear()
                      .domain(d)
                      .range(r1),
        α1        = anime({ targets:            '#blocks-1', 
                            dx:                 [0, 12], 
                            duration:           100,
                            autoplay:           false,
                            easing:             'linear' }),

        τ         = performance.now(),
        δ,

        Φ   = () => {
          δ = timeΣ(τ%Δ)
          // console.log('.', δ, glitchΣL(δ))
          αL.seek(glitchΣL(δ))
          αR.seek(glitchΣR(δ))
          α0.seek(glitchΣ0(δ))
          α1.seek(glitchΣ1(δ))
          τ = performance.now()
        }


  console.log('glitchΣL')
  console.log('  d', glitchΣL.domain())
  console.log('  r', glitchΣL.range())

  console.log('glitchΣR')
  console.log('  d', glitchΣR.domain())
  console.log('  r', glitchΣR.range())
    
  glitchΣL.clamp(true)
  glitchΣR.clamp(true)
  glitchΣ0.clamp(true)
  glitchΣ1.clamp(true)

    setTimeout(() => {
      resize()
      startAnimation(15, Φ)
      resolve() }, 0) 
  })
}

function _cleanup() {
  knackBase.remove()
  // knackΣhadow.remove()
  _.each(knackGradients, g => g.remove())

  knackText.remove()
}

function begin() {
  return new Promise( (resolve, reject) => {
    knackBase       = document.querySelector('#knack-base')
    knackText       = document.querySelector('#knack-text')
    // knackΣhadow     = document.querySelector('#knack-shadow')
    knackGradients  = document.querySelectorAll('g.knack')
  
    let ratio           = _getRatio(),
        rect            = document.querySelector('#knack-text > rect'),
        animationParams = { targets:    rect,
                            transform: `translate(${0})`,
                            // duration:   800 + Math.random() * 1200,
                            // delay:      800,
                            duration:   200,
                            delay:      200,
                            easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)],
                            complete:   () => { _cleanup()
                                                resolve() }
                          }
    anime(animationParams) 
  })
}

export default {init, begin}