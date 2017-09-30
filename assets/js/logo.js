import anime from 'animejs'

let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let knackBase, knackText, knackΣhadow, knackGradients, animation

function _gradients() {
  let gradients = document.querySelectorAll('.text-gradient')

  gradients.forEach( g => {
    let α = Math.round(Math.random() * 180),
        ω = α + 360 + Math.round(Math.random() * 360),
        δ = 24000 + Math.round(Math.random() * 24000)
    g.setAttribute('gradientTransform', `rotate(${α})`)
    anime({ targets:            g, 
            direction:          'alternate',
            gradientTransform:  `rotate(${ω})`, 
            duration:           δ,
            loop:               true,
            easing:             'linear' })})}

function _getRatio() {
  let ww = window.innerWidth,
      kw = knackBase.getBoundingClientRect().width
  return ww/kw }

function _clip() {
  let rect   = document.querySelector('#knack-text > rect'),
      ratio  = _getRatio(),
      offset = Math.random() < 0.5 ? window.innerWidth/ratio : -window.innerWidth/ratio
  rect.setAttribute('transform', `translate(${offset})`)
}

function resize() {
  let ww = window.innerWidth,
      wh = window.innerHeight,
      kw = knackBase.getBoundingClientRect().width,
      kh = knackBase.getBoundingClientRect().height,
      r  = _getRatio(),
      ς  = r * 0.81,
      σx = ww * .095 / r,
      σy = ((wh - (kh * r)) / 2) / r

  knackText.style.transform   = `scale(${ς}) translate(${σx}px, ${σy}px)` 
  knackΣhadow.style.transform = `scale(${ς}) translate(${σx}px, ${σy}px)` 
  knackGradients.forEach(knack => knack.style.transform = `scale(${ς}) translate(${σx}px, ${σy}px)` )

  document.querySelector('#knack-text > rect').setAttribute('width',  `${ww/r}`)
  document.querySelector('#knack-text > rect').setAttribute('height', `${wh/r}`)

  document.querySelectorAll('g.knack > rect')
    .forEach(knack => {
      knack.setAttribute('width',   `${100/r}%`)
      knack.setAttribute('height',  `${wh/r}px`)
    } ) }

function init() {
  knackBase       = document.querySelector('#knack-base')
  knackText       = document.querySelector('#knack-text')
  knackΣhadow     = document.querySelector('#knack-shadow')
  knackGradients  = document.querySelectorAll('g.knack')
  _gradients()
  _clip()
  setTimeout(resize, 0) 
}

function _cleanup() {
  knackBase.remove()
  knackΣhadow.remove()
  _.each(knackGradients, g => g.remove())

  knackText.remove()
}

function begin() {
  return new Promise( (resolve, reject) => {
    knackBase       = document.querySelector('#knack-base')
    knackText       = document.querySelector('#knack-text')
    knackΣhadow     = document.querySelector('#knack-shadow')
    knackGradients  = document.querySelectorAll('g.knack')
  
    let ratio           = _getRatio(),
        rect            = document.querySelector('#knack-text > rect'),
        animationParams = { targets:    rect,
                            transform: `translate(${0})`,
                            // duration:   800 + Math.random() * 1200,
                            // delay:      800,
                            duration:   200,
                            delay:      200,
                            easing:     EASINGS[Math.floor(Math.random() * EASINGS.length)],
                            complete:   () => { _cleanup()
                                                resolve() }
                          }
    anime(animationParams) 
  })
}

export default {init, begin}