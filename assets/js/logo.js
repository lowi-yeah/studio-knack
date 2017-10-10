import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'
import _ from 'lodash'
import gradient from './gradient'



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
  knackBase.style.transform   = `scale(${ς}) translate(${σx}px, ${σy}px)` 

  let svg = document.getElementById('studio-knack')
  svg.setAttribute('viewBox', `0 0 ${ww} ${wh}`)
  // console.log('svg', svg)
  }

// little helper that waits fo the curtain to be completely lifted, before statring the animation
function _animate(ζ, c) {
  let lifted = c.getAttribute('data-lifted')
  if(!lifted) setTimeout(() => _animate(ζ, c), 400)
  else ζ.play() }

function begin() {
  return new Promise( (resolve, reject) => {
    let ℓ = document.getElementById('logo'),
        ζ = anime.timeline({autoplay: false})
        // ϕ  = 92/window.innerHeight,
    
    ζ.add( {targets:    ℓ,
            width:      2.380952381 * 72, // 2.380952381 is the w/h ratio of the logo
            duration:   120 + Math.random() * 240,
            update:     gradient.updateMask,
            easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)] })
    ζ.add( {targets:    ℓ,
            height:      72,
            duration:   120 + Math.random() * 240,
            update:     gradient.updateMask,
            easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)],
            complete:   resolve})

   _animate(ζ, document.getElementById('curtain'))})}

export default {begin}