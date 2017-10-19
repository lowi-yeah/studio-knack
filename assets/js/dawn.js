import _        from 'lodash'
import logo     from './common/logo'
import gradient from './common/gradient'
import curtain  from './common/curtain'

// Element.prototype.remove = function() {
//     this.parentElement.removeChild(this) }

// NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
//     for(var i = this.length - 1; i >= 0; i--) {
//         if(this[i] && this[i].parentElement) this[i].parentElement.removeChild(this[i]) } }


function _href(e) {
  if(!e) return
  if(e.tagName.match(/body/gi)) return null
  let location = e.getAttribute('href')
  if(location) return location
  else return _href(e.parentElement)}

// capture all a#href clicks
window.onclick = e => { 
  let location = _href(e.target)
  if(location) {
    e.preventDefault()

    curtain.close()
      .then(() => {
        // console.log('location', location)
        window.location = location
      })
    // if( location === '/about') _about(() => window.location = location)
    // _transitionTo()
  }}


window.curtainPromise = gradient.init()
                          .then(logo.init)
                          .then(curtain.open())
