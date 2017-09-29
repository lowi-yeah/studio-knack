import {select, selectAll} from 'd3-selection'
import anime from 'animejs'
let d3ν = require('d3-voronoi')

let ςolor   = '#4a4a4a',
    ςolors  = ['#ffffff', '#ffffff', '#feeefb', '#fffdf2', '#d8eeed']

let id = 's-voronoi',
    numPoints, svg, defs, g, voronoi, points, dataJoin, polygon, animation, ζAnimation
  
function _makeAnimation() {
  let φ     = svg.selectAll('path.cell')
  animation = anime.timeline({autoplay: false})
  _(φ.nodes())
    .reverse()
    .each(d => animation.add({targets:  d, 
                              scale:    [0, 1], 
                              duration: _.random(12, 42)
                            }))
}

function _makeShadowAnimation() {
  let φ       = svg.selectAll('filter.shadow > feGaussianBlur')
  ζAnimation  = anime.timeline({autoplay: false})
  _(φ.nodes())
    .reverse()
    .each(d => {
      let δ = d.getAttribute('data-deviation')
      ζAnimation.add({targets:  d, 
                      stdDeviation:    [0, 12], 
                      opacity: [0, 1],
                      duration: 240
                    })})
}

function _makePoints(dimensions) {
  return  _(numPoints)
            .range()
            .map(() => [_.random(dimensions.x), _.random(dimensions.y)])
            .value() }

function _makeShadows() {
  return  _(numPoints)
            .range()
            .map( ι => {
              let ƒ = defs.append('filter')
                        .attr('id',     `f-${ι}`)
                        .attr('x',      '-50%')
                        .attr('y',      '-50%')
                        .attr('width',  '200%')
                        .attr('height', '200%')
                        .attr('class',  'shadow')
              
              ƒ.append('feGaussianBlur')
                .attr('data-deviation', 4 + (ι * 0.62))
                .attr('stdDeviation', 0)

              ƒ.append('feOffset')
                .attr('dx', '0')
                .attr('dy', '0')
                .attr('result', 'offsetblur')

              ƒ.append('feFlood')
                .attr('flood-color', ςolor)
                .attr('flood-opacity', 1)

              ƒ.append('feComposite')
                .attr('in2', 'offsetblur')
                .attr('operator', 'in')

              let μ = ƒ.append('feMerge')
              μ.append('feMergeNode')
              μ.append('feMergeNode').attr('in', 'SourceGraphic')
              return ƒ })
            .value() }

function _redrawPolygon(polygon) { polygon.attr('d', d => d ? 'M' + d.join('L') + 'Z' : null) }

function _dimensions() { return { x: svg.node().clientWidth, y: svg.node().clientHeight } }

function _enableShadows() {
  // polygon.style('filter', (δ, ι) => `url(#f-${ι})`)
  ζAnimation.play()
}

function _disableShadows() {
  polygon.style('filter', null) }

function _colorize() {
  polygon.each(function(δ, ι) {
    let c = _.sample(ςolors)
    select(this).style('fill', c)
    select(this).style('stroke', c)})}

function _decolorize() {
  polygon.each(function(δ, ι) {
    select(this).style('fill', '#ffffff')
    select(this).style('stroke', '#ffffff') })}

function show() {
  if(animation.currentTime === animation.duration) return
  animation.reversed = false
  animation.play() }

function hide() {
  if(animation.currentTime === 0) return
  animation.reversed = true
  animation.play() }

function init() {
  numPoints = _.random(12, 24)
  svg       = select(`#${id}`)
  g         = select(`#${id} > .cells`)
  defs      = svg.append('defs')
  voronoi   = d3ν.voronoi().extent([[-1, -1], [_dimensions().x + 1, _dimensions().y + 1]])
  points    = _makePoints(_dimensions())

  dataJoin  = g.selectAll('path')
                .data(voronoi.polygons(points))

  polygon   = dataJoin
                .enter()
                .append('path')
                .attr('class', 'cell')
                .style('transform-origin', δ => `${δ.data[0]}px ${δ.data[1]}px`)
                .style('filter', (δ, ι) => `url(#f-${ι})`)
                // .style('fill', (δ, ι) => _.sample(ςolors))
  
  polygon
    .merge(dataJoin)
    .call(_redrawPolygon)

  _makeShadows()
  _makeShadowAnimation()
  _makeAnimation() 

  // _enableShadows()
  // _colorize()
  _decolorize()
  animation.seek(animation.duration)
  // animation.play()

  _.delay(_enableShadows, 2000)
  // _.delay(, 1000)
}


export default  { init: init,
                  show: show,
                  hide: hide }