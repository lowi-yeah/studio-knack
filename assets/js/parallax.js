import anime          from 'animejs'
import util           from './util'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'


const EASINGS = ['linear', 'easeInOutCubic', 'easeInOutSine']

function _scroll(ƒs) { _.each(ƒs, ƒ => ƒ(window.scrollY)) }

function init(items) {
  let ʀζ   = randomNormal(window.innerHeight * .38, 0.75),
      ʀτ   = randomNormal(64, 0.75),
      ƒs  = _.map(items, item => {let δ   = 100,
                                      μ   = (item.clientHeight + window.innerHeight),
                                      σ   = scaleLinear()
                                              .domain( [-0.38 * item.clientHeight, 0.618 * μ, μ + item.clientHeight])
                                              .range( [0, 0.5 * δ, δ]),
                                      ζ   = item.querySelector('.content'),
                                      τ   = item.querySelector('.text-frame'),
                                      ϕζ  = ʀζ(),
                                      ϕτ  = ʀτ(),

                                      αζ  = anime({ targets:    ζ,
                                                    translateY: [ϕζ, -ϕζ],
                                                    duration:   δ,
                                                    easing:     _.sample(EASINGS),
                                                    // easing:     'linear',
                                                    autoplay:   false}),
                                      ατ  = anime({ targets:    τ,
                                                    translateY: [ϕτ, -ϕτ],
                                                    duration:   δ,
                                                    easing:     _.sample(EASINGS),
                                                    // easing:     'linear',
                                                    autoplay:   false})
                                  
                                  σ.clamp(true)
                                  return offset => {
                                    let y0    = (item.offsetTop + item.δy),
                                        y1    = y0 + item.clientHeight,
                                        // < 0 when the item's top edge has crossed the window's bottom edge
                                        δin   = (offset + window.innerHeight) - y0  
                                    αζ.seek(σ(δin))
                                    // ατ.seek(σ(δin)) 
                                  }})

  util.addEvent(window, 'scroll', () => _scroll(ƒs))
  _.defer(() => _scroll(ƒs))
  
}


export default {init}