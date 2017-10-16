// import {randomNormal} from 'd3-random'
import pattern        from './pattern'
import util           from './util'

let itemId

function init() {
  console.log('init overlay')
  let overlay = document.getElementById('overlay-back'),
      rect    = document.querySelector('svg.overlay .bg')
  pattern.make(overlay) 
  overlay.style.display = 'block'
  util.addEvent(window, 'scroll', remove)
}

function remove() {
  if(!itemId) return
    
  let rect = document.querySelector('svg.overlay .bg')
  rect.classList.remove('active')

  let text = document.querySelector(`#${itemId} .overlay`)
  text.classList.remove('active') 
  itemId = null }

function set(item) {
  let rect  = document.querySelector('svg.overlay .bg'),
      text  = item.querySelector('.overlay'),
      β     = util.boundingBox(item)

  itemId = item.getAttribute('id')
  
  rect.setAttribute('x', β.x)
  rect.setAttribute('y', β.y)
  rect.setAttribute('width',  β.width)
  rect.setAttribute('height', β.height)
  rect.classList.add('active')
  text.classList.add('active')
}

export default { init, set, remove }







