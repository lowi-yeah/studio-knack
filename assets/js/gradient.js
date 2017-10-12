import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import noise          from './noise'
import util           from './util'

const XMLNS   = 'http://www.w3.org/2000/svg',
      XLINKNS = 'http://www.w3.org/1999/xlink'

const EASINGS = ['linear']

let ηΣ  = scaleLinear()
            .domain([-1, 1])
            .range([0, 64]),
    startTime

function _updateGradient(σ, ι, δ) {
  return () => {
    let τ = (performance.now() - δ) / /*81000*/20000,
        ϕ = ηΣ(noise.simplex2(ι, τ))
    σ.setAttribute('offset', `${ϕ}%`) }}

function _animateStop(σ, ι, δ) {
  // util.startAnimation(24, _updateGradient(σ, ι, δ))
}

function _initGradients(stops) {
  startTime = performance.now()
  _.each(stops, (σ, ι) => _animateStop(σ, ι, startTime))  
}


function _makeClippingPath(item, maskSelector) {
  maskSelector = maskSelector || '#masks'
  let id = item.getAttribute('id'),
      cid = `c-${id}`,
      Δ   = document.querySelector('#gradient defs'),
      M   = document.querySelector(maskSelector),
      β   = item.getBoundingClientRect(),
      cp  = document.createElementNS(XMLNS, 'clipPath'),
      cr  = document.createElementNS(XMLNS, 'rect'),
      use = document.createElementNS(XMLNS, 'use')
 
  cp.setAttribute('id', cid)
  cp.setAttribute('for', id)
  
  cr.setAttribute('x',      0)
  cr.setAttribute('y',      0)
  cr.setAttribute('width',  0)
  cr.setAttribute('height', 0)

  use.setAttributeNS(XLINKNS, 'xlink:href', `#gradients`)
  use.setAttribute('clip-path', `url(#${cid})`)
  use.setAttribute('x', '0')
  use.setAttribute('y', '0')
  use.setAttribute('width', '100%')
  use.setAttribute('height', '100%')

  cp.appendChild(cr)
  Δ.appendChild(cp)
  M.appendChild(use) 

  return cp }

function _initLogoMask() {
  let logo  = document.querySelector('#logo')
  _makeClippingPath(logo, '#bg-masks')
  updateMask('logo')
}

function updateMask(id) {
  let item  = document.getElementById(id),
      β     = util.boundingBox(item),
      mask  = document.querySelector(`clipPath[for=${id}]`),
      rect

  if(!mask) mask = _makeClippingPath(item)
  rect = mask.querySelector('rect')
                
  rect.setAttribute('x', β.x)
  rect.setAttribute('y', β.y)
  rect.setAttribute('width', β.width)
  rect.setAttribute('height', β.height) 
}

function updateLogoMask() { updateMask('logo') }

function init() {
  console.log('init gradient')
  return new Promise( resolve => {
    let γ = document.getElementById('gradient'),
        ℓ = γ.querySelectorAll('linearGradient'),
        ς = γ.querySelectorAll('stop.animated'),
        δ = { x1: '0%', y1: '0%', x2: '0%', y2: '100%'}
    γ.setAttribute('width',   `${window.innerWidth}px`)
    γ.setAttribute('heigt',   `${window.innerHeight}px` )
    γ.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}` )
  
    γ.style.display = 'block'
    γ.style.opacity = 0
    
    noise.seed(Math.random())
  
    _.each(ℓ, ι => {
      ι.setAttribute('x1', δ.x1)
      ι.setAttribute('y1', δ.y1)
      ι.setAttribute('x2', δ.x2)
      ι.setAttribute('y2', δ.y2) })
    
    _initLogoMask()
    _initGradients(ς)
    
    γ.style.opacity = 1

    _.defer(resolve)
  })
}

export default {init, updateLogoMask, updateMask}

