import _              from 'lodash'
import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'

import gradient from './gradient'
import pattern  from './pattern'
import util     from './util'
import dom      from './dom'

// let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function _getRatio() {
  let ww = window.innerWidth,
      kw = knackBase.getBoundingClientRect().width
  return ww/kw }

function _resize(logo) {
  // viewbox of the logo svg is: '0 0 320 134.9'
  // the goal is a logo height of 72(?)
  // so the the scale
  let ω = { x: 32, y: 16, σ: (72/134.9) },
      τ = { x: `${ω.x}px`, y: `${ω.y}px`, σ: ω.σ }
  return τ

}

function init() {
  console.log('init logo')
  let logo      = document.getElementById('logo'),
      texts     = document.querySelectorAll('#logo-frame .subtext'),
      transform = _resize(logo)
  pattern.make(logo)
  _.each(texts, text => pattern.make(text))
  dom.transform(logo, transform) 

  util.addEvent(logo, 'click', gradient.shuffle)
}

function setText(text) {
  document.querySelector('#logo-frame > text').textContent = text
}

function begin() {
  return new Promise( resolve => {
        console.log('logo begin')
        // viewbox of the logo svg is: '0 0 320 134.9'
        // the goal is a logo height of 72(?)
        // so the the scale
  
        // let ω = { x: 16, y: 16, σ: (72/134.9) },
        //     τ = { x: `${ω.x}px`, y: `${ω.y}px`, σ: ω.σ },
        //     α = { duration: 1400,
        //           easing:   'random',
        //           complete: resolve}
        // dom.transform(logo, τ, α) 

        resolve()
      
    })}

export default {init, begin, setText}