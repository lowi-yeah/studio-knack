import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from './lib/svg-morpheus'
import voronoi      from './voronoi'
import util         from './util'

let EASINGS = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function _open() {
  console.log('open menu')

  let β = this.getBoundingClientRect(),
      δ = 360
  
  anime({ targets:     this,
          translateX:  `-${β.x - 32}px`,
          duration:    δ,
          easing:      EASINGS[Math.floor(Math.random() * EASINGS.length)]
        })
  anime({ targets:     this,
          width:       [`${β.width}px`, `${β.x - 32 + β.width}px`],
          duration:    δ,
          easing:      EASINGS[Math.floor(Math.random() * EASINGS.length)]
        })
  

  anime({ targets:     '#knack-frame',
          translateX:  `-${β.x - 32}px`,
          duration:    δ,
          easing:      EASINGS[Math.floor(Math.random() * EASINGS.length)]
        })

  setTimeout(() => this.onclick = null, δ)
}


function init() {
  return new Promise(resolve => {
    _.defer(() => {
      console.log('_initMenu')
      let bg = document.querySelector('#menu > .bg')
  
      // // animate the background / menu button
      // anime( { targets:     bg,
      //          translateY:  [`-98px`, `0px`],
      //          duration:    120 + Math.random() * 240,
      //          easing:      EASINGS[Math.floor(Math.random() * EASINGS.length)],
      //          complete:    resolve
      //        })

      // bg.onclick = _open
    })
  })
}
export default {init}