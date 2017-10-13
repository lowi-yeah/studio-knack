import {randomNormal} from 'd3-random'
import util           from './util'
import anime          from 'animejs'


let isSet       = false,
    prevPoints  = _origin(),
    points      = _origin(),
    textX, textY,
    buttonX, buttonY,
    hitX, hitY, 
    hitScale = 1,
    scrollOffset

const EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

function _scroll() {
  if(isSet){
    let δ = window.scrollY - scrollOffset
    scrollOffset = window.scrollY

    // points
    _(points).each(p => p[1] = p[1] - δ)
    document.getElementById('overlay-poly').setAttribute('points', _pointString(points))

    // text
    textY -= (1.24 * δ)
    buttonY -= (1.24 * δ)
    hitY -= (1.24 * δ)
    document.getElementById('overlay-title').setAttribute('y', textY)
    document.getElementById('overlay-title-shadow').setAttribute('y', textY)

    
    document.getElementById('overlay-button').style.transform = 
      `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
    document.getElementById('overlay-button-shadow').style.transform = 
      `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
    document.getElementById('overlay-hit-area').style.transform = 
      `translateX(${hitX}px) translateY(${hitY}px)`
  }
}

const ȣ = randomNormal(64, 0.62)

function _makePoints(element) {
  let ε  = util.extent(element),
      p0 = [Math.round(ε.x0 - ȣ()), Math.round(ε.y0 - ȣ())],
      p1 = [Math.round(ε.x1 + ȣ()), Math.round(ε.y0 - ȣ())],
      p2 = [Math.round(ε.x1 + ȣ()), Math.round(ε.y1 + ȣ())],
      p3 = [Math.round(ε.x0 - ȣ()), Math.round(ε.y1 + ȣ())]
  return [p0, p1, p2, p3] }

function _origin() {
  let p0 = [-2, -2],
      p1 = [-2, -1],
      p2 = [-1, -1],
      p3 = [-2, -1]
  return [p0, p1, p2, p3] }

function _pointString(pointz) {
  return _(pointz)
            .map(p => `${Math.round(p[0])},${Math.round(p[1])}`)
            .join(' ')
}

function _interpolate(index) {
  let ps = _.slice(prevPoints, index + 1, 4),
      s  = _.slice(points, 0, index + 1),
      ρ  = _.concat(s, ps)
  return _pointString(ρ)
}

function _pointz() {
  let ρ = _(4).range()
              .map( i => { return { value: _interpolate(i) } })
              .value()
  return ρ
}

function _animate() {
  anime({
    targets: '#overlay-poly',
    points: _pointz(),
    easing: 'easeOutQuad',
    duration: _.random(240, 420)
  })
}

function init() {
  util.addEvent(window, 'scroll', _scroll)
  document.getElementById('overlay-button-use').style.opacity = 0
  document.getElementById('overlay-button-shadow').setAttribute('opacity', 0)
  document.getElementById('overlay-poly').setAttribute('points', _pointString(_origin))

  // setup click handler
  let hit = document.getElementById('overlay-hit-area')
  util.addEvent(hit, 'mouseenter', () => {
    hitScale = 1.2
    document.getElementById('overlay-button').style.transform = 
      `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
    document.getElementById('overlay-button-shadow').style.transform = 
      `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
  })

  util.addEvent(hit, 'mouseleave', () => {
    hitScale = 1
    document.getElementById('overlay-button').style.transform = 
      `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
    document.getElementById('overlay-button-shadow').style.transform = 
      `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
  })
}

function remove() {
  prevPoints = _.cloneDeep(points)
  points = _origin()
  document.getElementById('overlay-title').textContent = ''
  document.getElementById('overlay-title-shadow').textContent = ''
  document.getElementById('overlay-button-use').style.opacity = 0
  document.getElementById('overlay-button-shadow').setAttribute('opacity', 0)
  isSet = false
  _animate()
}

const ʆ = randomNormal(-64, 1)
function set(item) {
  let title         = document.getElementById('overlay-title'),
      shadow        = document.getElementById('overlay-title-shadow'),
      button        = document.getElementById('overlay-button'),
      buttonShadow  = document.getElementById('overlay-button-shadow'),
      hitArea       = document.getElementById('overlay-hit-area'),
      content       = item.querySelector('.content')
      
  // set the bg points
  prevPoints = _.cloneDeep(points)
  points = _makePoints(content)
  scrollOffset = window.scrollY

  // update the caption
  title.textContent = item.getAttribute('data-caption')
  shadow.textContent = item.getAttribute('data-caption')

  let βc        = util.boundingBox(content),
      easing    = _.sample(EASINGS),
      duration  = _.random(240, 420)
      
  textX = Math.round(βc.x + 24 )
  textY = Math.round(βc.y + βc.height - 100)

  buttonX = βc.x + 24
  buttonY = βc.y + βc.height - 80

  hitX = βc.x + 8
  hitY = βc.y + βc.height - 92

  // position the caption
  title.setAttribute('x', textX)
  title.setAttribute('y', textY)
  shadow.setAttribute('x', textX)
  shadow.setAttribute('y', textY)

  button.style.transform        = `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
  buttonShadow.style.transform  = `translateX(${buttonX}px) translateY(${buttonY}px) scale(${hitScale})`
  hitArea.style.transform       = `translateX(${hitX}px) translateY(${hitY}px)`

  document.getElementById('overlay-button-use').style.opacity = 1
  buttonShadow.setAttribute('opacity', 0.38)

  isSet = true
  _animate()
}

export default { init, set, remove }