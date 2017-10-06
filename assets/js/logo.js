import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'

import _ from 'lodash'


// let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
let knackBase

function _getRatio() {
  let ww = window.innerWidth,
      kw = knackBase.getBoundingClientRect().width
  return ww/kw }

function resize() {
  let ww = window.innerWidth,
      wh = window.innerHeight,
      kw = knackBase.getBoundingClientRect().width,
      kh = knackBase.getBoundingClientRect().height,
      r  = _getRatio(),
      ς  = r * 0.81,
      σx = ww * .095 / r,
      σy = ((wh - (kh * r)) / 2) / r

  knackBase.style.transform   = `scale(${ς}) translate(${σx}px, ${σy}px)` }

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

function _cleanup(τ) {
  // console.log('_cleanup')
  τ.setAttribute('filter', null)
}

function _d() {
  return 420 + Math.random() * 240
}

function _animate(ζ, c) {
  let lifted = c.getAttribute('data-lifted')
  if(!lifted) setTimeout(() => _animate(ζ, c), 400)
  else ζ.play() }

function begin() {
  return new Promise( (resolve, reject) => {
    let sk = document.getElementById('studio-knack'),
        x  = document.getElementById('x-scale'),
        y  = document.getElementById('y-scale'),
        τ  = document.getElementById('knack-base'),
        ϕ  = 48/τ.getBoundingClientRect().height,
        ζ  = anime.timeline({autoplay: false
        })
    _cleanup(τ)
                        

    // ζ.add({ targets:    y,
    //         transform: `scale(1 ${ϕ})`,
    //         duration:   _d(),
    //         easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)]})    
    ζ.add({ targets:    y,
            transform: `scale(${ϕ})`,
            duration:   _d(),
            // offset:     200,
            easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)]}) 

    ζ.add({ targets:    x,
            translateY: (i) => {
              let β = i.getBoundingClientRect()
              return  -β.top + 24},
            duration:   _d(),
            // offset:     200,
            easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)],
            complete:   resolve}) 

    
   _animate(ζ, document.getElementById('curtain'))

  })
}

export default {init, begin}