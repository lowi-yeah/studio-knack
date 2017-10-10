import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from './lib/svg-morpheus'
import voronoi      from './voronoi'
import util         from './util'
import filter       from './filter'
import gradient     from './gradient'


const EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
const BASE_OFFSET = 72

function _showFilters() {
  console.log('_showFilters')
  let ƒ = document.getElementById('filters')
  ƒ.setAttribute('data-open', 1)
  anime({ targets:     ƒ,
          translateX:  0,
          duration:   240 + Math.random() * 240,
          easing:     _.sample(EASINGS),
          update:     gradient.updateMask})
}

function _hideFilters() {
  console.log('_hideFilters')
  let ƒ = document.getElementById('filters')
  ƒ.setAttribute('data-open', 0)
  anime({ targets:    ƒ,
          translateX: ƒ.clientWidth - BASE_OFFSET,
          duration:   240 + Math.random() * 240,
          easing:     _.sample(EASINGS),
          update:     gradient.updateMask})
}

function _initToc() { 
  let toc = document.getElementById('toc') 
  if (!toc) return 
  let tocOptions  = { iconId:   'burger', 
                      duration: 400, 
                      rotation: 'none' }, 
      morpheus    = new SVGMorpheus('#iconset', tocOptions) 
  toc.style.display = 'flex' 
  toc.onclick = () => { 
    if( morpheus._curIconId === 'burger') _showMenu(morpheus) 
    if( morpheus._curIconId === 'close' ) _hideMenu(morpheus) } 

  _showMenu(morpheus) 

  return morpheus 
} 


function _initFilters() {
  // console.log('_initFilters')
  // let ς = document.querySelector('#filters select')
  // ς.options.value = 'all'
  // _.defer(() => filter(ς.value))

  let ƒ = document.getElementById('filters'),
      β = document.getElementById('filter-btn'),
      ε = ƒ.querySelectorAll('.field button')
  ƒ.style.transform = `translateX(${ƒ.clientWidth - 4}px)`

  util.addEvent(β, 'click', () => {
    let Φ = ƒ.getAttribute('data-open') === '0'
    if(Φ) _showFilters()
    else _hideFilters() })

  _.each(ε, ξ => {
    util.addEvent(ξ, 'click', () => {
      // console.log('ξ', ξ.getAttribute('data-category'))
      _hideFilters()
      filter(ξ.getAttribute('data-category'))  
    })
    
  })

  _.defer(_hideFilters)

  // ƒ.style.background = '#FF6B67'
  // _show( ƒ )
}


function init() {
  return new Promise(resolve => {
    document.getElementById('menu').style.display = 'flex'
    _initToc()
    _initFilters()
    resolve()
  })
}
export default {init}