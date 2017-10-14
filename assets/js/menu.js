import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from './lib/svg-morpheus'
import util         from './util'
import filter       from './filter'
import gradient from './gradient'
import pattern  from './pattern'
import dom      from './dom'


const EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
const BASE_OFFSET = 4

function _showFilters(morpheus) {
  console.log('_showFilters')
  
  let menuButton  = document.getElementById('filter-btn'),
      buttons     = document.querySelectorAll('#filters .category.button')
  menuButton.setAttribute('data-open', 1)
  morpheus.to('filter-closed')
 
  _.each(buttons, b => {
    let τ = { x: '0px'},
        α = { duration: _.random(240, 420),
              easing:   'random'}
    dom.transform(b, τ, α) 
  })
}

function _hideFilters(morpheus) {
  let menuButton  = document.getElementById('filter-btn'),
      buttons     = document.querySelectorAll('.category.button'),
      promises    = _.map(buttons, b => 
                      new Promise( resolve => {
                        let τ = { x: `${b.clientWidth + BASE_OFFSET }px`},
                            α = { duration: _.random(240, 420),
                                  easing:   'random',
                                  complete: resolve}
                        dom.transform(b, τ, α) }))
  morpheus.to('filter-open')
  menuButton.setAttribute('data-open', 0)
  return Promise.all(promises)
}

function _initCategoryButton(ξ, morpheus) {
  let id = ξ.getAttribute('id')
  if(!id) { 
    id = util.guid('i-')
    ξ.setAttribute('id', id) }
  util.addEvent(ξ, 'click', () => {
    _hideFilters(morpheus)
    filter(ξ.getAttribute('data-category')) }) }

function _initFilterMenuButton() {
  let button = document.getElementById('filter-btn'),
      morphOptions  = { iconId:   'filter-open', 
                        duration: 400, 
                        rotation: 'none' }, 
      morpheus    = new SVGMorpheus('#filter-icon', morphOptions) 

  // console.log('button')

  // toggle filter menu on click
  util.addEvent(button, 'click', () => {
    
    let Φ = button.getAttribute('data-open') === '0'
    console.log('click', Φ)
    if(Φ) _showFilters(morpheus)
    else _hideFilters(morpheus) 
  })

  // hide initially
  // button.style.transform = 'translateX(100%)'

  // make pattern
  pattern.make(button)

  return morpheus }

function _initFilters() {
  let ƒ = document.getElementById('filters'),
      β = document.getElementById('filter-btn'),
      ε = ƒ.querySelectorAll('.category.button'),
      μ = _initFilterMenuButton()

  _.each(ε, ξ => _initCategoryButton(ξ, μ))

  return _hideFilters(μ)
    .then( () => {
      _.delay(() => {
        anime({ targets:    β,
                translateX: 0,
                duration:   400,
                easing:     _.sample(EASINGS)
                // update:     () => gradient.updateMask(β.getAttribute('id')) 
              })
      }, 1000)
    })
  }


function init() {
  return new Promise(resolve => {
    _.delay(() => {
      let m = document.getElementById('menu')
      if(!m) {resolve(); return}

      _initFilters()
        .then(() => { 
           anime( { targets:  m,
                    opacity:  1,
                    duration: 400,
                    easing:   _.sample(EASINGS),
                    complete: resolve
                  })
           })
    }, 640)

  })
}
export default {init}