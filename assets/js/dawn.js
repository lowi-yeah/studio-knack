import anime          from 'animejs'

// Element.prototype.remove = function() {
//     this.parentElement.removeChild(this) }

// NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
//     for(var i = this.length - 1; i >= 0; i--) {
//         if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]) } }

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

function _offset(δ) {
  switch(δ){
    case 'left':    return -window.innerWidth
    case 'right':   return  window.innerWidth
    case 'top':     return -window.innerHeight
    case 'bottom':  return  window.innerHeight }}

function _openCurtain() {
  let ρ         = { targets: '#curtain',
                    duration: 800 + Math.random() * 1200,
                    delay:    400,
                    easing:   EASINGS[Math.floor(Math.random() * EASINGS.length)],
                    complete: () => curtain.setAttribute('data-lifted', 1)},
      δ = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)],
      ω = _offset(δ)
      
  if(δ === 'left' || δ === 'right')  ρ.translateX =  ω
  if(δ === 'top'  || δ === 'bottom') ρ.translateY =  ω
  anime(ρ) }

console.log('dawn', Math.floor(Math.random() * DIRECTIONS.length))

_openCurtain()

// window.scrollTo(0, 0)