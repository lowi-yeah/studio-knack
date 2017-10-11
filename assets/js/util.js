function addEvent(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return
  if (object.addEventListener) object.addEventListener(type, callback, false)
  else if (object.attachEvent) object.attachEvent('on' + type, callback)
  else object['on'+type] = callback }

function startAnimation(fps, fn) {
  let fpsInterval   = 1000 / fps, 
      then          = Date.now() + 2000,
      startTime     = then, now, elapsed,
      animate     = () => {
                      requestAnimationFrame(animate)
                      now = Date.now()
                      elapsed = now - then
                      if (elapsed > fpsInterval) {
                        then = now - (elapsed % fpsInterval)
                        fn() }}
  animate() }

function clearElement(element) {
  while (element.hasChildNodes()) element.removeChild(element.lastChild)
}

function scrollTop() {
  let doc = document.documentElement
      // left = (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
  return (window.pageYOffset || doc.scrollTop)  - (doc.clientTop || 0) }

function guid() {
  let s4 = () =>  Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() }

function fontSize(ε) {
  let style = window.getComputedStyle(ε, null).getPropertyValue('font-size')
  return parseFloat(style) }


function getDevice(width) {
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

function pretty(s) { return JSON.stringify(s, null, 2) }

function distance(p0, p1) {
  return Math.sqrt( Math.pow((p1.x - p0.x), 2) + Math.pow((p1.y - p0.y), 2)  )
}

function getCssValuePrefix() {
  var rtrnVal = '';//default to standard syntax
  var prefixes = ['-o-', '-ms-', '-moz-', '-webkit-'];
  // Create a temporary DOM object for testing
  var dom = document.createElement('div');
  for (var i = 0; i < prefixes.length; i++) {
      // Attempt to set the style
      dom.style.background = prefixes[i] + 'linear-gradient(#000000, #ffffff)';

      // Detect if the style was successfully set
      if (dom.style.background) {
          rtrnVal = prefixes[i] }}
  dom = null
  return rtrnVal }

function boundingBox(item) {
  let β = item.getBoundingClientRect()
  return { x:       β.left,
           width:   β.width,
           y:       β.top,
           height:  β.height }}

function extent(item) {
  let β = item.getBoundingClientRect()
  return { x0: (β.x || β.left),
           x1: (β.x || β.left) + β.width,
           y0: (β.y || β.top),
           y1: (β.y || β.top) + β.height }}

export default {
  addEvent,
  startAnimation,
  clearElement,
  guid,
  scrollTop,
  fontSize,
  isTouchDevice,
  getDevice,
  pretty,
  distance,
  getCssValuePrefix,
  boundingBox,
  extent
}