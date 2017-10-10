import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import noise          from './noise'
import util           from './util'

const XMLNS   = 'http://www.w3.org/2000/svg',
      XLINKNS = 'http://www.w3.org/1999/xlink'

let ηΣ  = scaleLinear()
            .domain([-1, 1])
            .range([0, 100]),
    time

function _update(ς, ι) {
  return () => {
    let τ = (time - performance.now()) / /*81000*/20000,
        ϕ = ηΣ(noise.simplex2(ι, τ))
    ς.setAttribute('offset', `${ϕ}%`) }}

function _animateStop(ς, ι) {
  // ς.setAttribute('offset', `${_.random(100)}%`)
  util.startAnimation(24, _update(ς, ι))
}

function _initGradient() {
  let γ = document.getElementById('gradient'),
      ℓ = γ.querySelectorAll('linearGradient'),
      ς = γ.querySelectorAll('stop.animated'),
      δ = { x1: '0%', y1: '0%', x2: '0%', y2: '100%'}

  γ.setAttribute('width', `${window.innerWidth}px`)
  γ.setAttribute('heigt', `${window.innerHeight}px` )
  γ.setAttribute('viewBox', `0 0 ${window.innerWidth} ${window.innerHeight}` )
  γ.style.display = 'block'
  γ.style.opacity = 0

  noise.seed(Math.random())
  _.each(ℓ, ι => {
    ι.setAttribute('x1', δ.x1)
    ι.setAttribute('y1', δ.y1)
    ι.setAttribute('x2', δ.x2)
    ι.setAttribute('y2', δ.y2) })
  
  time = performance.now()

  _.each(ς, _update)
  // _.delay(() => γ.style.display = 'block', 2000)

  anime({ targets: γ,
          opacity: 1,
          delay: 2000,
          easing: 'linear',
          duration: 240})

  _.each(ς, _animateStop)
  // _.each(ς, _update)
}

function _initMasks() {
  console.log('init masks')
  let M = document.querySelector('#masks'),
      Δ = document.querySelector('#gradient defs'),
      menuButtons = document.querySelectorAll('button'),
      // menuButtons = document.querySelectorAll('#filter-btn'),
      logo        = document.querySelector('#logo'),
      items       = _.reduce(menuButtons, (ρ, ι) => _.concat(ρ, ι), [logo])

  console.log('Δ', Δ)
  console.log('logo', logo)
  console.log('menuButtons', menuButtons)
  console.log('items', items)

  // make a clipping path for each button
  return _.map(items, ι => {
    
    var β  = ι.getBoundingClientRect(),
        cp = document.createElementNS(XMLNS, 'clipPath'),
        cr = document.createElementNS(XMLNS, 'rect'),
        u  = document.createElementNS(XMLNS, 'use'),
        id = `c-${util.guid()}`
  
    cp.setAttribute('id', id)
    
    cr.setAttribute('x',      0)
    cr.setAttribute('y',      0)
    cr.setAttribute('width',  100)
    cr.setAttribute('height', 100)

    u.setAttributeNS(XLINKNS, 'xlink:href', `#gradients`)
    u.setAttribute('clip-path', `url(#${id})`)
    u.setAttribute('x', '0')
    u.setAttribute('y', '0')
    u.setAttribute('width', '100%')
    u.setAttribute('height', '100%')

    cp.appendChild(cr)
    Δ.appendChild(cp)
    M.appendChild(u)

    return {item: ι, clip: cr}
  })
}

function _updateMasks(masks) {

  _.each(masks, ({item, clip}) => {
    let β = item.getBoundingClientRect()
    clip.setAttribute('x', (β.x || β.left))
    clip.setAttribute('y', (β.y || β.top))
    clip.setAttribute('width', β.width)
    clip.setAttribute('height', β.height)
  })



  // let μ   = document.getElementById('masks'),

  //     ℓβ  = document.getElementById('logo').getBoundingClientRect(),
  //     ℓc  = document.getElementById('logo-clip').querySelector('rect'),

  //     ƒβ  = document.getElementById('filter-btn').getBoundingClientRect(), 
  //     ƒc  = document.getElementById('filter-clip').querySelector('rect')

  // ℓc.setAttribute('x', ℓβ.x + 1)
  // ℓc.setAttribute('width', _.max([ℓβ.width - 2, 0]))
  // ℓc.setAttribute('y', ℓβ.y + 1)
  // ℓc.setAttribute('height', _.max([ℓβ.height - 2, 0]))

  // ƒc.setAttribute('x', ƒβ.x + 1)
  // ƒc.setAttribute('width', _.max([ƒβ.width - 2, 0]))
  // ƒc.setAttribute('y', ƒβ.y + 1)
  // ƒc.setAttribute('height', _.max([ƒβ.height - 2, 0]))

}

function init() {
  let masks = _initMasks()
  this.updateMask = _.partial(_updateMasks, masks)

  _initGradient()
}

export default {init}

