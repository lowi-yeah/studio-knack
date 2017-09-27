import {select, selectAll} from 'd3-selection'
import anime from 'animejs'
let d3ν = require('d3-voronoi')


let ςolor   = '#4a4a4a',
    ςolors  = ['#ffffff', '#ffffff', '#feeefb', '#fffdf2', '#d8eeed']

let numPoints, svg, voronoi, points, polygon, animation
  
function _makeAnimation() {
  let φ     = svg.selectAll('path.cell')
  console.log('φ', φ.nodes())
  animation = anime.timeline({autoplay: false})
  _(φ.nodes())
    .reverse()
    .each(d => animation.add({targets:  d, 
                              scale:    [0, 1], 
                              duration: _.random(12, 42)}))
}

function _makePoints(dimensions) {
  return  _(numPoints)
            .range()
            .map(() => [_.random(dimensions.x), _.random(dimensions.y)])
            .value() }

function _makeShadowz(defs) {
  return  _(numPoints)
            .range()
            .map( ι => {
              let ƒ = defs.append('filter')
                        .attr('id',     `f-${ι}`)
                        .attr('x',      '-50%')
                        .attr('y',      '-50%')
                        .attr('width',  '200%')
                        .attr('height', '200%')
              
              ƒ.append('feFlood').attr('fill-color', ςolor)

              ƒ.append('feComposite')
                .attr('in2', 'SourceAlpha')
                .attr('operator', 'out')

              ƒ.append('feGaussianBlur')
                .attr('stdDeviation', 4 + (ι * 0.62))

              ƒ.append('feOffset')
                .attr('dx', '0')
                .attr('dy', '0')
                .attr('result', 'offsetblur')

              ƒ.append('feFlood')
                .attr('flood-color', ςolor)
                .attr('result', 'color')

              ƒ.append('feComposite')
                .attr('in2', 'offsetblur')
                .attr('operator', 'in')

              ƒ.append('feComposite')
                .attr('in2', 'SourceAlpha')
                .attr('operator', 'in')

              let μ = ƒ.append('feMerge')

              μ.append('feMergeNode').attr('in', 'SourceGraphic')
              μ.append('feMergeNode')
              return ƒ })
            .value() }

// <feGaussianBlur in="alpha-channel-of-feDropShadow-in"
//     stdDeviation="stdDeviation-of-feDropShadow"/>
// <feOffset dx="dx-of-feDropShadow" dy="dy-of-feDropShadow"
//     result="offsetblur"/>
// <feFlood flood-color="flood-color-of-feDropShadow"
//     flood-opacity="flood-opacity-of-feDropShadow"/>
// <feComposite in2="offsetblur" operator="in"/>
// <feMerge>
//   <feMergeNode/>
//   <feMergeNode in="in-of-feDropShadow"/>
// </feMerge>
function _makeShadows(defs) {
  return  _(numPoints)
            .range()
            .map( ι => {
              let ƒ = defs.append('filter')
                        .attr('id',     `f-${ι}`)
                        .attr('x',      '-50%')
                        .attr('y',      '-50%')
                        .attr('width',  '200%')
                        .attr('height', '200%')
              
              ƒ.append('feGaussianBlur')
                .attr('stdDeviation', 4 + (ι * 0.62))

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

function show() {
  if(animation.currentTime === animation.duration) return
  animation.reversed = false
  animation.play()
}

function hide() {
  if(animation.currentTime === 0) return
  animation.reversed = true
  animation.play()
}

function init(id) {
  numPoints = _.random(12, 24)
  svg       = select(`#${id}`)
  voronoi   = d3ν.voronoi().extent([[-1, -1], [_dimensions().x + 1, _dimensions().y + 1]])
  points    = _makePoints(_dimensions())
  polygon   = svg.append('g')
                .attr('class', 'polygons')
                .selectAll('path')
                .data(voronoi.polygons(points))

  polygon.enter()
    .append('path')
      .attr('class', 'cell')
      .style('transform-origin', δ => `${δ.data[0]}px ${δ.data[1]}px`)
      .attr('centroid', δ => JSON.stringify())
      .style('fill', (δ, ι) => _.sample(ςolors))
      .style('filter', (δ, ι) => `url(#f-${ι})`)
      .call(_redrawPolygon)
  _makeShadows(svg.append('defs'))
  _makeAnimation()
}


export default  { init: init,
                  show: show,
                  hide: hide }