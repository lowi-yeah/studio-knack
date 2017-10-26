import anime    from 'animejs'
import pattern  from './pattern'


const EASINGS = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

function _set(ε, τ) {
  let s = `translateX(${τ.x}) translateY(${τ.y}) scale(${τ.σ})`
  ε.style.transform        = s
  ε.style.webkitTransform  = s
  if(ε.getAttribute('data-pattern')) pattern.update(ε, τ)
}

function transform(ε, τ, α) {
  τ = _.defaults(τ, {x: 0, y: 0, σ: 1})
  if(!α) _set(ε, τ)
  else {
    let options = { targets:    ε,
                    translateX: τ.x,
                    translateY: τ.y,
                    scale:      τ.σ,
                    complete:   α.complete}

    if(α.easing) {
      if(α.easing === 'random') α.easing = _.sample(EASINGS)
      options.easing = α.easing }

    if(α.duration) options.duration = α.duration

    if(ε.getAttribute('data-pattern')) {
      options.update = function(animation) {
        let transforms = _.map(animation.animations, a => `${a.property}(${a.currentValue})`)
        pattern.update(ε, transforms.join(' ')) }}
    anime(options)}}

function getScale(ε) {
  let s = ε.style.transform,
      σ = s.match(/scale\(\d(\.\d*)?\)/)
  if(σ) {
    σ = σ[0]
    σ = σ.replace(/scale\(/, '')
    σ = σ.replace(/\)/, '')
    σ = parseFloat(σ)
    return σ }
  else return 1 }

function getElement(ε) {
  if(_.isString(ε)) return document.querySelector(ε)
  else return ε
}

export default { transform, getScale, getElement }