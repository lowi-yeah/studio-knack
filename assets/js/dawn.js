import _        from 'lodash'
import anime    from 'animejs'
import gradient from './gradient'
import logo     from './logo'

// Element.prototype.remove = function() {
//     this.parentElement.removeChild(this) }

// NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
//     for(var i = this.length - 1; i >= 0; i--) {
//         if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]) } }

let DIRECTIONS  = ['top', 'left', 'bottom', 'right'],
    EASINGS     = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc']

function _offset(δ) {
  switch(δ){
    case 'left':    return -window.innerWidth
    case 'right':   return  window.innerWidth
    case 'top':     return -window.innerHeight
    case 'bottom':  return  window.innerHeight }}

function _openCurtain() {
  console.log('_openCurtain')
  let ρ = new Promise( resolve => {
                          let α = { targets: '#curtain',
                                    duration: _.random(2000, 3200),
                                    delay:    400,
                                    easing:   _.sample(EASINGS),
                                    complete: resolve },
                              δ = _.sample(DIRECTIONS)
                          if(δ === 'left' || δ === 'right')  α.width  = 0
                          if(δ === 'top'  || δ === 'bottom') α.height = 0
                          anime(α)}),

      ϑ = _.map(document.querySelectorAll('rect.gradient'), gradient => 
              new Promise( resolve => 
                              anime({ targets: gradient,
                                      duration: _.random(1600, 2000),
                                      opacity:  _.random(0.12, 0.81, true),
                                      easing:   EASINGS[Math.floor(Math.random() * EASINGS.length)],
                                      complete: resolve})))
  return Promise.all(_.concat(ϑ, ρ))}

window.curtainPromise = gradient.init()
                          .then(logo.init)
                          .then(_openCurtain)
