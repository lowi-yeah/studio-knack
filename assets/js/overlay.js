// import {randomNormal} from 'd3-random'
import pattern        from './pattern'
import util           from './util'


let ιtem, τimeline

function init() {
  console.log('init overlay')
  let overlays    = document.querySelectorAll('svg.overlay'),
      overlayBack = document.getElementById('overlay-back'),
      rect        = document.querySelector('svg.overlay .bg'),
      frame       = document.querySelector('svg.overlay .overlay-frame'),
      foreign     = document.querySelector('svg.overlay foreignObject')
  pattern.make(overlayBack) 
  _.each(overlays, o => { o.style.display = 'block' })
  util.addEvent(window, 'scroll', remove)
}

function remove() {
  if(!ιtem) return
  let rect    = document.querySelector('svg.overlay .bg'),
      foreign = document.querySelector('svg.overlay foreignObject')
  ιtem    = null
  foreign.classList.remove('active')
  rect.classList.remove('active') }

function set(item) {
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
  rect.classList.add('active')
  
  foreign.setAttribute('x', βc.x)
  foreign.setAttribute('y', βc.y)
  foreign.setAttribute('width',  βc.width)
  foreign.setAttribute('height', βc.height)
  foreign.classList.add('active')
  
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
  })
}

export default { init, set, remove }







