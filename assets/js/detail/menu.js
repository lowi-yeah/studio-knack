import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from '../lib/svg-morpheus'
import util         from '../common/util'
import gradient     from '../common/gradient'
import pattern      from '../common/pattern'
import dom          from '../common/dom'

const EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
const BASE_OFFSET = 4


function _initBackButton() {
  return new Promise( resolve => {
    let button        = document.getElementById('back-btn')
    console.log('_initBackButton', button)

    // toggle filter menu on click
    // util.addEvent(button, 'click', toggle)

    // hide initially
    // button.style.transform = 'translateX(100%)'

    // make pattern
    // pattern.make(button)

    // resolve the show, hide & toggle functions
    resolve() })}


function init() {
  return new Promise(resolve => {
    console.log('initializing detail menu')

    _.delay(() => {
      let m = document.getElementById('menu')
      if(!m) {resolve(); return}

      _initBackButton()
        .then(() => { 
           anime( { targets:  m,
                    opacity:  1,
                    duration: 400,
                    easing:   _.sample(EASINGS),
                    complete: resolve
                  })
           })
    }, 640)
  })
}
export default {init}