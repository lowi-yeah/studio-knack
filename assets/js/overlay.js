import {randomNormal} from 'd3-random'
import util           from './util'
import anime          from 'animejs'


let isSet       = false,
    prevPoints  = _origin(),
    points      = _origin(),
    textX, textY,
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
    document.getElementById('overlay-title').setAttribute('y', textY)
    document.getElementById('overlay-title-shadow').setAttribute('y', textY)
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
  console.log('_pointz()', ρ)
  return ρ
}

function _animate() {
  anime({
    targets: '#overlay-poly',
    points: _pointz(),
    // points: { value: _pointz() },
    easing: 'easeOutQuad',
    duration: _.random(240, 420)
  })
}

function init() {
  util.addEvent(window, 'scroll', _scroll)
  document.getElementById('overlay-poly').setAttribute('points', _pointString(_origin))
}

function remove() {
  prevPoints = _.cloneDeep(points)
  points = _origin()
  document.getElementById('overlay-title').textContent = ''
  document.getElementById('overlay-title-shadow').textContent = ''
  isSet = false
  _animate()
}

const ʆ = randomNormal(-64, 1)
function set(item) {
  console.log('set overlay', item)

  let title     = document.getElementById('overlay-title'),
      shadow    = document.getElementById('overlay-title-shadow'),
      content   = item.querySelector('.content')
      
  prevPoints = _.cloneDeep(points)
  points = _makePoints(content)
  scrollOffset = window.scrollY

  title.textContent = item.getAttribute('data-caption')
  shadow.textContent = item.getAttribute('data-caption')

  _.defer(() => {
    let βc        = util.boundingBox(content),
        easing    = _.sample(EASINGS),
        duration  = _.random(240, 420)
        
    textX = βc.x + 24 + ʆ()
    textY = βc.y + βc.height - 64

    if(Math.random() < 0.5) {
      title.setAttribute('x',  textX - window.innerWidth)
      shadow.setAttribute('x', textX - window.innerWidth)
    }
    else {
      title.setAttribute('x',  window.innerWidth - textX)
      shadow.setAttribute('x', window.innerWidth - textX)
    }

    title.setAttribute('y', textY)
    shadow.setAttribute('y', textY)

    anime({ targets: title,
            x: textX,
            easing: easing,
            duration: duration
          })

    anime({ targets: shadow,
            x: textX,
            easing: easing,
            duration: duration
          })
  })

  isSet = true
  _animate()
}

export default { init, set, remove }