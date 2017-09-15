import {scaleLinear}  from 'd3-scale'
import tinycolor      from 'tinycolor2'
import anime          from 'animejs'
import svgText        from './svg-text'
import util           from './util'

let EASINGS     = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack'],
    DIRECTIONS  = ['left', 'bottom', 'right'],
    PADDING_TOP = 24

let fontWeights = [400, 700, 800, 900],
    fontWeightΣ = scaleLinear()
                        .domain([64, 16])
                        .rangeRound([0, 3])

fontWeightΣ.clamp(true)

// helper function to detect whether or not the browser is touchy
function isTouchDevice() {
  return 'ontouchstart' in window // works on most browsers 
      || navigator.maxTouchPoints } // works on IE10/11 and Surface

function _getFontSize(element) {
  let style = window.getComputedStyle(element, null).getPropertyValue('font-size')
  return parseFloat(style)}

function _setFontSize(element, size) { element.style.fontSize = size + 'px'}

function _loadPallete(item) {
  let url = item.querySelector('.pallete').getAttribute('href')
  return new Promise((resolve, reject) => {
    var request = new XMLHttpRequest()
    request.open('GET', url, true)
    request.onload = () => {
      if (request.status >= 200 && request.status < 400) 
        resolve(JSON.parse(request.responseText))
      else reject() }
    request.onerror = reject
    request.send() })}

// recursive helper for adjusting a caption's height
function _captionHeight(caption, ƒSize, i) {
  let ch      = caption.offsetHeight,
      ph      = caption.parentElement.parentElement.offsetHeight,
      ratioH  = ch/ph
  if(i > 42) return // safety first
  if(ratioH > 1) {
    ƒSize = ƒSize * 0.81
    _setFontSize(caption, ƒSize)
    _.delay(() => _captionHeight(caption, ƒSize, (i+1)), 100) } 
  else {
    caption.style.opacity = 1
    caption.style.fontWeight = fontWeights[fontWeightΣ(ƒSize)] }}

function _distMetric(x,y,x2,y2) {
  let xDiff = x - x2,
      yDiff = y - y2
  return (xDiff * xDiff) + (yDiff * yDiff) }

//Detect Closest Edge
function _closestEdge(x,y,w,h) {
  let topEdgeDist     = _distMetric(x,y,w/2,0),
      bottomEdgeDist  = _distMetric(x,y,w/2,h),
      leftEdgeDist    = _distMetric(x,y,0,h/2),
      rightEdgeDist   = _distMetric(x,y,w,h/2),
      min             = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist)
  switch (min) {
    case leftEdgeDist:    return 'left'
    case rightEdgeDist:   return 'right'
    case topEdgeDist:     return 'top'
    case bottomEdgeDist:  return 'bottom' } }

// helper function that resises the image caption depending on
// the container size
// the  bigger the container, the biggger and silmmer the font
function _resize(caption) {
  // as touch devices have no hover, we don't transition the caption
  // but render it in small text at the bottom of the container
  if(isTouchDevice()) {
    _setFontSize(caption, 16)
    caption.style.opacity         = 1
    // caption.style['align-self']   = 'flex-end'
    // caption.style['text-shadow']  = 'none'
    // caption.style.background      = 'rgb(255, 255, 255)'
    return}
  let cw        = caption.offsetWidth,
      pw        = caption.parentElement.parentElement.offsetWidth,
      ratioW    = pw/cw,
      ƒSize     = _getFontSize(caption) * 0.81,
      newƒSize  = ƒSize * ratioW
  _setFontSize(caption, newƒSize)
  // we need the delays so that the elements have a chance to get redrawn
  _.delay(() => _captionHeight(caption, ƒSize, 0), 100) }

function _coordinates(self, e) {
  function _offset({x, y}, ε) {
    x += ε.offsetLeft
    y += ε.offsetTop
    if(ε.className.match(/^main grid$/)) return {x, y}
    else return _offset({x, y}, ε.parentNode) }

  let {x, y} = _offset({x: 0, y: 0}, self) 
  x = e.pageX - x
  y = e.pageY - y
  return {x, y} }

function _initOverlay(item) {
  if(isTouchDevice()) { // check if we have a touch device, if so show the text
    let overlay   = item.getElementsByClassName('overlay')[0]
    overlay.style.left = 0 }
  item.onmouseenter = function(e){
    if(isTouchDevice()) return
    let {x, y}    = _coordinates(this, e),
        edge      = _closestEdge(x, y, this.clientWidth, this.clientHeight),
        overlay   = this.getElementsByClassName('overlay')[0],
        easing    = 'easeOutQuad',
        duration  = 720
  
    switch(edge){
      case 'left':
        //tween overlay from the left
        overlay.style.top = '0%'
        overlay.style.left = '-100%'
        anime({ targets: overlay,
                left: '0%',
                easing: easing,
                duration: duration })
        break
      case 'right':
        overlay.style.top = '0%'
        overlay.style.left = '100%'
        anime({ targets: overlay,
                left: '0%',
                easing: easing,
                duration: duration })
        break
      case 'top':
        overlay.style.top = '-100%'
        overlay.style.left = '0%'
        anime({ targets: overlay,
                top: '0%',
                easing: easing,
                duration: duration })
        break
      case 'bottom':
        overlay.style.top = '100%'
        overlay.style.left = '0%'
        anime({ targets: overlay,
                top: '0%',
                easing: easing,
                duration: duration })
        break}}
  item.onmouseleave = function(e){
    if(isTouchDevice()) return

    let {x, y}    = _coordinates(this, e),
        edge      = _closestEdge(x,y,this.clientWidth, this.clientHeight),
        overlay   = this.getElementsByClassName('overlay')[0],
        easing    = 'easeOutQuad',
        duration  = 720
  
    switch(edge){
      case 'left':
        anime({ targets: overlay,
                left: '-100%',
                easing: easing,
                duration: duration })
        break
      case 'right':
        anime({ targets: overlay,
                left: '100%',
                easing: easing,
                duration: duration })
        break
      case 'top':
        anime({ targets: overlay,
                top: '-100%',
                easing: easing,
                duration: duration })
        break
      case 'bottom':
        anime({ targets: overlay,
                top: '100%',
                easing: easing,
                duration: duration })
        break }}
      }

function _makeCaption(text) {
  let frame   = document.getElementById('all-overlays'),
      teχt    = svgText.init(text, frame)
  frame.appendChild(teχt)
  return teχt }

function _copyCaption(ηCaption) {
  let ς = document.createElement('div')
  ς.classList.add('caption-frame')
  ς.style.height = `${ηCaption.clientHeight}px`
  ς.appendChild(ηCaption.cloneNode(true))
  return ς }

function _animate(target, options) {
  let α = { autoplay: false,
            targets: target,
            easing: _.sample(EASINGS),
            duration: _.random(120, 320)}
  _.each(options, (v, k) => α[k] = v)
  return anime(α)}

function _makeBackground(ηFrame, height) {
  let β         = document.createElement('div'),
      direction = _.sample(DIRECTIONS), 
      transform

  // three choices for the position:
  // right, left & to the bottom
  if(direction === 'left') 
    transform = [ `translateX(${-window.innerWidth}px)`,
                  `translateY(0px)`]
  if(direction === 'right') 
    transform = [ `translateX(${window.innerWidth}px)`,
                  `translateY(0px)`]
  if(direction === 'bottom') 
    transform = [ `translateX(0px)`,
                  `translateY(${height}px)`]

  β.classList.add('caption-bg')
  β.style.height    = `${height}px`
  β.style.transform = transform.join(' ')

  ηFrame.appendChild(β)
  return β }

function _showCaption(ηc, height) {
  let direction = _.sample(DIRECTIONS)
  if(direction === 'left')    ηc.style.transform = `translateX(${-window.innerWidth}px)`
  if(direction === 'right')   ηc.style.transform = `translateX(${window.innerWidth}px)`
  if(direction === 'bottom')  ηc.style.transform = `translateY(${height}px)`

  let options = { translateX: '0px', 
                  translateY: '0px',
                  autoplay:   false}
  return _animate(ηc, options)}

function _hideCaption(ηc, height) {

  // pick a random animation direction
  let direction = _.sample(DIRECTIONS), 
      options   = { autoplay: true }

  if(direction === 'left') options.translateX =  `${-window.innerWidth}px`
  if(direction === 'right') options.translateX = `${window.innerWidth}px`
  if(direction === 'bottom') options.translateY = `${height}px`

  return _animate(ηc, options)}

function _showBackground(ηβ) {
  let options = { translateX: '0px', 
                  translateY: '0px',
                  autoplay:   true}
  return _animate(ηβ, options) }

function _hideBackground(ηβ, height) {
  // pick a random animation direction
  let direction = _.sample(DIRECTIONS), 
      options   = { autoplay: true }

  if(direction === 'left') options.translateX   = `${-window.innerWidth}px`
  if(direction === 'right') options.translateX  = `${window.innerWidth}px`
  if(direction === 'bottom') options.translateY = `${height}px`

  return _animate(ηβ, options)}

function init(item) {
  let image     = item.getElementsByTagName('img')[0],        // the hover target
      text      = item.getAttribute('data-caption'),          // the capure text
      ηFrame    = document.getElementById('overlay-frame'),   // frame DOM node 
      ηCaption  = _makeCaption(text)                         // generate the caption node

  // defer so that the DOM has time to get settled
  _.defer(() => {
    let duration  = 500,
        cHeight   = ηCaption.clientHeight,
        bgΔ       = anime({ targets: '.nil', duration: 1}),   // make some dummy animations
        cΔ        = anime({ targets: '.nil', duration: 1}),   // just to get them initialized
        ηβ, ηc

    util.addEvent(image, 'mouseenter', () => {
      ηβ  = _makeBackground(ηFrame, cHeight + PADDING_TOP)   // create a background DOM node
      ηc  = _copyCaption(ηCaption)
      cΔ  = _showCaption(ηc, cHeight) 

      ηFrame.appendChild(ηc)
      bgΔ = _showBackground(ηβ) 

      // when showing, we wait for the background to finish before showing the caption
      bgΔ.finished.then(() => cΔ.play()) })

    util.addEvent(image, 'mouseleave', () => {
      bgΔ.pause()
      cΔ  = _hideCaption(ηc, cHeight)
      bgΔ = _hideBackground(ηβ, cHeight + PADDING_TOP)

      // when hiding, we wait for the animations to finish and then remove the dom nodes
      bgΔ.finished.then(() => ηβ.parentNode.removeChild(ηβ))
      cΔ.finished.then(() => ηc.parentNode.removeChild(ηc))})
  })}

export default { init: init }