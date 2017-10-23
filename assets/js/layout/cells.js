import {randomNormal}   from 'd3-random'
import {scaleQuantize,
        scaleLinear}    from 'd3-scale'

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
      S   = { 1: {min: 1, max: 1}, // one column
              2: {min: 1, max: 2},
              3: {min: 1, max: 2},
              4: {min: 2, max: 3},
              5: {min: 2, max: 3},
              6: {min: 3, max: 6},
              // 7: {min: 3, max: 6},
              8: {min: 3, max: 5} },
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
                  _.defer(resolve)})) 
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
                        φ.item.style['grid-column'] = `span ${c}`
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
                        φ.content.style.background = `#ffff00`

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
      y = Math.round(h/rowHeight)
  φ.rowSpan = y
  φ.item.style['grid-row'] = `span ${y}`
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
              φ.itemBox       = util.boundingBox(φ.item)
              φ.contentBox    = util.boundingBox(φ.content)
              resolve() })) 
  return Promise.all(ρ)}

function _findNeighbours(Φ) {
  let ρ = _.map(Φ, φ => 
            new Promise( resolve => {
              φ.neighbours = neighbours.all(φ, Φ)
              _.defer(resolve) })) 
  return Promise.all(ρ)
}


function place(items, {gridStyle}) {
  let Φ = _.map(items, item => { 
              let id = item.getAttribute('id'),
                  content = item.querySelector('.content')
              return { item, id, content }})
  return  new Promise( resolve => 
                _setColspan(Φ, gridStyle)                 // assign a with to each item
                  .then(() => _setRatio(Φ, gridStyle))    // pick an aspect-ratio
                  .then(() => _setHeight(Φ, gridStyle))   // set the height based on width & ratio
                  .then(() => _readjustToScreenHeight(Φ, gridStyle)) // set to landscape if the item is heigher than the screen
                  .then(() => _setPadding(Φ, gridStyle))  // add some padding
                  .then(() => _calculateBounds(Φ))        // attach extent information
                  .then(() => _findNeighbours(Φ))         // attach neighbour information
                  .then(() => resolve(Φ)))}              

export default { place }




