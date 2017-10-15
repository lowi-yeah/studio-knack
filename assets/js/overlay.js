import {randomNormal} from 'd3-random'
import anime          from 'animejs'
import pattern        from './pattern'
// import dom            from './dom'
import util           from './util'


let ιtem

function _update() {
  if(!ιtem) return  

  let rect    = document.querySelector('#overlay .bg'),
      foreign = document.querySelector('#overlay foreignObject'),
      text    = document.querySelector('#overlay .text'),
      β       = util.boundingBox(ιtem.querySelector('.content')),
      tl      = anime.timeline({})
  
  rect.setAttribute('x', β.x)
  rect.setAttribute('y', β.y)
  rect.setAttribute('width', β.width)
  rect.setAttribute('height', β.height)

  foreign.setAttribute('x', β.x)
  foreign.setAttribute('y', β.y)
  foreign.setAttribute('width', β.width)
  foreign.setAttribute('height', β.height)

  text.innerHTML = ιtem.getAttribute('data-caption')

  _.defer(() => {
    let frame = document.querySelector('#overlay .overlay-frame'),
        βF    = util.boundingBox(frame)
    
    if(βF.y < 0) foreign.setAttribute('y', 0)
    
    if(βF.y + βF.height > window.innerHeight) {
      let ηy = β.y - ((βF.y + βF.height) - window.innerHeight)
      foreign.setAttribute('y', ηy)
    }

    // if(β.y + β.height < window.height ) β.y -= ((β.y + β.height) - window.height)
  
    // fade the background
    tl.add({  targets:  rect,
              opacity:  1,
              duration: 320,
              easing:   'easeInQuad'})
    tl.add({  targets:  frame,
              opacity:  1,
              duration: 320,
              easing:   'easeInQuad'})

  })
}

function init() {
  console.log('init overlay')
  let overlay = document.getElementById('overlay'),
      rect    = document.querySelector('#overlay .bg'),
      frame   = document.querySelector('#overlay .overlay-frame'),
      foreign = document.querySelector('#overlay foreignObject')

  overlay.style.display = 'block'
  util.addEvent(window, 'scroll', remove)
  pattern.make(overlay)

  rect.style.opacity    = 0
  // foreign.style.opacity = 0
  frame.style.opacity = 0
}

function remove() {
  if(!ιtem) return
  ιtem    = null

  let rect  = document.querySelector('#overlay .bg'),
      foreign = document.querySelector('#overlay foreignObject'),
      frame   = document.querySelector('#overlay .overlay-frame'),
      δ  = _.random(120, 360),
      ε  = 'easeOutQuad',
      tl  = anime.timeline({})
 
  tl.add({  targets:  frame,
            opacity:  0,
            duration: δ,
            easing:   ε })
  tl.add({  targets:  rect,
            opacity:  0,
            duration: δ,
            easing:   ε })
}

const ʆ = randomNormal(-64, 1)

function set(item) {
  ιtem    = item
  _update()
}

export default { init, set, remove }







