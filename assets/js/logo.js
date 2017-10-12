import _ from 'lodash'
import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'

import gradient from './gradient'
import util     from './util'



// let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
let knackBase

const LOGO_VIEW_BOX = { x: 0,
                        y: 0,
                        width: 400,
                        height: 168.7}

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
  knackBase.style.transform = `scale(${ς}) translate(${σx}px, ${σy}px)` 
  document.getElementById('studio-knack').setAttribute('viewBox', `0 0 ${ww} ${wh}`)}

function init() {
  let c = document.getElementById('logo-clip'),
      g = document.getElementById('logo-group'),
      β = LOGO_VIEW_BOX,
      w = window.innerWidth,
      h = window.innerHeight,
      s = h / β.height,
      l = (w - (β.width * s))/2
  // g.style.transform = `translateX(${l}px) scale(${s})`
}

function begin() {
  window.curtainPromise
    .then(() => {
        console.log('logo begin')
        // let c = document.getElementById('logo-clip'),
        //     g = document.getElementById('logo-group'),
        //     w = window.innerWidth,
        //     β = LOGO_VIEW_BOX,
        //     s = 72 / β.height,
        //     x = (w - (β.width * s))/2,
        //     y = 16
        // anime({ targets:    g,
        //         translateX: `${x}px`,
        //         translateY: `${y}px`,
        //         scale:      s,
        //         easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)],
        //         duration:   _.random(420, 640)})
      })}

export default {init, begin}