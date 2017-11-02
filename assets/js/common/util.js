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

function guid(prefix) {
  prefix = `${prefix}-` || ''
  let s4 = () =>  Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1)
  // return prefix + s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() 
  return prefix + s4() + s4() + '-' + s4() + s4()
}

function fontSize(ε) {
  let style = window.getComputedStyle(ε, null).getPropertyValue('font-size')
  return parseFloat(style) }


function getDevice(width) {
  width = width || window.innerWidth
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
  return { x:       (β.x || β.left),
           width:   β.width,
           y:       (β.y || β.top),
           height:  β.height }}

function extent(item) {
  let β = item.getBoundingClientRect()
  return { x0: (β.x || β.left),
           x1: (β.x || β.left) + β.width,
           y0: (β.y || β.top),
           y1: (β.y || β.top) + β.height }}

function isMobile() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) }

function getBrowserName() {
    var name = "Unknown";
    if(navigator.userAgent.indexOf("MSIE")!=-1){
        name = "MSIE";
    }
    else if(navigator.userAgent.indexOf("Firefox")!=-1){
        name = "Firefox";
    }
    else if(navigator.userAgent.indexOf("Opera")!=-1){
        name = "Opera";
    }
    else if(navigator.userAgent.indexOf("Chrome") != -1){
        name = "Chrome";
    }
    else if(navigator.userAgent.indexOf("Safari")!=-1){
        name = "Safari";
    }
    return name;   
}

export default {
  addEvent,
  boundingBox,
  clearElement,
  distance,
  extent,
  fontSize,
  getCssValuePrefix,
  getDevice,
  guid,
  isMobile,
  isTouchDevice,
  pretty,
  scrollTop,
  startAnimation,
  getBrowserName
}