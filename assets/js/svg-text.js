import {select} from 'd3-selection'
import util from './util'

let GLYPHS_ROOT = document.getElementById('glyphs'),
    NORMAL      = 1000

function _glyphMetrics(cut) {
  return _.reduce(cut.attributes, (ρ, α) => {
            ρ[α.name] = _.isNaN(parseFloat(α.value)) ? α.value : parseFloat(α.value)
            return ρ }, {})}

function _randomGlyph(char) {
  // char = char.toUpperCase()
  // char = char.toLowerCase()
  let ς = `#glyph-${char.charCodeAt(0)}`,
      ζ = GLYPHS_ROOT.querySelector(ς),
      η = _(ζ.childNodes)
            .filter(n => n.nodeType === 1)
            .sample(),
      μ = _glyphMetrics(η)
  return {g: η.cloneNode(true), μ: μ}}

function _transformGlyph(ε, {offset, scale}) {
  offset  = offset || {x: 0, y: 0}
  scale   = scale || 1
  ε.setAttribute('transform', `matrix(${scale} 0 0 ${scale} ${offset.x} ${offset.y})`)}

function _permuteLines(words, numlines) {
  if(numlines === 1) return [[words.join(' ')]]
  else if(numlines === words.length) return [words]
  else {
    let combinationCount =  1 + words.length - numlines,
        combinations  = _(combinationCount)
                          .range()
                          .map(combinationIndex => {
                            let head = _.slice(words, 0, combinationIndex+1).join(' '),
                                tail = _.slice(words, combinationIndex+1),
                                factorial = _permuteLines(tail, numlines-1)
                            return _.map(factorial, f => _.concat([head], f))}).value()
                      return _.flatten(combinations)}}

function _splitInto(numlines, words) {
  if(numlines > words.length) return _splitInto(words.length, words)
  if(numlines === 1) return words
  if(numlines === words.length) return words

  let combinations  =  1 + words.length - numlines,
      permutations  = _permuteLines(words, numlines),
      choice        = _(permutations)
                        .map((permutation) => {
                          let byLength  = _.sortBy(permutation, p => p.length),
                              min       = _.first(byLength).length,
                              max       = _.last(byLength).length,
                              δ         = max - min
                          return {permutation, δ, min, max} })
                        .sortBy(({δ}) => δ)
                        .first()

  // check how long shortest the line is, 
  // if too long, add a line
  if(choice.min > 24) return _splitInto(numlines+1, words)
  return choice.permutation }

function _makeLines(width, height, text) {
  let numlines  = 2,
      words     = text.split(/\s/),
      ratio     = width / height
  if(words.length === 0)  return []
  if(words.length === 1)  return words
  if(ratio >= 2)          return [words.join(' ')]
  if(text.length < 24)    return [words.join(' ')]
  else return _splitInto(2, words)}

function _transform(ε, {offset, scale}) {
  offset = offset || {x: 0, y: 0}
  ε.setAttribute('transform', `matrix(${scale} 0 0 ${scale} ${offset.x} ${offset.y})`) }

function _layoutLine(line, index, glyphs) {
  return  _.reduce(line, (σ, char) => {
              let γ       = _.find(glyphs, glyph => _.isEqual(glyph.μ.char.toString(), char)),
                  scale   = 1,
                  offset  = { x: σ.x, y: 0.72 * NORMAL * index }
              _transform(γ.g, {offset, scale})
              σ.glyphs.push(γ.g.cloneNode(true))
              σ.x += γ.μ.width * scale
              return σ }, {x: 0, y: NORMAL, glyphs: []})}

function _layout(svg, g, text, glyphs) {
  let ωw          = window.innerWidth,
      ωh          = window.innerHeight,
      lines       = _makeLines(ωw, ωh, text),
      glyphlines  = _.map(lines, (line, index) => 
                      _layoutLine(line, (lines.length - index - 1), glyphs)),
      maxW        = _(glyphlines).map(gl => gl.x).max(),
      scale       = ωw/maxW * 0.92

  // add each of the glyph's lines to the dom (the glyph-group)
  _.each(glyphlines, line => 
    _.each(line.glyphs, glyph => g._groups[0][0].appendChild(glyph)))

  // find the largest top-offset of the last glyphline
  let maxTop = _(_.last(glyphlines).glyphs)
                .map(g => {
                  let height  = parseFloat(g.getAttribute('height')),
                      top     = parseFloat(g.getAttribute('top'))
                  if(!_.isFinite(top)) top = 0
                  return top})
                .sortBy(v => v) 
                .last()

  // adjust the glyph-group scale and offset
  _transform(g.node(), {scale, offset: {x: 0, y: maxTop*scale}})

  // defer to let the dom elements settle in
  // then adjust the svg frame dimensions
  _.defer(() => {
    let height = (g.node().getBBox().height + maxTop)  * scale
    svg.attr('viewBox', `0 0 ${ωw} ${height}`)
    svg.attr('width', `${ωw}`)
    svg.attr('height', `${height}`)})}

function _makeSvg(parent) {
  let svg = select(parent)
              .append('svg:svg')
                .attr('version',  '1.1')
                .attr('xmlns',    'http://www.w3.org/2000/svg')
                .attr('width',    '100%')
                .attr('height',   '100%')
                .attr( 'transform',  'matrix(1 0 0 -1 0 0)' ),
      g = svg.append('svg:g')
            .attr('class', 'glyph-group')
  return {svg, g} }

function init(text, parent) {
  let glyphs    = _.map(text, _randomGlyph),
      {svg, g}  = _makeSvg(parent)
  _layout(svg, g, text, glyphs)
  util.addEvent(window, 'resize', _.debounce(() => _layout(svg, g, text, glyphs), 150))
  return svg.node() }

export default { init: init}