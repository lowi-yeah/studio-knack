import {randomNormal} from 'd3-random'
import util           from './util'
import anime          from 'animejs'

function _resize(overlay){
  let w = window.innerWidth,
      h = window.innerHeight,
      v = `0 0 ${w} ${h}`
  overlay.setAttribute('viewBox', v)
}

let isSet       = false,
    prevPoints  = _origin(),
    points      = _origin(),
    scrollOffset

function _scroll() {
  if(isSet){
    let δ = window.scrollY - scrollOffset
    scrollOffset = window.scrollY
    _(points).each(p => p[1] = p[1] - δ)
    document.getElementById('overlay-poly')
      .setAttribute('points', _pointString(points))
  }
}

const ȣ = randomNormal(64, 0.62)

function _makePoints(element) {
  let ε  = util.extent(element),
      p0 = [ε.x0 - ȣ(), ε.y0 - ȣ()],
      p1 = [ε.x1 + ȣ(), ε.y0 - ȣ()],
      p2 = [ε.x1 + ȣ(), ε.y1 + ȣ()],
      p3 = [ε.x0 - ȣ(), ε.y1 + ȣ()]
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
    // points: { value: _pointz() },
    easing: 'easeOutQuad',
    duration: _.random(240, 420)
  })
}

function init() {
  console.log('init overlay')
  let overlay = document.getElementById('the-overlay')
  _resize(overlay)
  util.addEvent(window, 'scroll', _scroll)
}

function remove() {
  prevPoints = _.cloneDeep(points)
  points = _origin()
  document.getElementById('overlay-text').textContent = ''
  isSet = false
  _animate()
}

function set(element, text) {
  console.log('overlay.set', text)
  prevPoints = _.cloneDeep(points)
  points = _makePoints(element)
  scrollOffset = window.scrollY
  document.getElementById('overlay-text').textContent = text
  isSet = true
  _animate()
}

export default { init, set, remove }