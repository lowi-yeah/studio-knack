import { lory } from 'lory.js';
import imagesLoaded from 'imagesloaded'

let lorySlider,
    fps, fpsInterval, startTime, now, then, elapsed

function _animate() {
  requestAnimationFrame(_animate);
  now = Date.now()
  elapsed = now - then
  if (elapsed > fpsInterval) {
    then = now - (elapsed % fpsInterval);
    lorySlider.next() }}

function _start(fps) {
    fpsInterval = 1000 / fps
    then = Date.now()
    startTime = then
    _animate()}

function init(selector) {

  let slider = document.querySelector(selector)
  console.log('init slider', slider)

  if (!slider) return
  
  imagesLoaded(slider).on('always', () => {
    console.log('imagesloaded')
    lorySlider = lory(slider, {infinite: 1, enableMouseEvents: true})
    _start(0.16) // every five seconds
})}

export default { init }