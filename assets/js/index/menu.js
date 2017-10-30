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
  let sidebar = document.getElementById('sidebar'),
      promises  = _.map(items, item => 
                      new Promise( resolve => {
                        let τ = { x: `${item.clientWidth + BASE_OFFSET }px`},
                            α = { duration: _.random(240, 420),
                                  easing:   'random',
                                  complete: resolve}
                        dom.transform(item, τ, α) }))
  return Promise.all(promises) 
}

function _showSidebar() {
  let sidebar = document.getElementById('sidebar')
  sidebar.classList.remove('hidden')}

function _hideSidebar() {
  console.log('hide sidebar')
  let sidebar = document.getElementById('sidebar')
  sidebar.classList.add('hidden')
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
                                _showSidebar()
                              },
        hide          = () => { button.setAttribute('data-open', 0)
                                morpheus.to('menu-closed')
                                _hideSidebar()
                              },
        toggle        = () => button.getAttribute('data-open') === '1' ?
                                hide() : show() 

    // toggle filter menu on click
    util.addEvent(button, 'click', toggle)

    // make pattern
    pattern.make(button)

    // resolve the show, hide & toggle functions
    resolve({show, hide, toggle}) })}

function _initItems(toc) {
  // init filter items
  let filterItems = document.querySelectorAll('#menu .filter.item > a'),
      filterFn    = item =>
                      () => {
                        _.delay(() => filter.set(item.getAttribute('data-link')),420)
                        toc.hide() }
  _.each(filterItems, filterItem => util.addEvent(filterItem, 'click', filterFn(filterItem)))}

function _initSidebar(toc){
  let sidebar = document.getElementById('sidebar')
  sidebar.classList.add('hidden')
  _initItems(toc)}

function activate(filter) {
  // init filter items
  let items = document.querySelectorAll('#menu .filter.item > a')
  _.each(items, item => {
    let link = item.getAttribute('data-link')
    if(link === filter) item.classList.add('active')
    else item.classList.remove('active')
  })}

function init() {
  console.log('initializing menu')
  return new Promise(resolve => {
    _.delay(() => {
      let m = document.getElementById('menu')
      if(!m) {resolve(); return}

      let ƒ = document.getElementById('wrap')
                .getAttribute('data-type')
                .toLowerCase()
      _initTocButton()
        .then(toc => _initSidebar(toc))
        .then(()  => activate(ƒ))
        .then(() => { 
           anime( { targets:  m,
                    opacity:  1,
                    duration: 400,
                    easing:   _.sample(EASINGS),
                    complete: resolve })})
      
    }, 640)
  })
}
export default {init, activate}