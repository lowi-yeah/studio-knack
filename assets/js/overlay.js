import {randomNormal} from 'd3-random'
import anime          from 'animejs'
import pattern        from './pattern'
// import dom            from './dom'
import util           from './util'


let ιtem, τimeline

function init() {
  console.log('init overlay')
  let overlays    = document.querySelectorAll('svg.overlay'),
      overlayBack = document.getElementById('overlay-back'),
      rect        = document.querySelector('svg.overlay .bg'),
      frame       = document.querySelector('svg.overlay .overlay-frame'),
      foreign     = document.querySelector('svg.overlay foreignObject')

  console.log('overlayBack', overlayBack)
  pattern.make(overlayBack) 
  _.each(overlays, o => { o.style.display = 'block' })
  util.addEvent(window, 'scroll', remove)
}

function remove() {
  return new Promise( resolve => {
    if(!ιtem) return resolve()

    ιtem    = null
    let rect    = document.querySelector('svg.overlay .bg'),
        foreign = document.querySelector('svg.overlay foreignObject'),
        frame   = document.querySelector('svg.overlay .overlay-frame'),
        δ  = _.random(120, 360),
        ε  = 'easeOutQuad'
  
    _.defer(() => {
      τimeline = anime.timeline({})
      τimeline.add({  targets:  frame,
                opacity:  0,
                duration: δ,
                easing:   ε,
                complete: () => foreign.style['pointer-events'] = 'none' })
      τimeline.add({  targets:  rect,
                opacity:  0,
                duration: δ,
                easing:   ε,
                complete: () => {
                  τimeline = undefined
                  resolve() }})})})}

const ʆ = randomNormal(-64, 1)

function set(item) {

  return new Promise( resolve => {
    ιtem    = item
  
    let rect    = document.querySelector('svg.overlay .bg'),
        foreign = document.querySelector('svg.overlay foreignObject'),
        text    = document.querySelector('svg.overlay .text'),
        button  = document.querySelector('svg.overlay .button'),
        βi      = util.boundingBox(ιtem),
        βc      = util.boundingBox(ιtem.querySelector('.content'))
    
    
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
      
      τimeline = anime.timeline({})
      τimeline.add({  targets:  rect,
                opacity:  1,
                duration: 320,
                easing:   'easeInQuad'})
      τimeline.add({  targets:  frame,
                opacity:  1,
                duration: 320,
                easing:   'easeInQuad',
                complete: () => {
                  τimeline = undefined
                  foreign.style['pointer-events'] = 'all'
                  resolve() }})})
  })
}

export default { init, set, remove }







