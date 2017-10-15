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
  // let bBox  = util.boundingBox(logo),
  //     scale = (window.innerWidth / bBox.width),
  //     // scale = (window.innerHeight  / bBox.height),
  //     // δx    = ((scale * bBox.width) - window.innerWidth)/2
  //     δx    = 0,
  //     δy    = 0
  // return {x: `${δx}px`, y: `${δy}px`, σ: scale} 
  // return {x: `${400}px`, y: 0, σ: 1} 

  // viewbox of the logo svg is: '0 0 320 134.9'
  // the goal is a logo height of 72(?)
  // so the the scale
  let ω = { x: 16, y: 16, σ: (72/134.9) },
      τ = { x: `${ω.x}px`, y: `${ω.y}px`, σ: ω.σ }
  return τ

}

function init() {
  console.log('init logo')
  let logo      = document.getElementById('logo'),
      category  = document.querySelector('#logo-frame > text'),
      transform = _resize(logo)
  pattern.make(logo)
  pattern.make(category)
  dom.transform(logo, transform) 
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