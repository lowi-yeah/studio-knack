import anime          from 'animejs'
import util           from './util'
import {scalePow}     from 'd3-scale'
import {randomNormal} from 'd3-random'
import isMobile       from 'ismobilejs'


function _offsetFn() {
  let ʀ = randomNormal(0, window.innerHeight/6)
        
  return (φ) => {
    let μ   = (φ.item.clientHeight + window.innerHeight),
        f   = φ.frame,
        ϕ  = Math.round(Math.abs(ʀ())),
        σ  = scalePow()
                .domain( [1.1 * μ, 0.38 * μ, -0.1 * μ])
                .rangeRound( [ϕ, 0, -ϕ])

    return offset => 
      f.style.transform = `translateY(${σ(φ.item.offsetTop + φ.item.clientHeight - offset)}px)`
    }}

function init(Φ) {

  // do not use parallax on mobile devices
  // if(isMobile.any) return
  // YES! DO IT!
  let ƒs      = _.map(Φ, _offsetFn()),
      offset  = 0,
      changed = false
  
  util.addEvent(document.body, 'scroll', () => {
    changed = true
    offset  = document.body.scrollTop })
  
  util.startAnimation(24, () => {
    if(!changed) return
    changed = false
    _.each(ƒs, ƒ => ƒ(offset)) })
  return Φ }


export default {init}