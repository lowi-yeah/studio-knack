let letters = { a: ['a', 'A', 'α', 'Λ', '🜂', 'ﾍ'],
                c: ['c', 'C', 'Ɔ', 'ɕ', 'ɔ', 'ʗ', 'Ͻ', 'ﾧ'],
                d: ['d', 'D', 'δ', '🅓', '𐌃', 'Đ'],
                i: ['i', 'I', 'Ї', 'ו', 'ן', 'ℑ', '⌡', '⧘', 'ι'],
                k: ['k', 'K', 'κ', 'ҟ'],
                n: ['n', 'N', 'η', 'ɴ', 'П', 'П', 'ח',  'ℿ', '∩',  '⊓', '𝌓', '𐑿'],
                o: ['o', 'O', 'ø', 'θ', 'ם', 'ọ',  '▩', '●', '○', '⦻', '⨀', '⬢', '⬟', '⭓', '🝔'],
                s: ['s', 'S','Ϟ', 'ʃ', '⟆', '𐑥', '𐊖', '𐅜', 'ﻛ', 'ﻯ'],
                t: ['t', 'T', 'Ⱦ', 'ʈ', 'ʇ', 'ͳ', 'τ', 'Г', 'Т', 'т', 'Ŧ', '⏊', '⏉', 'ŧ'],
                u: ['u', 'U', 'ʉ', 'ṳ', '∪', '⨃']}

function _getFontSize(element) {
  let style = window.getComputedStyle(element, null).getPropertyValue('font-size')
  return parseFloat(style)}

function _setFontSize(element, size) { 
  element.style.fontSize = size + 'px'}

function _adjustSize() {
  let head        = document.getElementById('headline'),
      spans       = head.childNodes,
      spaceIndex  = _.findIndex(spans, (s) => s.className === 'space'),
      last        = spans[spaceIndex - 1],
      width       = last.offsetLeft + last.clientWidth,
      fontSize    = _getFontSize(last),
      windowWidth = window.innerWidth,
      ratio       = 0.81 * windowWidth / width,
      ηFontSize   = fontSize * ratio
  _setFontSize(head, ηFontSize)
}


function _start(fps, headline) {

  let fpsInterval   = 1000 / fps, 
      then          = Date.now() + 2000,
      startTime     = then, now, elapsed,
      current       = _.map(headline, c => c),
      setHeadline   = () => {
                        document // set new headline
                          .getElementById('headline')
                          .innerHTML = _.map( current, c => {
                            if(c === ' ') return '<span class="space"></span>'
                            return '<span>' + c + '</span>'
                          } ).join('') },
      makeHeadline  = () => {
                        let index = _.random(current.length)
                        current = _.map(current, (c, ι) => {
                                      if(index === ι) {
                                        let ς = headline[ι]
                                        return _.sample(letters[ς]) || current[ι] }
                                      return c })
                        setHeadline() },

      animate     = () => {
                      requestAnimationFrame(animate)
                      now = Date.now()
                      elapsed = now - then
                      if (elapsed > fpsInterval) {
                        then = now - (elapsed % fpsInterval);
                        makeHeadline() }}
  setHeadline()
  
  _.defer(() => {
    _adjustSize()
    animate() 
  })
}


function init() {
  let headline = document.getElementById('headline')
  if(!headline) return
  _start(1, headline.textContent.trim())
}


export default { init: init }