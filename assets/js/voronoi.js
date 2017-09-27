import {select} from 'd3-selection'
// let d3s = require('d3-selection')
let d3ν = require('d3-voronoi')

let numPoints
let ςolor       = '#4a4a4a'
let ςolors      = ['#feeefb', '#fffdf2', '#d8eeed']
  
function _makePoints(dimensions) {
  return  _(numPoints)
            .range()
            .map(() => [_.random(dimensions.x), _.random(dimensions.y)])
            .value() }

function _makeShadows(defs) {
  console.log('defs', defs)

  

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

              ƒ.append('feGaussianBlur').attr('stdDeviation', _.random(4, 32))

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

function _redrawPolygon(polygon) { polygon.attr('d', d => d ? 'M' + d.join('L') + 'Z' : null) }



function init(id) {
  
  numPoints  = _.random(16, 32)

  let svg         = select(`#${id}`),
      dimensions  = { x: svg.node().clientWidth, y: svg.node().clientHeight },
      // χ           = console.log('dimensions', dimensions),
      shadows     = _makeShadows(svg.select('defs')),
      voronoi     = d3ν.voronoi()
                      .extent([[-1, -1], [dimensions.x + 1, dimensions.y + 1]]),
      points      = _makePoints(dimensions),
      polygon     = svg.append('g')
                      .attr('class', 'polygons')
                      .selectAll('path')
                      .data(voronoi.polygons(points))
                      .enter()
                      .append('path')
                      .attr('filter', (δ, ι) => `url(#f-${ι})`)
                      .style('fill', (δ, ι) => _.sample(ςolors))
                      .call(_redrawPolygon)
}

export default { init: init }