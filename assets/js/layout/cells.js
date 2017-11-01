import {randomNormal}   from 'd3-random'
import {scaleQuantize,
        scaleLinear}    from 'd3-scale'
import isMobile         from 'ismobilejs'

import dom        from '../common/dom'
import util       from '../common/util'
import packing    from './bin-packing'

function _inspect(φ) {
  return `${φ.title} — rowStart: ${φ.rowStart}, rowSpan: ${φ.rowSpan}, colStart: ${φ.colStart}, colSpan: ${φ.colSpan}`
}


const MIN = Number.MIN_SAFE_INTEGER,
      MAX = Number.MAX_SAFE_INTEGER,

      // probabilities for each layout
      Z   = numCols => {  if(numCols <= 2) return { portrait:  [MIN, MIN+1],  //no portarait
                                                    square:    [MIN+1, MIN+2],    //no square
                                                    landscape: [MIN+2, MAX] }

                          else if(numCols === 4) return { portrait:  [MIN, MIN+1],  //no portarait
                                                          square:    [MIN+1, 0],    
                                                          landscape: [0, MAX] }

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
              12: {min: 3, max: 4} },
      // aspect ratios
      R   = { portrait: 1/1.618,
              square: 1,
              landscape: 1.618}

function show() {
  console.log('show grid')
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
                  new Promise( resolve => _.defer(()=> {
                        let c = Math.round(ȣ())
                        c = _.max([minSpan, c])
                        c = _.min([maxSpan, c])
                        φ.colSpan = c
                        φ.item.style['grid-column-start'] = '1'
                        φ.item.style['grid-column-end']   = `${c + 1}`
                        φ.item.style['grid-row-start']    = '1'
                        φ.item.style['grid-row-end']      = '2'
                        resolve() }))) 
  return Promise.all(ρ)}

// set the width & height of each item
// based on the viewport width and the calculated colspan & ratio values
function _height(φ, rowHeight) {
  return new Promise(resolve => 
    _.defer(() => {
      let β = util.boundingBox(φ.item),
          r = R[φ.ratio],
          h = β.width / r,
          s = Math.round(h/rowHeight) + 2

      if(isMobile.phone) {
        φ.paddingTop    = 1 * rowHeight
        φ.paddingBottom = 3 * rowHeight
        φ.paddingLeft   = 16
        φ.paddingRight  = 16 } 
      else {

        let paddingH = _.random(48, 0.32 * β.width),
            paddingV = paddingH/r

        φ.paddingTop    = paddingV/2
        φ.paddingBottom = paddingV/2 + (2 * rowHeight)
        φ.paddingLeft   = paddingH/2
        φ.paddingRight  = paddingH/2
      }
      φ.rowSpan = s
      φ.item.style['grid-row-end'] = `${s}`
      resolve() }))}

function _setHeight(Φ, {rowHeight}) {
  let ρ = _.map(Φ, φ => _height(φ, rowHeight))
  return Promise.all(ρ)}

function _readjustToScreenHeight(Φ, {rowHeight}) {
  let h = window.innerHeight,
      ρ = _.map(Φ, φ => 
            new Promise( resolve => _.defer(() => {
              let β = util.boundingBox(φ.item)
              if(β.height > window.innerHeight * 0.81) {
                φ.ratio = 'landscape'
                φ.item.setAttribute('data-ratio', 'landscape')
                _height(φ, rowHeight)
                resolve() } 
              else resolve() }))) 
  return Promise.all(ρ) }

function labels(Φ, Λ) {
  return new Promise( resolve => {
    _(Φ)
      .each(φ => {
        if(!φ.label) return 
        if(φ.hidden) return 
            // calculate the whitespace in all directions
        
        let text = φ.label.text

        // console.log('text', text)
        let area = packing.placeLabel(φ, Λ)

        console.log('area', area)
        φ.label.area = area
      })
    resolve(Φ)
  })
}

function reset(Φ) {
  let filter = Φ.filtered || 'index'
  return new Promise( resolve => {
    _(Φ).each(φ => {
      if(φ.type === filter || filter === 'index') φ.hidden = false
      else φ.hidden = true})
    resolve(Φ) })}

function init(Φ, items, gridStyle) {
  let filter = Φ.filtered || 'index',
      Ѻ = _.map(items, item => { 
              let id      = item.getAttribute('id'),
                  frame   = item.querySelector('.frame'),
                  content = item.querySelector('.content'),
                  caption = item.querySelector('.caption-frame'),
                  label   = document.getElementById(`${id}-label`),
                  image   = item.querySelector('.image-frame'),
                  type    = item.getAttribute('data-type'),
                  title   = item.querySelector('.caption > .title').innerHTML,
                  hidden  = !(type === filter || filter === 'index')

              if(label) label.text = label.querySelector('span').innerHTML

              return { item, id, frame, content, caption, label, image, type, hidden, title }})
  _.each(Ѻ, ϖ => Φ.push(ϖ))
  return  new Promise( resolve => 
                _setColspan(Φ, gridStyle)                 // assign a with to each item
                  .then(() => _setRatio(Φ, gridStyle))    // pick an aspect-ratio
                  .then(() => _setHeight(Φ, gridStyle))   // set the height based on width & ratio
                  .then(() => _readjustToScreenHeight(Φ, gridStyle)) // set to landscape if the item is heigher than the screen
                  .then(() => resolve(Φ)))}

function update(Φ, gridStyle) {
  let ρ = _.map(Φ, φ => 
    new Promise( (resolve, reject) => 
      _.defer(() => {
        if(φ.hidden) {
          φ.item.style.display    = 'none'
          φ.item.style.visibility = 'hidden'
          if(φ.label) {
            φ.label.style.display    = 'none'
            φ.label.style.visibility = 'hidden' }
          resolve() }
        else if(_.isNumber(φ.colStart)) {
          φ.item.style.display    = 'flex'
          φ.item.style.visibility = 'visible'

          φ.item.style['grid-column-start'] = `${φ.colStart}`
          φ.item.style['grid-column-end']   = `${φ.colStart + φ.colSpan}`
          φ.item.style['grid-row-start']    = `${φ.rowStart}`
          φ.item.style['grid-row-end']      = `${φ.rowStart + φ.rowSpan}`
          φ.item.style['paddingTop']        = `${(φ.paddingTop)}px`
          φ.item.style['paddingBottom']     = `${(φ.paddingBottom)}px`
          φ.item.style['paddingRight']      = `${φ.paddingRight}px`
          φ.item.style['paddingLeft']       = `${φ.paddingLeft}px`

          if(φ.label) {
            let labelArea = φ.label.area

            if(labelArea.rowStart === 0) {
              φ.label.style.display    = 'none'
              φ.label.style.visibility = 'hidden' }
            else {
              φ.label.style.display    = 'flex'
              φ.label.style.visibility = 'visible'
              φ.label.style['gridArea'] = `${labelArea.rowStart} / ${labelArea.colStart} / ${labelArea.rowStart + labelArea.rowSpan} / ${labelArea.colStart + labelArea.colSpan}`  
  
              if(labelArea.rowSpan > 6 * labelArea.colSpan) {
                let text = φ.label.querySelector('span'),
                    rotation = _.sample(['-90deg', '90deg'])
                text.style.transform = `rotate(${rotation})`
              }
            }
          }

          resolve()}
      else reject(`φ.colStart ain't a number: ${φ.colStart}`) })))
  return new Promise(resolve => 
    Promise.all(ρ).then(() => resolve(Φ))) }

export default { init, labels, update, reset }




