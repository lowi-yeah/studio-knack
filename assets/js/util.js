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

export default {
  addEvent:       addEvent,
  startAnimation: startAnimation
}