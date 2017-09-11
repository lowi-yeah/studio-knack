import anime from 'animejs'

let filter = document.getElementById('bam-filter'),
    glyphs = document.querySelector('svg#bam g.glyphs')

function _height() {
  let height    = _.random(glyphs.getBBox().height),
      duration  = _.random(20, 1000)
  anime({
    targets:    '#bam-filter feFlood',
    height:     height,
    duration:   duration,
    easing:     'linear',
    complete:   _height
  })
}

function _y() {
  let y         = _.random(glyphs.getBBox().height),
      duration  = _.random(20, 1000)
  anime({
    targets:    '#bam-filter feFlood',
    y:          y,
    duration:   duration,
    easing:     'linear',
    complete:   _y
  })
}

function init(scale) { 
  // console.log('init filters', scale) 
  // console.log('filter', filter) 
  // console.log('glyphs', glyphs.getBBox().height) 
  _height()
  _y()
}

export default { init: init }