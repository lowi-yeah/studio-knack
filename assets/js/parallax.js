import anime          from 'animejs'
import util           from './util'
import {scalePow}  from 'd3-scale'
import {randomNormal} from 'd3-random'


const EASINGS = ['linear', 'easeInOutCubic', 'easeInOutSine']

function _scroll(ƒs) { 
  _.each(ƒs, ƒ => ƒ(window.scrollY))
 }



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

function _offsetFn(ʀζ) {
  return (item) => {
    let δ   = 100,
        μ   = (item.clientHeight + window.innerHeight),
        ϕζ  = ʀζ(),
        σ   = scalePow()
                // .domain( [-0.38 * β.height, 0.618 * μ, μ + β.height])
                .domain( [1.2 * μ, 0.38 * μ, -0.2 * μ])
                .rangeRound( [ϕζ, 0, -ϕζ]),
        ζ   = item.querySelector('.content')
    // σ.clamp(true)
    return offset => ζ.style.transform = `translateY(${σ(item.offsetTop + item.clientHeight - offset)}px)`}}

function init(items) {
  return new Promise( resolve => {
    let ʀζ      = randomNormal(window.innerHeight * .16, 0.62),
        ƒs      = _.map(items, _offsetFn(ʀζ)),
        offset  = 0,
        changed = false
    
    util.addEvent(window, 'scroll', () => {
      changed = true
      offset = window.scrollY})
    
    util.startAnimation(15, () => {
      if(!changed) return
      changed = false
      _.each(ƒs, ƒ => ƒ(offset))
    })

    _.defer(() => {
      _.each(ƒs, ƒ => ƒ(offset))
      resolve() }) }) }


export default {init}