import anime from 'animejs'
import logo from './logo'

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}
NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

let DIRECTIONS  = { top: 0, left: 1, bottom: 2, right: 3 },
    EASINGS     = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

function _openCurtain() {
  let curtain         = document.getElementById('curtain'),
      direction       = Math.floor(Math.random() * 4),
      offset          = Math.random() < 0.5 ? window.innerWidth : -window.innerWidth,
      animationParams = { targets: curtain,
                          transform: `translate(${offset})`,
                          duration: 800 + Math.random() * 1200,
                          delay:    400,
                          easing:   EASINGS[Math.floor(Math.random() * EASINGS.length)]}
  anime(animationParams) }

console.log('dawn')
logo.init()
_openCurtain()