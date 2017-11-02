import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from '../lib/svg-morpheus'
import util         from '../common/util'
import gradient     from '../common/gradient'
import pattern      from '../common/pattern'
import dom          from '../common/dom'
import Σ            from '../common/search'
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
  let sidebar = document.getElementById('sidebar')
  sidebar.classList.add('hidden')
  }

function _showSearchbar() {
  console.log('show searchbar')

  // make the sidebar span the whole window
  let search  = document.getElementById('search'),
      input   = document.getElementById('search-input'),
      τ       = { x: 0 },
      α       = { duration: _.random(280, 420),
                  easing:   'random-out'}
  search.setAttribute('data-open', 1)
  _.defer(() => input.focus())
  dom.transform(search, τ, α)
}

function _hideSearchbar() {
  console.log('hide searchbar')
  let search  = document.getElementById('search'),
      τ       = { x: `${-search.clientWidth}px` },
      α       = { duration: _.random(280, 420),
                  easing:   'random-out'}
  search.setAttribute('data-open', 0)
  dom.transform(search, τ, α)
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
                                _hideSearchbar()
                              },
        toggle        = () => button.getAttribute('data-open') === '1' ?
                                hide() : show() 

    // toggle filter menu on click
    util.addEvent(button, 'click', toggle)

    // make pattern
    pattern.make(button)

    // resolve the show, hide & toggle functions
    resolve({show, hide, toggle}) })}

function _initSearch() {
  return new Promise( resolve => {
    let searchLink  = document.querySelector('#search-menu > a'),
        search      = document.getElementById('search'),
        input       = document.getElementById('search-input'),
        toggle      = () => search.getAttribute('data-open') === '1' ?
                              _hideSearchbar() : _showSearchbar() 

    // toggle filter menu on click
    util.addEvent(searchLink, 'click', toggle)

    // move the search field offscreen
    dom.transform(search, { x: `${-window.innerWidth}px` })

    // attach change handler to input
    util.addEvent(input, 'input', _.debounce(() => Σ.search(input.value),240))

    // resolve
    resolve() })}

function _initItems(toc) {
  // init filter items
  let filterItems = document.querySelectorAll('#menu .filter.item > a'),
      filterFn    = item =>
                      () => {
                        filter.set(item.getAttribute('data-link'))
                        toc.hide() }
  _.each(filterItems, filterItem => util.addEvent(filterItem, 'click', filterFn(filterItem)))}

function _initSidebar(toc){
  let sidebar = document.getElementById('sidebar')
  sidebar.classList.add('hidden')
  _initItems(toc)
  _initSearch()
}

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