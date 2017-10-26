import {randomNormal}   from 'd3-random'
import {scaleQuantize,
        scaleLinear}    from 'd3-scale'
import isMobile         from 'ismobilejs'

import dom        from '../common/dom'
import util       from '../common/util'
import neighbours from './neighbours'

      // Z = { '1': [MIN, MAX],
      //       '2': [MIN, 0, MAX],
      //       '3': [MIN, -0.43, 0.43, MAX],
      //       '4': [MIN, -0.685, 0, 0.685, MAX],
      //       '5': [MIN, -0.804, -0.206, 0.206, 0.804, MAX]},

      // Z = { '1': [[MIN, MAX]],
      //       '2': [[MIN, 0], [0, MAX]],
      //       '3': [[MIN, -0.43], [-0.43, 0.43], [0.43, MAX]],
      //       '4': [[MIN, -0.685], [-0.685, 0], [0, 0.685], [0.685, MAX]],
      //       '5': [[MIN, -0.804], [-0.804, -0.206], [-0.206, 0.206], [0.206, 0.804], [0.804, MAX]] },

const MIN = Number.MIN_SAFE_INTEGER,
      MAX = Number.MAX_SAFE_INTEGER,

      // probabilities for each layout
      Z   = numCols => {  if(numCols <= 2) return { portrait:  [MIN, MIN-1],
                                                    square:    [MIN-1, 0],
                                                    landscape: [0, MAX] } //no portarait
                          // Cumulative from mean (0 to Z)
                          // ƒ(0.43) =  Φ(0.43) - ½ = 0.16640
                          // @see: https://en.wikipedia.org/wiki/Standard_normal_table
                          else return { portrait:  [MIN, -0.43],
                                        square:    [-0.43, 0.43],
                                        landscape: [0.43, MAX] } },

      // the maximum and minimum colspans for an elment
      // depending on the number of columns in the layou
      S   = { 1:  {min: 1, max: 1}, // one column
              // 2:  {min: 1, max: 2},
              // 3:  {min: 2, max: 3},
              4:  {min: 2, max: 3},
              // 5:  {min: 2, max: 3},
              6:  {min: 3, max: 4},
              // 7:  {min: 3, max: 6},
              8:  {min: 3, max: 5},
              // 9:  {min: 2, max: 6},
              // 10: {min: 2, max: 6},
              // 11: {min: 2, max: 6},
              12: {min: 2, max: 6} },
      // aspect ratios
      R   = { portrait: 1/1.618,
              square: 1,
              landscape: 1.618}

function show() {
  console.log('show grid')
}

function update() {
  console.log('update grid')
}

// (randomly) set the width/height ratio of each item
// possible ratios are 0.5, 1, 2
// for narrower items the probability of a .5-ratio is grater than that of a 2-ratio
// conversely, for wider items the probability of a 1-ratio is grater than that of a .5-ratio
function _setRatio(Φ, {numCols}) {
      // a linear scale used for offsetting the means of the dstandard deviations below
  let μΣ  = scaleLinear()
            .domain([0, numCols-1])
            .range([-1,2]),

      // ȣ is a collection of random normal distribution functions
      // one for each possible colspan
      // we use different distributions so that we have some measure of control
      // over the image ratios in relation to the colspan
      // if we have a very wide colspan, we want less likelyhood of portraits
      // whereas we wand more portraits in case of small colspans
      ȣ   = _(numCols)
              .range()
              .map(i => randomNormal(μΣ(i)))
              .value(),
      
      // enter a colspan → get a ratio      
      Σ = (colSpan) => {let z = Z(numCols),     // get the distribution segments
                            ʀ = ȣ[colSpan-1]()  // grab a random number
                        // find the segment in which ʀ resides and return its name
                        return _.reduce(z, (ρ, segment, ratio) => {
                                  if( segment[0] < ʀ &&  ʀ <= segment[1]) ρ = ratio
                                  return ρ }, null)},
      ρ = _.map(Φ, φ => 
            new Promise( resolve => {
                  let r = Σ(φ.colSpan)
                  φ.ratio = r
                  φ.item.setAttribute('data-ratio', r)
                  resolve()})) 
  return Promise.all(ρ)}

// (randomly) set the col-spans of each item
// depending on the number of columns in the grid
function _setColspan(Φ, {numCols}) {
  let ȣ       = randomNormal(numCols/2, 1),
      minSpan = S[numCols].min,
      maxSpan = S[numCols].max,
      ρ       = _.map(Φ, φ => 
                  new Promise( resolve => {
                        let c = Math.round(ȣ())
                        c = _.max([minSpan, c])
                        c = _.min([maxSpan, c])
                        φ.colSpan = c
                        φ.item.style['grid-column-start'] = '1'
                        φ.item.style['grid-column-end']   = `${c + 1}`
                        φ.item.style['grid-row-start']    = '1'
                        φ.item.style['grid-row-end']      = '2'
                        _.defer(resolve)})) 
  return Promise.all(ρ)}

// (randomly) add some padding to an element
function _setPadding(Φ, {numCols}) {
  let ρ       = _.map(Φ, φ => 
                  new Promise( resolve => {
                        let β = util.boundingBox(φ.item),
                            t = _.random(24, β.height * 0.2), // some random top…
                            b = _.random(24, β.height * 0.2), // …and bottom padding
                            h = β.height - (b + t),             // the remaining height
                            w = h * R[φ.ratio],                 // the resulting width
                            δ = β.width - w,
                            l = _.random(δ, true)

                        φ.content.style.width = `${w}px`
                        φ.item.style.paddingTop     = `${t}px`
                        φ.item.style.paddingBottom  = `${b}px`
                        φ.item.style.paddingLeft    = `${l}px`
                        _.defer(resolve)})) 
  return Promise.all(ρ)}

// set the width & height of each item
// based on the viewport width and the calculated colspan & ratio values
function _height(φ, rowHeight) {
  let β = util.boundingBox(φ.item),
      r = R[φ.ratio],
      h = β.width / r,
      s = Math.round(h/rowHeight),
      t = _.random(1, 4),
      b = _.random(3, 5)

  if(isMobile.phone) {
    φ.paddingTop    = 1 * rowHeight
    φ.paddingBottom = 3 * rowHeight
    φ.paddingLeft   = 16
    φ.paddingRight  = 16 } 
  else {
    φ.paddingTop    = t * rowHeight
    φ.paddingBottom = b * rowHeight
    φ.paddingLeft   = _.random(24, 0.125 * β.width)
    φ.paddingRight  = _.random(24, 0.125 * β.width) }
  φ.rowSpan = t + s + b
  φ.item.style['grid-row-end'] = `${t + s + b}`
}

function _setHeight(Φ, {rowHeight}) {
  let ρ = _.map(Φ, φ => 
            new Promise( resolve => {
              _height(φ, rowHeight)
              _.defer(resolve)})) 
  return Promise.all(ρ)}

function _readjustToScreenHeight(Φ, {rowHeight}) {
  let h = window.innerHeight,
      ρ = _.map(Φ, φ => 
            new Promise( resolve => {
              let β = util.boundingBox(φ.item)
              if(β.height > window.innerHeight * 0.81) {
                φ.ratio = 'landscape'
                φ.item.setAttribute('data-ratio', 'landscape')
                _.defer(() => {
                  _height(φ, rowHeight)
                  resolve()
                })
              } 
              else resolve()
            })) 
  return Promise.all(ρ)
}

function _calculateBounds(Φ) {
  let ρ = _.map(Φ, φ => 
            new Promise( resolve => {
              φ.itemExtent    = util.extent(φ.item)
              φ.contentExtent = util.extent(φ.content)
              φ.itemBox       = util.extent(φ.item)
              φ.contentBox    = util.extent(φ.content)
              resolve() })) 
  return Promise.all(ρ)}

function jiggle(Φ, {numCols}) {
  return new Promise( resolve => {
    _(Φ)
      .map(φ => {
        φ.neighbours = neighbours.all(φ, Φ)
        return φ })
      .shuffle()
      .each(φ => {
        // jiggle sideways
        // get the distances to either the neighbour or the grid edege
        let δLeft   = φ.neighbours.left ? 
                        φ.neighbours.left.δ :
                        φ.colStart-1,
            δRight  = φ.neighbours.right ? 
                        φ.neighbours.right.δ :
                        (numCols + 1 - (φ.colStart + φ.colSpan)),
            δ       = _.random(-δLeft, δRight)

        φ.colStart += δ
      })
    resolve(Φ)
  })
}

function _calculateWhitespace(φ, gridStyle) {
  let above = φ.paddingTop,
      below = φ.paddingBottom - φ.caption.clientHeight,
      left  = φ.paddingLeft,
      right = φ.paddingRight,
      η,labelPosition, labelHeight, labelWidth

  if(φ.neighbours.above) {
    above += φ.neighbours.above.δ
    η = _(φ.neighbours.above.η)
          .map(n => {return {η: n, δ: n.paddingBottom}})
          .sortBy(n => n.δ)
          .first().η

    if(η.labelPosition && η.labelPosition === 'below') {
      labelHeight = parseFloat(η.label.style.height)
      above += (η.paddingBottom - labelHeight)
    } else above += η.paddingBottom }

  if(φ.neighbours.below) {
    below += φ.neighbours.below.δ
    η = _(φ.neighbours.below.η)
          .map(n => {return {η: n, δ: n.paddingTop}})
          .sortBy(n => n.δ)
          .first().η

    if(η.labelPosition && η.labelPosition === 'above') {
      labelHeight = parseFloat(η.label.style.height)
      below += (η.paddingTop - labelHeight)
    } else below += η.paddingTop
  }

  if(φ.neighbours.left) {
    left += φ.neighbours.left.δ
    η = _(φ.neighbours.left.η)
          .map(n => {return {η: n, δ: n.paddingRight}})
          .sortBy(n => n.δ)
          .first().η
    if(η.labelPosition && η.labelPosition === 'right') {
      labelWidth = parseFloat(η.label.style.width)
      left += (η.paddingRight - labelWidth)
    } else left += η.paddingRight }
  else left += (φ.colStart-1) * gridStyle.colWidth

  if(φ.neighbours.right) {
    right += φ.neighbours.right.δ
    η = _(φ.neighbours.right.η)
          .map(n => {return {η: n, δ: n.paddingLeft}})
          .sortBy(n => n.δ)
          .first().η
    if(η.labelPosition && η.labelPosition === 'left') {
      labelWidth = parseFloat(η.label.style.width)
      right += (η.paddingLeft - labelWidth)
    } else right += η.paddingLeft }
  else right += (gridStyle.numCols + 1 - (φ.colStart + φ.colSpan)) * gridStyle.colWidth

  return {above, right, below, left}}

function labels(Φ, gridStyle) {
  return new Promise( resolve => {
    _(Φ)
      .each(φ => {
        if(!φ.label) return 
            // calculate the whitespace in all directions
        let whitespace      = _calculateWhitespace(φ, gridStyle),
            // pick the direction with the largest delta
            {δ, direction}  = _.reduce(whitespace, (ρ, delta, dir) => {
                                  if(delta > ρ.δ) {
                                    ρ.δ = delta
                                    ρ.direction = dir }
                                  return ρ }, {δ: 0, direction: null}),
            frameβ          = util.boundingBox(φ.frame),
            contentβ        = util.boundingBox(φ.content),
            imageβ          = util.boundingBox(φ.image),
            labelβ          = util.boundingBox(φ.label),
            offset

        switch(direction) {
      
          case 'above': 
            offset = φ.paddingTop - δ
            φ.label.style.transform   = `translateY(${offset}px)`
            φ.label.style.height      = `${δ * 0.618}px`
            φ.labelPosition           = 'above'
            break

          case 'below': 
            let contentHeight = (φ.rowSpan * gridStyle.rowHeight) - (φ.paddingTop + φ.paddingBottom),
                captionHeight = φ.caption.clientHeight

            offset = φ.paddingTop + contentHeight + captionHeight
            φ.label.style.transform   = `translateY(${offset}px)`
            φ.label.style.height      = `${δ * 0.618}px`
            φ.labelPosition           = 'below'
            break

          case 'right': 
            φ.label.style.width         = `${δ}px`
            φ.label.style.height        = `${frameβ.height * 0.618}px`
            φ.label.style.transform     = `translateX(${frameβ.width - φ.paddingRight}px)`
            φ.labelPosition             = 'right'
            break

          case 'left': 
            φ.label.style.width         = `${δ}px`
            φ.label.style.height        = `${frameβ.height * 0.618}px`
            φ.label.style.transform     = `translateX(${-δ + φ.paddingLeft}px)`
            φ.labelPosition             = 'left'
            break
        }
      })
    resolve(Φ)
  })
}

function visibility(Φ) {
  let filter = Φ.filtered || 'all'
  return new Promise( resolve => {
    _(Φ).each(φ => {
      console.log('φ.type:', φ.type, 'filter:', filter, 'show:', (φ.type === filter || filter === 'all'))
      if(φ.type === filter || filter === 'all')
        φ.item.classList.remove('hidden')
      else
        φ.item.classList.add('hidden') })
    resolve(Φ)
  })
}


function init(items, gridStyle) {
  let Φ = _.map(items, item => { 
              let id      = item.getAttribute('id'),
                  frame   = item.querySelector('.frame'),
                  content = item.querySelector('.content'),
                  caption = item.querySelector('.caption-frame'),
                  label   = item.querySelector('.label'),
                  image   = item.querySelector('.image-frame'),
                  type    = item.getAttribute('data-type')
              return { item, id, frame, content, caption, label, image, type }})
  return  new Promise( resolve => 
                _setColspan(Φ, gridStyle)                 // assign a with to each item
                  .then(() => _setRatio(Φ, gridStyle))    // pick an aspect-ratio
                  .then(() => _setHeight(Φ, gridStyle))   // set the height based on width & ratio
                  .then(() => _readjustToScreenHeight(Φ, gridStyle)) // set to landscape if the item is heigher than the screen
                  .then(() => resolve(Φ)))}

function update(Φ, gridStyle) {
  let ρ = _.map(Φ, φ => 
    new Promise( resolve => {
      if(_.isNumber(φ.colStart)) {
        φ.item.style['grid-column-start'] = `${φ.colStart}`
        φ.item.style['grid-column-end']   = `${φ.colStart + φ.colSpan}`
        φ.item.style['grid-row-start']    = `${φ.rowStart}`
        φ.item.style['grid-row-end']      = `${φ.rowStart + φ.rowSpan}`
        φ.item.style['paddingTop']     = `${(φ.paddingTop)}px`
        φ.item.style['paddingBottom']  = `${(φ.paddingBottom)}px`
        φ.item.style['paddingRight']   = `${φ.paddingRight}px`
        φ.item.style['paddingLeft']    = `${φ.paddingLeft}px`

        _.defer(resolve) }
      else resolve() }) )
  return new Promise(resolve => 
    Promise.all(ρ).then(() => resolve(Φ))) }

export default { init, jiggle, labels, update, visibility }



