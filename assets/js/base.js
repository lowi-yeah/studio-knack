import curtain  from './common/curtain'

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
    curtain.close({toCookie: true}).then(() => window.location = href )}}

function _init() {
  let links = document.querySelectorAll('a')
  _.each(links, link => {
    let href = link.getAttribute('href'),
        external = href ? _.isNil(href.match(/^\//)) : false
    if(external) link.setAttribute('target', '_blank')}) }

document.addEventListener('DOMContentLoaded', _init)