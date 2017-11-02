import dom  from './dom'
import util from './util'

const XMLNS   = 'http://www.w3.org/2000/svg',
      XLINKNS = 'http://www.w3.org/1999/xlink'

function make(item) {
  let defs      = document.getElementById('defs'),
      pattern   = document.createElementNS(XMLNS, 'pattern'),
      patternId = `${item.getAttribute('id')}-pattern`,
      use       = document.createElementNS(XMLNS, 'use'),
      width     = window.innerWidth,
      height    = window.innerHeight

  use.setAttributeNS(XLINKNS, 'xlink:href', `#gradients`)
  use.setAttribute('x', '0')
  use.setAttribute('width', `${window.innerWidth}px`)

  pattern.setAttribute('id', patternId)
  pattern.setAttribute('x', '0')
  pattern.setAttribute('width', `${window.innerWidth}px`)
  pattern.setAttribute('height',`${window.innerHeight}px`)
  pattern.setAttribute('patternUnits', 'userSpaceOnUse')

  pattern.appendChild(use)
  defs.appendChild(pattern)
  item.setAttribute('fill', `url(#${patternId})`)
  item.setAttribute('data-pattern', patternId) 

  update(item)
}

function _makeSvg(item) {
  let svg   = document.createElementNS(XMLNS, 'svg'),
      rect  = document.createElementNS(XMLNS, 'rect'),
      watch = item.classList.contains('watch')

  rect.setAttribute('x', 0)
  rect.setAttribute('y', 0)
  rect.setAttribute('width', '100%')
  rect.setAttribute('height', '100%')

  svg.setAttribute('x', 0)
  svg.setAttribute('y', 0)
  svg.setAttribute('width', '100%')
  svg.setAttribute('height', '100%')
  svg.setAttribute('id', util.guid('psvg'))
  
  svg.setAttribute('xmlns', XMLNS)
  svg.setAttribute('xmlns:xlink', XLINKNS)
  
  svg.appendChild(rect)
  item.appendChild(svg)

  make(svg) 
  if(watch) util.addEvent(document.body, 'scroll', () => update(svg))
}

function update(item) {
  let patternId = item.getAttribute('data-pattern'),
      pattern   = document.getElementById(patternId),
      use       = pattern.querySelector('use'),
      β         = util.boundingBox(item),
      scale     = dom.getScale(item)

  // use.setAttribute('x', `${β.x - β.x/scale}`)
  use.setAttribute('y', `${β.y - β.y/scale}`)
  use.setAttribute('height',`${window.innerHeight/scale}px`)

  pattern.setAttribute('x', `${-β.x}px`) 
  pattern.setAttribute('y', `${-β.y}px`) 
}

function init() {
  let patternItems = document.querySelectorAll('.pattern')
  _.each(patternItems, item => _makeSvg(item))
}


export default {make, update, init}










