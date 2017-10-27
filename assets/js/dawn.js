import _        from 'lodash'
import Cookie   from 'js-cookie'
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
  if(e.tagName.match(/body/gi)) return {href: null}
  let href    = e.getAttribute('href'),
      target  = e.getAttribute('target')
  
  if(href && target) return {href, target}
  if(href && !target) return {href}
  return _href(e.parentElement)}

// capture all a#href clicks
window.onclick = e => { 
  let {href, target} = _href(e.target)
  if(href) {
    if(target && target === '_blank') return 
    e.preventDefault()
    curtain.close().then(Δ => {
      Cookie.set('curtain-direction', Δ)
      window.location = href})
  }}


window.dawnPromise = gradient.init()
                          // .then(logo.init)
                          .then(() => document.getElementById('whiteout').style.display = 'none')
