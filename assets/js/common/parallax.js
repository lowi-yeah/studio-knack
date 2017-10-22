import anime          from 'animejs'
import util           from './util'
import {scalePow}     from 'd3-scale'
import {randomNormal} from 'd3-random'
import isMobile       from 'ismobilejs'


function _offsetFn() {
  let ʀc = randomNormal(window.innerHeight * .32, 1),
      ʀt = randomNormal(window.innerHeight * .24, 1)
        
  return (item) => {
    let δ   = 100,
        μ   = (item.clientHeight + window.innerHeight),

        c   = item.querySelector('.content'),
        ϕc  = ʀc(),
        σc  = scalePow()
                // .domain( [-0.38 * β.height, 0.618 * μ, μ + β.height])
                .domain( [1.2 * μ, 0.38 * μ, -0.2 * μ])
                .rangeRound( [ϕc, 0, -ϕc]),

        t   = item.querySelector('.text'),
        ϕt  = ʀt(),
        σt  = scalePow()
                // .domain( [-0.38 * β.height, 0.618 * μ, μ + β.height])
                .domain( [1.2 * μ, 0.38 * μ, -0.2 * μ])
                .rangeRound( [ϕt, 0, -ϕt])
        

    return offset => {
      c.style.transform = `translateY(${σc(item.offsetTop + item.clientHeight - offset)}px)`
      t.style.transform = `translateY(${σt(item.offsetTop + item.clientHeight - offset)}px)`
    }}}

function init(items) {

  // do not use parallax on mobile devices
  if(isMobile.any) return

  let ƒs      = _.map(items, _offsetFn()),
      offset  = 0,
      changed = false
  
  util.addEvent(window, 'scroll', () => {
    changed = true
    offset  = window.scrollY })
  
  util.startAnimation(24, () => {
    if(!changed) return
    changed = false
    _.each(ƒs, ƒ => ƒ(offset)) })}


export default {init}