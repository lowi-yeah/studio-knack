import {scaleLinear}  from 'd3-scale'
import tinycolor      from 'tinycolor2'
import anime          from 'animejs'
import svgText        from './svg-text'
import util           from './util'

let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

let fontWeights     = [400, 700, 800, 900],
    fontWeightΣ     = scaleLinear()
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

  console.log('_resize', caption)
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
  _.delay(() => _captionHeight(caption, ƒSize, 0), 100)
}

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

function _make(text) {
  let frame   = document.getElementById('all-overlays'),
      overlay = document.createElement('div'),
      teχt    = svgText.init(text, overlay)

      // caption = document.createElement('div')
  // caption.classList.add('caption')
  // caption.innerHTML = text
  // overlay.appendChild(caption)

  overlay.classList.add('overlay')
  frame.appendChild(overlay)
  return teχt}

function init(item) {


  let image   = item.getElementsByTagName('img')[0],
      text    = item.getAttribute('data-caption'),
      overlay = document.getElementById('overlay'),
      caption = _make(text)

  // defer so that the overlay element has time to get settled
  _.defer(() => {
    let duration  = 500,
        animation
    
    util.addEvent(image, 'mouseenter', () => {
      util.clearElement(overlay)
      overlay.appendChild(caption.cloneNode(true))
      overlay.style.top = -(caption.clientHeight + 48) + 'px'
    })

    util.addEvent(image, 'mouseleave', () => {
      util.clearElement(overlay)
      overlay.style.top = '2px'
    })
  })

  // util.addEvent(image, 'mouseleave', () => console.log('leave'))
  
  // mouseenter
  // mouseleave

  // _resize(caption)
  // _initOverlay(item.querySelector('.content'))

  // // adjust the colors of each caption based on the background image
  // // advanced image-schmafu going on here.
  // // it works, because images are hosted via datoCMS which in turn uses 
  // // imgix (https://docs.imgix.com/apis/url) and thus allows for the automated 
  // // extraction of color palletes
  // _loadPallete(item)
  //   .then(p => {
  //     let main = tinycolor(p.colors[0].hex), primary
  //     if(main.isLight()) primary = p.dominant_colors.vibrant_light || p.colors[0]
  //     else  primary = p.dominant_colors.vibrant_dark || p.colors[0] 
  //     caption.style.color = primary.hex })
}

export default { init: init }