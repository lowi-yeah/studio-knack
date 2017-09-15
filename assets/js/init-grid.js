import _              from 'lodash'
import imagesLoaded   from 'imagesloaded'
import isotopePackery from 'isotope-packery'
import Isotope        from 'isotope'
import InfiniteScroll from 'infinite-scroll'
import {scaleLinear}  from 'd3-scale'
import isMobile       from 'ismobilejs'
import anime          from 'animejs'
import tinycolor      from 'tinycolor2'
import ςaption        from './captions'


// function isTouchDevice() { 
//   console.log('isMobile', isMobile)
//   return isMobile.phone || isMobile.seven_inch || isMobile.tablet }

// hleper function to detect whether or not the browser is touchy
function isTouchDevice() {
  return 'ontouchstart' in window // works on most browsers 
      || navigator.maxTouchPoints } // works on IE10/11 and Surface

// make imagesLoaded available for InfiniteScroll
InfiniteScroll.imagesLoaded = imagesLoaded


let selector = '.main.grid'

// helper function that randomly assigns the size attribute of an element,
// if it's not already set
function _sizeUp(element) {
  let size = element.getAttribute('size')
  if(size) element.setAttribute('size', size) 
  else {
    size = _.sample([50, 75, 100, 33.3, 66.6]) + '%'
    if (isMobile.phone || isMobile.seven_inch ) size = '100%'
    element.style.width = size } }

function _randomizePadding(item) {
  let element   = item.getElementsByClassName('box')[0],
      width     = element.offsetWidth,
      paddings  = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
      padding   = _.reduce(paddings, (r,d) => {
                    r[d] = _.round(_.random(width * 0.024, width * 0.16)) + 'px'
                    // r[d] = '0px'
                    return r }, {})
  _.each(padding, (v, k) => element.style[k] = v ) }



function _initFilters(isotope, menu) {
  let base    = document.querySelector(selector),
      inputs  = document.querySelectorAll('.filter input[type="checkbox"]')

  function _filter() {
    let values    = _(inputs)
                      .map(checkbox => {
                        let name = checkbox.getAttribute('filter')
                        return {name: name, checked: checkbox.checked}})
                      .filter(({checked}) => checked)
                      .value(),
        filterFn  = function(item) {
                      let category  = item.getAttribute('category'),
                          index     = _.find(values, { name: category })
                      return !_.isNil(index)}
    isotope.arrange({ filter: filterFn })
    menu.close() }
    
  _.each(inputs, ι => { ι.onchange = _filter }) // attach onChange handler to each checkbox
  // filter once upon init
  _filter() } 

function _initializeItems(items) {
  _.each(items, item => {
    _sizeUp(item)
    _randomizePadding(item)
    ςaption.init(item)
  })}


export default function initGrid(menu) {
  let base = document.querySelector(selector);
  if (!base) return

  let isotope   = new Isotope( base, {itemSelector: '.grid-item',
                                      layoutMode:   'packery',
                                      // layoutMode:   'masonry',
                                      filter:       '*'}),
      infScroll = new InfiniteScroll( base, { path:     '#next > a',
                                              append:   '.grid-item',
                                              outlayer: isotope,
                                              status:   '.page-load-status',
                                              hideNav:  '#next'}),
      filters   = _initFilters(isotope, menu),
      items     = _.map(isotope.items, item =>  item.element)

    _initializeItems(items)
    // isotope.on( 'layoutComplete', ( isotopeItems ) => 
    //   _initializeCaptions(_.map(isotopeItems, item =>  item.element)))
    isotope.layout()


    // upon append, initialize the new grid items. then re-layout
    infScroll.on( 'append', (response, path, items) => {
      _initializeItems(items)
      isotope.layout()})}
