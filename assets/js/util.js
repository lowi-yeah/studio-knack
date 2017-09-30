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
  return parseFloat(style)
}


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

export default {
  addEvent,
  startAnimation,
  clearElement,
  guid,
  scrollTop,
  fontSize,
  isTouchDevice,
  getDevice
}