import anime          from 'animejs'
import util           from './util'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'


const EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

function _scroll(ƒs) { _.each(ƒs, ƒ => ƒ(window.scrollY)) }

function init(items) {
  let ʀ   = randomNormal(window.innerHeight * .38, 0.75),
      ƒs  = _.map(items, item => {let δ = 100,
                                      μ = (item.clientHeight + window.innerHeight),
                                      σ = scaleLinear()
                                            .domain( [0, 0.81 * μ, 1.2 * μ])
                                            .range( [0, 0.5 * δ, δ]),
                                      ι = item.querySelector('.content'),
                                      ϕ = ʀ(),
                                      α = anime({ targets:    ι,
                                                  translateY: [ϕ, -ϕ],
                                                  duration:   δ,
                                                  // easing:     _.sample(EASINGS),
                                                  easing:     'linear',
                                                  autoplay:   false})
                                  
                                  σ.clamp(true)
                                  return offset => {
                                    let y0    = (item.offsetTop + item.δy),
                                        y1    = y0 + item.clientHeight,
                                        // < 0 when the item's top edge has crossed the window's bottom edge
                                        δin   = (offset + window.innerHeight) - y0  
                                    α.seek(σ(δin)) }})

  util.addEvent(window, 'scroll', () => _scroll(ƒs))
  _.defer(() => _scroll(ƒs))
  
}


export default {init}