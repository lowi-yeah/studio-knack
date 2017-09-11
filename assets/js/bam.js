import filters from './bam-filters'

let HERO_ROOT   = 'hero',
    GLYPHS_ROOT = 'glyphs',
    SVG_ROOT    = 'bam',
    G           = '.glyphs',
    NORMAL      = 1000,
    hero, glyphsRoot, svg, g,
    text, lines, glyphlines

function _addEvent(object, type, callback) {
  if (object == null || typeof(object) == 'undefined') return
  if (object.addEventListener) object.addEventListener(type, callback, false)
  else if (object.attachEvent) object.attachEvent('on' + type, callback)
  else object['on'+type] = callback }

function _start(fps, fn) {
  let fpsInterval   = 1000 / fps, 
      then          = Date.now() + 2000,
      startTime     = then, now, elapsed,
      animate     = () => {
                      requestAnimationFrame(animate)
                      now = Date.now()
                      elapsed = now - then
                      if (elapsed > fpsInterval) {
                        then = now - (elapsed % fpsInterval)
                        fn() }}
  animate() }

function _glyphMetrics(cut) {
  return _.reduce(cut.attributes, (ρ, α) => {
              ρ[α.name] = _.isNaN(parseFloat(α.value)) ? α.value : parseFloat(α.value)
              return ρ }, {})}

function _getGlyphCuts(char) {
  let nodes = _(glyphsRoot.childNodes)
                .find(ε => ε.id === ('glyph-' + char)) 
                .childNodes
  return  _(nodes)
            .filter(ι => ι.nodeType === 1)
            .map(g => {return {g: g.cloneNode(true), μ: _glyphMetrics(g)}})
            .value() }

function _getGlyph(char, selector) {
  let cuts    = _getGlyphCuts(char),
      cut     = _.find(cuts, ({μ}) => _.reduce(selector, (ρ, v, k) => ρ && (μ[k] === v), true))
  return cut }

function _getGlyphs(text, selector) {
  // get the glyph for each character
  return _.map(text, c => _getGlyph(c, selector)) }

function _resize() {
  let δ = { x: window.innerWidth,
            y: window.innerHeight}
  svg.setAttribute('width', δ.x)
  svg.setAttribute('height', δ.y)
  svg.setAttribute('viewBox', '0 0 ' +  δ.x + ' ' + δ.y)
  return δ }

function _transform(ε, {offset, scale}) {
  ε.setAttribute('transform', `matrix(${scale} 0 0 ${scale} ${offset.x} ${offset.y})`) }

function _layoutFrame() {
  let δw  = _resize(),                          // window dimensions
      ӎx  = _.maxBy(glyphlines, gl => gl.δ.x),  // max line width
      Ʀw  = δw.x / ӎx.δ.x                         // width ratio

  // transform only considering width
  g.setAttribute('transform', `matrix(${Ʀw} 0 0 ${Ʀw} 0 0)`)

  // …aftwerwards
  // get the height of the glyphs group
  // and compare it to the window height
  let h   = g.getBBox().height * Ʀw,
      Ʀh  = h / δw.y,
      δh  = (δw.y - h)/2

  // if the text is higher than the screen, re-scale the group
  if(Ʀh > 1) {
    Ʀw = Ʀw/Ʀh
    g.setAttribute('transform', `matrix(${Ʀw} 0 0 ${Ʀw} 0 0)`) }
  // if the text is not as high as the screen, center the group
  else g.setAttribute('transform', `matrix(${Ʀw} 0 0 ${Ʀw} 0 ${δh})`)

  return Ʀw }

function _layoutLine(glyphs, index, lines) {
  let δ = _.reduce(glyphs, (σ, glyph) => {
              let /*scale   = 1,*/
                  scale   = NORMAL / glyph.μ.height,
                  offset  = { x: σ.x /*+ glyph.μ.left*/,
                              y: 0.72 * NORMAL * (lines.length - index - 1) }
              _transform(glyph.g, {offset, scale})
              g.appendChild(glyph.g)
              σ.x += glyph.μ.width * scale
              return σ }, {x: 0, y: NORMAL})
  return {glyphs, δ}}

function _randomGlyph(char) {
  let ς = `#glyph-${char}`,
      ζ = glyphsRoot.querySelector(ς),
      η = _(ζ.childNodes)
            .filter(n => n.nodeType === 1)
            .sample(),
      μ = _glyphMetrics(η)
  return {g: η.cloneNode(true), μ: μ}}

function _permuteGlyph(glyph) {
  if(_.random(1000) > 4) return glyph
  return _randomGlyph(glyph.μ.char)}

function _update(initial) {
  if(initial)
    glyphlines  = _(lines)
                    .map(l => _getGlyphs(l, {font: 'UniversLTStd-XBlack'}))
                    .map(_layoutLine)
                    .value()  
  else {
    // clear existing divs
    while (g.hasChildNodes()) g.removeChild(g.lastChild)
    glyphlines  = _(glyphlines)
                  .map(gl => _.map(gl.glyphs, _permuteGlyph))
                  .map(_layoutLine)
                  .value() }}

function _makeText() {
  let w = window.innerWidth,
      h = window.innerHeight,
      r = w / h
  if(r > 1.4) return 'STUDIO KNACK'
  if(r > 0.8) return 'STUD IOKN ACK'
  if(r > 0.6) return 'STU DIO KNA CK'
  return 'ST UDI OK NA CK' }

function _initGlyphs() {
  glyphsRoot  = document.getElementById(GLYPHS_ROOT)
  svg         = document.getElementById(SVG_ROOT)
  g           = svg.querySelector(G)
  text        = _makeText()
  lines       = text.split(/\s/)
  
  _addEvent(window, 'resize', _.debounce(_layoutFrame, 150))
  _update(true)
  return _layoutFrame() }

function init() {
  // check that the hero element exists
  hero = document.getElementById(HERO_ROOT)
  if(!hero) return

  let scale = _initGlyphs()

  // _start(10, _update)
  // filters.init(scale) 
}


export default { init: init }