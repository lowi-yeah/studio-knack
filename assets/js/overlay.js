import {randomNormal} from 'd3-random'
import anime          from 'animejs'
import pattern        from './pattern'
// import dom            from './dom'
import util           from './util'


let ιtem

function _update() {
  if(!ιtem) return  

  let rect    = document.querySelector('svg.overlay .bg'),
      foreign = document.querySelector('svg.overlay foreignObject'),
      text    = document.querySelector('svg.overlay .text'),
      button  = document.querySelector('svg.overlay .button'),
      βi      = util.boundingBox(ιtem),
      βc      = util.boundingBox(ιtem.querySelector('.content')),
      tl      = anime.timeline({})
  
  rect.setAttribute('x', βi.x)
  rect.setAttribute('y', βi.y)
  rect.setAttribute('width',  βi.width)
  rect.setAttribute('height', βi.height)

  foreign.setAttribute('x', βc.x)
  foreign.setAttribute('y', βc.y)
  foreign.setAttribute('width',  βc.width)
  foreign.setAttribute('height', βc.height)

  text.innerHTML      = ιtem.getAttribute('data-caption')
  text.style.color    = ιtem.getAttribute('data-image-palette')
  button.style.color  = ιtem.getAttribute('data-image-palette')

  _.defer(() => {
    let frame = document.querySelector('svg.overlay .overlay-frame'),
        βF    = util.boundingBox(frame)
    
    if(βF.y < 0) foreign.setAttribute('y', 0)
    
    if(βF.y + βF.height > window.innerHeight) {
      let ηy = β.y - ((βF.y + βF.height) - window.innerHeight)
      foreign.setAttribute('y', ηy) }

    // fade the overlay
    tl.add({  targets:  rect,
              opacity:  1,
              duration: 320,
              easing:   'easeInQuad'})
    tl.add({  targets:  frame,
              opacity:  1,
              duration: 320,
              easing:   'easeInQuad'}) })}

function init() {
  console.log('init overlay')
  let overlays  = document.querySelectorAll('svg.overlay'),
      rect      = document.querySelector('svg.overlay .bg'),
      frame     = document.querySelector('svg.overlay .overlay-frame'),
      foreign   = document.querySelector('svg.overlay foreignObject')

  _.each(overlays, o => {
    o.style.display = 'block'
    pattern.make(o) })

  util.addEvent(window, 'scroll', remove)

  rect.style.opacity  = 0
  frame.style.opacity = 0
}

function remove() {
  if(!ιtem) return
  ιtem    = null

  let rect    = document.querySelector('svg.overlay .bg'),
      foreign = document.querySelector('svg.overlay foreignObject'),
      frame   = document.querySelector('svg.overlay .overlay-frame'),
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







