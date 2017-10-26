import anime    from 'animejs'
import pattern  from './pattern'
import util     from './util'

// const REMOVE_ON_SCROLL = true
const REMOVE_ON_SCROLL = false

let rect = document.querySelector('svg.overlay .bg'),
    caption

let itemId, β, Δ,
    overlayα,
    overlayδ 

function _update() {
  if(!β) return
  overlayδ = _.debounce(() => {
    let Δη = window.scrollY,
    δ  = Δ - Δη
    β.y += δ
    Δ = Δη
    
    overlayα = anime( { targets:  rect, 
                        y:        β.y,
                        duration: 400,
                        easing:   'easeOutQuad',
                        complete: () => {overlayα = null
                                         overlayδ = null }})}, 400) }

function init(Φ) {
  console.log('init overlay')
  let overlay = document.getElementById('overlay')
  if(!overlay) return
  
  rect = document.querySelector('svg.overlay .bg')
  pattern.make(overlay) 
  overlay.style.display = 'block'

  // attach a scroll event listener that removes the overlay when the user benigns scrolling
  // this is not an ideal solution, but it works from an UX perspective and is a 
  // huge boon for performance
  if(REMOVE_ON_SCROLL)
    util.addEvent(window, 'scroll', remove)
  else {
    util.addEvent(window, 'scroll', _update )
  }
}

function remove() {
  if(!itemId) return
  rect.classList.remove('active')
  caption.classList.remove('active') 
  itemId = null
  β      = null }

function set(φ) {
  // animation flag:
  // If there is an item currently set, animate the bg rectangle to the new item.
  // If there is no current item, that means the bg is invisible and will appear shortly,
  // In that case just set the rectangle coordinates
  let doAnimate = !_.isNil(itemId)

  // if there is a current item, call remove to get rid of the overlays
  if(itemId) remove()

  // if overlayα ⋁ overlayδ are set, 
  // it means that a scroll update is waiting to happen/currently happening
  // abort before continuing
  if(overlayδ) {
    console.log('overlayδ', overlayδ.cancel)
    overlayδ.cancel(); overlayδ = null }
  if(overlayα) {overlayα.pause();  overlayα = null }

  // update selection
  caption = φ.caption

  // calculate bounds
  β       = util.boundingBox(φ.item)

  Δ       = window.scrollY
  itemId  = φ.id
  rect.classList.add('active')
  caption.classList.add('active')

  // set the background rectangle
  if(doAnimate) 
    anime({ targets:  rect, 
            x:        β.x,
            y:        β.y,
            width:    β.width,
            height:   β.height,
            duration: _.random(240, 320),
            easing:   'easeInOutQuad'})
  else {
    rect.setAttribute('x', β.x)
    rect.setAttribute('y', β.y)
    rect.setAttribute('width',  β.width)
    rect.setAttribute('height', β.height) }}

export default { init, set, remove }







