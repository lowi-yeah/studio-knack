import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from './lib/svg-morpheus'
import util         from './util'
import filter       from './filter'
import gradient     from './gradient'


const EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
const BASE_OFFSET = 4

function _showFilters(morpheus) {
  console.log('_showFilters')
  let ƒ = document.getElementById('filters'),
      buttons = ƒ.querySelectorAll('.category.button')
  ƒ.setAttribute('data-open', 1)
  morpheus.to('filter-closed')
  _.each(buttons, b => {
    anime({ targets:     b,
            translateX:  0,
            duration:   240 + Math.random() * 240,
            easing:     _.sample(EASINGS),
            update:     () => gradient.updateMask(b.getAttribute('id'))})})}

function _hideFilters(morpheus) {
  let ƒ = document.getElementById('filters'),
      buttons   = ƒ.querySelectorAll('.category.button'),
      promises  = _.map(buttons, b => {
                    let id = b.getAttribute('id')
                    return new Promise( resolve => {
                      anime({ targets:    b,
                              translateX: ƒ.clientWidth + BASE_OFFSET,
                              duration:   240 + Math.random() * 240,
                              easing:     _.sample(EASINGS),
                              complete:   resolve,
                              update:     () => gradient.updateMask(id)})})})

  console.log('_hideFilters', ƒ.clientWidth + BASE_OFFSET)
  morpheus.to('filter-open')
  ƒ.setAttribute('data-open', 0)
  return Promise.all(promises)
}

function _initCategoryButton(ξ, morpheus) {
  let id = ξ.getAttribute('id')
  if(!id) { 
    id = `i-${util.guid()}`
    ξ.setAttribute('id', id) }

  util.addEvent(ξ, 'click', () => {
    _hideFilters(morpheus)
    filter(ξ.getAttribute('data-category')) }) }

function _initFilters() {
  let ƒ = document.getElementById('filters'),
      β = document.getElementById('filter-btn'),
      ε = ƒ.querySelectorAll('.category.button')

  let morphOptions  = { iconId:   'filter-open', 
                        duration: 400, 
                        rotation: 'none' }, 
      morpheus    = new SVGMorpheus('#filter-icon', morphOptions) 

  util.addEvent(β, 'click', () => {
    let Φ = ƒ.getAttribute('data-open') === '0'
    if(Φ) _showFilters(morpheus)
    else _hideFilters(morpheus) })

  β.style.transform = 'translateX(100%)'

  _.each(ε, ξ => _initCategoryButton(ξ, morpheus))


  return _hideFilters(morpheus)
    .then( () => {
      _.delay(() => {
        anime({ targets:    β,
                translateX: 0,
                duration:   400,
                easing:     _.sample(EASINGS),
                update:     () => gradient.updateMask(β.getAttribute('id')) })
      }, 1000)})}


function init() {
  return new Promise(resolve => {
    _.delay(() => {
      let m = document.getElementById('menu')
      if(!m) {resolve(); return}
      
      m.style.display = 'flex'
      m.style.transform = 'translateX(100%)'

      _initFilters()
        .then(() => { 
          m.style.transform = 'translateX(0)'
          resolve() })
    }, 640)

  })
}
export default {init}