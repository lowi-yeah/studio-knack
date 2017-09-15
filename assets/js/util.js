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

export default {
  addEvent:       addEvent,
  startAnimation: startAnimation,
  clearElement:   clearElement,
  guid:           guid,
  scrollTop:      scrollTop
}