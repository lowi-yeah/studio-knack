import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from '../lib/svg-morpheus'
import util         from '../common/util'
import gradient     from '../common/gradient'
import pattern      from '../common/pattern'
import dom          from '../common/dom'
import filter       from './filter'



const EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']
const BASE_OFFSET = 4

function _showFilter() {
  let items   = document.querySelectorAll('#menu .filter.item'),
      promises  = _.map(items, item => 
                      new Promise( resolve => {
                        let τ = { x: '0px'},
                            α = { duration: _.random(240, 420),
                                  easing:   'random',
                                  complete: resolve}
                        dom.transform(item, τ, α) }))
  return Promise.all(promises) }

function _hideFilterItems() {
  let items   = document.querySelectorAll('#menu .filter.item'),
      promises  = _.map(items, item => 
                      new Promise( resolve => {
                        let τ = { x: `${item.clientWidth + BASE_OFFSET }px`},
                            α = { duration: _.random(240, 420),
                                  easing:   'random',
                                  complete: resolve}
                        dom.transform(item, τ, α) }))
  return Promise.all(promises) 
}

function _applyFilter() {
  let ƒ         = filter.get(),
      items     = document.querySelectorAll('#menu .filter.item'),
      promises  = _.map(items, item => 
                      new Promise( resolve => {
                        // don't hide the selected type label
                        if( ƒ && ƒ === item.getAttribute('data-type') ) return resolve()

                        let τ = { x: `${item.clientWidth + BASE_OFFSET }px`},
                            α = { duration: _.random(240, 420),
                                  easing:   'random',
                                  complete: resolve}
                        dom.transform(item, τ, α) }))
  return Promise.all(promises) 

  // return new Promise(resolve => resolve())
}

function _initMenuItem(ξ, clickFn) {
  let id = ξ.getAttribute('id')
  
  // we need an id on the menu item
  // if it hasn't got one: make one
  if(!id) { id = util.guid('i-')
            ξ.setAttribute('id', id) }

  util.addEvent(ξ, 'click', clickFn)
}

function _initTocButton() {
  return new Promise( resolve => {
    let button        = document.getElementById('toc-btn'),
        morphOptions  = { iconId:   'menu-closed', 
                          duration: 400, 
                          rotation: 'none' }, 
        morpheus      = new SVGMorpheus('#menu-icon', morphOptions),
        show          = () => { button.setAttribute('data-open', 1)
                                morpheus.to('menu-open')
                                _showFilter()
                              },
        hide          = () => { button.setAttribute('data-open', 0)
                                morpheus.to('menu-closed')
                                _applyFilter()
                              },
        toggle        = () => button.getAttribute('data-open') === '1' ?
                                hide() : show() 

    // toggle filter menu on click
    util.addEvent(button, 'click', toggle)

    // hide initially
    // button.style.transform = 'translateX(100%)'

    // make pattern
    pattern.make(button)

    // resolve the show, hide & toggle functions
    resolve({show, hide, toggle}) })}

function _initItems(toc) {
  // init filter items
  let filterItems = document.querySelectorAll('#menu .filter.item'),
      filterFn    = item =>
                      () => {
                        filter.set(item.getAttribute('data-type'))
                        toc.hide() }

  _.each(filterItems, filterItem => {
    dom.transform(filterItem, { x: `${filterItem.clientWidth + BASE_OFFSET }px`})
    // util.addEvent(filterItem, 'click', filterFn(filterItem)) 
  })

  }


function init() {
  console.log('initializing menu')
  return new Promise(resolve => {
    _.delay(() => {
      let m = document.getElementById('menu')
      if(!m) {resolve(); return}

      _initTocButton()
        .then(toc => _initItems(toc))
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