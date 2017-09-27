import _              from 'lodash'
import imagesLoaded   from 'imagesloaded'
import isotopePackery from 'isotope-packery'
import Isotope        from 'isotope'
import InfiniteScroll from 'infinite-scroll'
import {scaleLinear}  from 'd3-scale'
import isMobile       from 'ismobilejs'
import anime          from 'animejs'
import tinycolor      from 'tinycolor2'
import skrollr        from 'skrollr'
import ςaption        from './captions'


// make imagesLoaded available for InfiniteScroll
InfiniteScroll.imagesLoaded = imagesLoaded


let LAYOUT_MODE = 'fitRows'
// let LAYOUT_MODE = 'masonry'
// let LAYOUT_MODE = 'packery'

let selector = '.main.grid'
let PROBABILITY = 0.72
let ɢʀ = 0.618033989


// Responsiveness
function _addEvent(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return
  if (object.addEventListener) object.addEventListener(type, callback, false)
  else if (object.attachEvent) object.attachEvent('on' + type, callback)
  else object['on'+type] = callback }

function _getDevice(width) {
  let breakpoints = { 480:  'mobile',
                      769:  'tablet',
                      1000: 'desktop',
                      1192: 'widescreen'},
      device      = _.find(breakpoints, (_, k) => width < parseInt(k) )
  return device || 'fullhd' }

// function isTouchDevice() { 
//   console.log('isMobile', isMobile)
//   return isMobile.phone || isMobile.seven_inch || isMobile.tablet }

// hleper function to detect whether or not the browser is touchy
function isTouchDevice() {
  return 'ontouchstart' in window // works on most browsers 
      || navigator.maxTouchPoints } // works on IE10/11 and Surface



// helper function that randomly assigns the size attribute of an element,
// if it's not already set
function _resizeItem(item) {
    let ww      = window.innerWidth,
        wh      = window.innerHeight,  
        device  = _getDevice(ww),
        width   = ww, 
        height  = ww*ɢʀ

    if(device === 'mobile') {
      // one column
      width   = ww
      height  = _.random(1, true) < PROBABILITY ? 
                  (ww * ɢʀ) : 
                  (ww * (1+ɢʀ))}

    if(device === 'tablet') {
      // two columns
      width   = _.random(1, true) < 0.5 ? 
                  (ww * ɢʀ) : 
                  (ww * (1-ɢʀ))

      height  = _.random(1, true) < 0.5 ? 
                  (width * ɢʀ) : 
                  (width * (1+ɢʀ)) }

    if(device === 'desktop') {
      // two columns
      width   = _.random(1, true) < PROBABILITY ? 
                  (ww * ɢʀ) : 
                  (ww * (1-ɢʀ))

      height  = _.random(1, true) < 0.5 ? 
                  (width * ɢʀ) : 
                  (width * (1+ɢʀ)) }

    if(device === 'widescreen') {
      // three columns
      let δ   = [ww*(1-ɢʀ), ww*(ɢʀ*ɢʀ), ww*(ɢʀ*(1-ɢʀ)) ]
      width   = _.sample(δ)
      height  = ((_.random(1, true) > PROBABILITY) || (width === ww*(ɢʀ*(1-ɢʀ)))) ? 
                  (width * (1+ɢʀ)):
                  (width * ɢʀ) }

     if(device === 'fullhd') {
       // three columns
      let δ       = [ww*(1-ɢʀ), ww*(ɢʀ*ɢʀ), ww*(ɢʀ*(1-ɢʀ)) ]
          width   = _.sample(δ)
          height  = ((_.random(1, true) > PROBABILITY) || (width === ww*(ɢʀ*(1-ɢʀ)))) ? 
                  (width * (1+ɢʀ)):
                  (width * ɢʀ) }
      // // four
      // let δ   = [ww*(ɢʀ*ɢʀ), ww*(ɢʀ*(1-ɢʀ)), ww*(ɢʀ*ɢʀ*ɢʀ), ww*(ɢʀ*ɢʀ*(1-ɢʀ))]
      // width   = _.sample(δ)
      // height  = _.random(1, true) > PROBABILITY ? 
      //             (width * (1+ɢʀ)):
      //             (width * ɢʀ) }

    // clamp to window height
    height              = _.min([height, wh])

    // set style
    item.style.width    = width  + 'px' 
    item.style.height   = height + 'px' 
}

function _randomizePadding(item) {
  let element   = item.getElementsByClassName('box')[0],
      width     = element.offsetWidth,
      paddings  = ['padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
      padding   = _.reduce(paddings, (r,d) => {
                    // r[d] = '16px'
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
    // _resizeItem(item)
    _randomizePadding(item)
    // ςaption.init(item)
  })}

function _initParallax(skroll) {
  console.log('init parallax')
  let items = document.querySelectorAll('.grid-item'),
      baseOffset = document.querySelector(selector).offsetTop

  _.each(items, item => {
    
    if(item.getAttribute('data-parallax')) return

    let o = item.offsetTop - item.clientHeight,
        e = item.offsetTop + window.innerHeight
      item.setAttribute(`data-${o}`, `transform:translate(0,${_.random(0, window.innerHeight)}px);`)
      item.setAttribute(`data-${e}`, `transform:translate(0,0px);`)
      item.setAttribute('data-parallax', true)
  })

  skroll.refresh()
}

function init(menu) {
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
      items     = _.map(isotope.items, item =>  item.element),
      filters   = _initFilters(isotope, menu)

    // _initializeItems(items)
    // isotope.layout()

    // upon append, initialize the new grid items. then re-layout
    // infScroll.on( 'append', (response, path, items) => {
    //   _initializeItems(items, isotope)
    //   isotope.layout()})

    // let skroll = skrollr.init()
    // isotope.on( 'layoutComplete', _.debounce(() => _initParallax(skroll), 240))

    // _addEvent(window, 'resize', 
    //   _.debounce(() => 
    //     _initializeItems(document.querySelectorAll('.grid-item'), isotope), 150)) 

  }

function filter() {
  console.log('filter grid')
}

export default { init: init, filter: filter}
