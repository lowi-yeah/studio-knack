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

                          else if(numCols === 8) return { portrait:  [MIN, -0.43],
                                                          square:    [-0.43, 0.43],
                                                          landscape: [0.43, MAX] } 

                          else  return { portrait:  [MIN, MIN+1],  //no portarait
                                         square:    [MIN+1, 0],    
                                         landscape: [0, MAX] }

                          // // Cumulative from mean (0 to Z)
                          // // ƒ(0.43) =  Φ(0.43) - ½ = 0.16640
                          // // @see: https://en.wikipedia.org/wiki/Standard_normal_table
                          // else return { portrait:  [MIN, -0.43],
                          //               square:    [-0.43, 0.43],
                          //               landscape: [0.43, MAX] } 

                                      },

      // the maximum and minimum colspans for an elment
      // depending on the number of columns in the layou
      S   = { 1:  {min: 1, max: 1}, // one column
              // 2:  {min: 1, max: 2},
              // 3:  {min: 2, max: 3},
              4:  {min: 2, max: 3},
              // 5:  {min: 2, max: 3},
              6:  {min: 3, max: 4},
              // 7:  {min: 3, max: 6},
              8:  {min: 3, max: 4},
              // 9:  {min: 2, max: 6},
              // 10: {min: 2, max: 6},
              // 11: {min: 2, max: 6},
              12: {min: 3, max: 6} },
      // aspect ratios
      R   = { portrait: 1/1.618,
              square: 1,
              landscape: 1.618}

function show() {
  console.log('show grid')
}


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


                        if(φ.size && φ.size === 'small')      c = minSpan
                        if(φ.size && φ.size === 'medium')     c = Math.ceil((maxSpan + minSpan)/2)
                        if(φ.size && φ.size === 'large')      c = maxSpan
                        if(φ.size && φ.size === 'fullscreen') c = numCols

                        if(φ.contentType === 'team') c = Math.floor((maxSpan + minSpan)/2)

                        φ.colSpan = c

                        // set the values in the dom
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

      if(_.isEqual(φ.contentType, 'text')) {
        let τ = φ.item.querySelector('.text-frame'),
            β = util.boundingBox(τ),
            s = Math.ceil(β.height/rowHeight)

        φ.rowSpan = s
        φ.item.style['grid-row-end'] = `${s}`
      }

      if(_.isEqual(φ.contentType, 'image')) {

        let β = util.boundingBox(φ.item),
            r = R[φ.ratio],
            h = β.width / r,
            s = Math.ceil(h/rowHeight) + 2

        // if(isMobile.phone) {
        //   φ.paddingTop    = 1 * rowHeight
        //   φ.paddingBottom = 3 * rowHeight
        //   φ.paddingLeft   = 16
        //   φ.paddingRight  = 16 } 
        let p = φ.item.getAttribute('data-padding'),
            hasPadding = p ? !(p === 'none') : true

        if(hasPadding) {
          let paddingH = _.random(48, 0.32 * β.width),
              paddingV = paddingH/r
  
          φ.paddingTop    = paddingV/2
          φ.paddingBottom = paddingV/2 + (2 * rowHeight)
          φ.paddingLeft   = paddingH/2
          φ.paddingRight  = paddingH/2 }

        φ.rowSpan = s
        φ.item.style['grid-row-end'] = `${s}`
      }

      if(_.isEqual(φ.contentType, 'team')) {
        let width = util.boundingBox(φ.item).width,
            image = φ.item.querySelector('.image'),
            ratio = R[image.getAttribute('data-ratio')],
            imgH  = width / ratio,

            text  = φ.item.querySelector('.text-frame'),
            textH = util.boundingBox(text).height,
            s     = Math.ceil((imgH + textH)/rowHeight)

        φ.rowSpan = s
        φ.item.style['grid-row-end'] = `${s}`
      }


     
      // else {

     
      // }
     
      
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
  var sizeΣ = scaleQuantize()
                .domain([1, 92])
                .range(['is-1', 'is-2', 'is-3', 'is-4', 'is-5', 'is-6']);

  return new Promise( resolve => {
    _(Φ)
      .each(φ => {
        if(!φ.label) return 
        if(φ.hidden) return 
        let text = φ.label.text,
            area = packing.placeLabel(φ, Λ),
            size = sizeΣ(text.length)
        φ.label.area = area
        φ.label.size = size })
    resolve(Φ) })}

function _filter(Φ, filter) {
  return new Promise( resolve => {
    _(Φ).each(φ => {
      if(φ.type === filter || filter === 'index'  || φ.type === 'about') φ.hidden = false
      else φ.hidden = true})
    resolve(Φ) })
}

function reset(Φ) {
  let filter = Φ.filtered || 'index'
  return _filter(Φ, filter) }

function _makeImageCell(item) {
  let type        = item.getAttribute('data-type'),
      contentType = item.getAttribute('data-content-type'),
      id      = item.getAttribute('id'),
      caption = item.querySelector('.caption'),
      title   = item.querySelector('.caption > .title'),
      label   = document.getElementById(`${id}-label`),
      link    = item.getAttribute('data-link'),
      size    = item.getAttribute('data-size'),
      ratio   = item.getAttribute('data-ratio'),
      scrollƒ = item.querySelector('.image-frame')

  let result = {item, type, contentType, id, caption, ratio, scrollƒ}

  if(title) result.title = title.innerHTML.trim()
  if(size)  result.size  = size
  if(label) {
    label.text    = label.querySelector('span').innerHTML
    result.label  = label }

  if(link) 
    result.link = { frame: item.querySelector('.image-frame'),
                    href: link }   

  return result
}

function _makeTextCell(item) {
  let type        = item.getAttribute('data-type'),
      contentType = item.getAttribute('data-content-type'),
      id          = item.getAttribute('id'),
      size        = item.getAttribute('data-size'),
      scrollƒ     = item.querySelector('.text-frame')
  return {item, id, type, contentType, size, scrollƒ}
}

function init(Φ, items, gridStyle) {
  let filter = Φ.filtered || 'index',
      Ѻ = _.map(items, item => _.isEqual(item.getAttribute('data-content-type'), 'image') ?
                                    _makeImageCell(item) : _makeTextCell(item))
  
  _.each(Ѻ, ϖ => Φ.push(ϖ))
  return  new Promise( resolve => 
                _setColspan(Φ, gridStyle)                 // assign a with to each item
                  // .then(() => _setRatio(Φ, gridStyle))    // pick an aspect-ratio
                  .then(() => _filter(Φ, filter))   // set the height based on width & ratio
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
            let labelArea = φ.label.area,
                size      = labelArea.rowSpan * labelArea.colSpan

            if(labelArea.rowStart === 0 || size <= 1) {
              φ.label.style.display    = 'none'
              φ.label.style.visibility = 'hidden' }
            else {
              φ.label.style.display    = 'flex'
              φ.label.style.visibility = 'visible'
              φ.label.style['gridArea'] = `${labelArea.rowStart} / ${labelArea.colStart} / ${labelArea.rowStart + labelArea.rowSpan} / ${labelArea.colStart + labelArea.colSpan}`  

              let text = φ.label.querySelector('span')
              text.classList.add(φ.label.size)
              if(labelArea.rowSpan > 6 * labelArea.colSpan || labelArea.colSpan === 1) {
                let rotation = _.sample(['-90deg', '90deg'])
                text.style.transform = `rotate(${rotation})` }}}

          resolve()}
      else reject(`φ.colStart ain't a number: ${φ.colStart}`) })))
  return new Promise(resolve => 
    Promise.all(ρ).then(() => resolve(Φ))) }

export default { init, labels, update, reset }




