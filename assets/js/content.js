import {randomNormal} from 'd3-random'
import {scaleLinear}  from 'd3-scale'
import anime          from 'animejs'
import util           from './util'

let ImageWorker   = require('worker-loader!./workers/image-worker.js'), 
    LayoutWorker  = require('worker-loader!./workers/layout-worker.js'), 
    ιWorker, ℓWorker


const NUM_COLUMNS = 24
const ȣ = randomNormal(0, 0.5)


function _imageUrls() {
  let items = document.querySelectorAll('.grid-item')
  console.log('items', items)
  return _.map(items, i => {
    return {id:   i.getAttribute('id'),
            url:  i.getAttribute('data-image-url')} }) }

function _itemIds() {
  let items = document.querySelectorAll('.grid-item')
  return _.map(items, i => i.getAttribute('id')) }

function _loadImages() {
  console.log('_loadImages')
  // ιWorker.postMessage(_imageUrls()) //send message to worker
}

function _stop() {
  ιWorker.terminate() //Terminate the worker
  ιWorker = null
}


// 24 columns
// row height: 1.5rem

function _numCols() {
  let device = util.getDevice(window.innerWidth)
  switch (device) {
    case 'mobile':
      return 1
    case 'tablet':
      return 2
    case 'desktop':
      return 3
    case 'widescreen':
      return 4
    default:
      return 6
    }
}

function _minColSpan() {
  return 24/_numCols()
}

function _maxColSpan() {
  let device = util.getDevice(window.innerWidth)
  // return 24
  switch (device) {
    case 'mobile':
      return 24
    case 'tablet':
      return 24
    case 'desktop':
      return 21
    case 'widescreen':
      return 18
    default:
      return 16
    }
}

function _minRowSpan() {
  return 21
}

function _maxRowSpan() {
  return 28
}

function _layoutCells(items, {x, y, colFn, rowFn}) {
  if(_.size(items) === 0) return
  // split into head and tail, 
  // random interval between 1 and the max number of columns η
  let item  = _.head(items),
      δ     = {x: colFn(), y: rowFn()}
  item.style['grid-column'] = `span ${δ.x}`
  item.style['grid-row']    = `span ${δ.y}`
  item.setAttribute('data-column', `${δ.x}`)
  item.setAttribute('data-row',    `${δ.y}`)
  _layoutCells(_.tail(items), {x, y, colFn, rowFn}) }

function _gridResize(items) {
  return new Promise( (resolve, reject) => {
    let r       = randomNormal(),
        colΣ    = scaleLinear()
                    .domain([-1, 1])
                    .rangeRound([_minColSpan(), _maxColSpan()]),
        colFn   = () => colΣ(r()),
        rowΣ    = scaleLinear()
                    .domain([-1, 1])
                    .rangeRound([_minRowSpan(), _maxRowSpan()]),
        rowFn   = () => {
                    let ζ = r()
                    return rowΣ(ζ) },
        x       = 0,
        y       = 0
    colΣ.clamp(true)
    rowΣ.clamp(true)
    _layoutCells(items, {x, y, colFn, rowFn})
    resolve() }) }

// gets a range of siblings for a given item
function _siblings(item, lower, upper) {
  // check bounds
  if(lower === undefined && upper === undefined) return _siblings(item, 0, 1)
  else if(upper === undefined) return _siblings(item, 0, lower)

  let before = [], after = []

  // console.log('_siblings', _id(item), lower, upper)

  // if the lower bound is negative get previous siblings
  if(lower < 0) {
    before = _(Math.abs(lower))
              .range()
              .reduce( (ρ, ι) => {

                if(!ρ.ι) return ρ
                let φ = ρ.ι.previousElementSibling

                // update the reduce result
                ρ.ℓ = _.concat(ρ.ℓ, φ)
                ρ.ι = φ
                return ρ
              }, {ι: item, ℓ: []}).ℓ }

  // if the upper bound is positive get next siblings
  if(upper > 0) {
    after = _(upper)
              .range()
              .reduce( (ρ, ι) => {

                if(!ρ.ι) return ρ
                let φ = ρ.ι.nextElementSibling

                // update the reduce result
                ρ.ℓ = _.concat(ρ.ℓ, φ)
                ρ.ι = φ
                return ρ
              }, {ι: item, ℓ: []}).ℓ }

  return _(before)
          .concat(after)
          .compact()
          .value()
}


function _extent(item) {
  let β = item.getBoundingClientRect()
  return { x0: β.x,
           x1: β.x + β.width,
           y0: β.y,
           y1: β.y + β.height }}


function _itemz(item, siblings, overlapFn, deltaFn) {
  let ε = _extent(item)

  return _.reduce(siblings, (ρ, ϑ) => {
    let εϑ = _extent(ϑ)

    // if there is overlap
    if(overlapFn(ε, εϑ))  {
      // calulate the distance between the item's right edge and ϑ's left edge
      let δ  = deltaFn(ε, εϑ)
      // if that distance is positive, add it to the result
      if(δ > 0) ρ = _.concat(ρ, {δ, ϑ}) }
    return ρ }, []) }


function _itemsAbove(item) {
  let siblings  = _siblings(item, -_numCols(), 0),
      overlapFn = (ε, εϑ) => (εϑ.x0 <= ε.x0 && εϑ.x1 >= ε.x0) || (εϑ.x0 <= ε.x1 && εϑ.x1 >= ε.x1),
      deltaFn   = (ε, εϑ) => (ε.y0 - εϑ.y1)
  return _itemz(item, siblings, overlapFn, deltaFn) }

function _itemsLeft(item) {
  let siblings  = _siblings(item, -_numCols(), _numCols()),
      overlapFn = (ε, εϑ) => (εϑ.y0 <= ε.y0 && εϑ.y1 >= ε.y0) || (εϑ.y0 <= ε.y1 && εϑ.y1 >= ε.y1),
      deltaFn   = (ε, εϑ) => (ε.x0 - εϑ.x1)
  return _itemz(item, siblings, overlapFn, deltaFn) }

function _itemsBelow(item) {
   let siblings  = _siblings(item, -_numCols(), _numCols()),
      overlapFn = (ε, εϑ) => (εϑ.x0 <= ε.x0 && εϑ.x1 >= ε.x0) || (εϑ.x0 <= ε.x1 && εϑ.x1 >= ε.x1),
      deltaFn   = (ε, εϑ) => (εϑ.y0 - ε.y1)
  return _itemz(item, siblings, overlapFn, deltaFn) }

function _itemsRight(item) {
   let siblings  = _siblings(item, -_numCols(), _numCols()),
      overlapFn = (ε, εϑ) => (εϑ.y0 <= ε.y0 && εϑ.y1 >= ε.y0) || (εϑ.y0 <= ε.y1 && εϑ.y1 >= ε.y1),
      deltaFn   = (ε, εϑ) => (εϑ.x0 - ε.x1)
  return _itemz(item, siblings, overlapFn, deltaFn) }


function _itemAbove(item) {
  let a = _itemsAbove(item)
  return _(a).sortBy( ι => ι.δ ).first() }

function _itemRight(item) {
  let r = _itemsRight(item)
  return _(r).sortBy( ι => ι.δ ).first() }

function _itemBelow(item) {
  let b = _itemsBelow(item)
  return _(b).sortBy( ι => ι.δ ).first() }

function _itemLeft(item) {
  let l = _itemsLeft(item)
  return _(l).sortBy( ι => ι.δ ).first() }

// calculates the whitespace of an item by adding it's own padding
// with the directional padding of the items around it
function _whitespace(item) {
  let β         = item.getBoundingClientRect(),
      itemAbove = _itemAbove(item),
      itemRight = _itemRight(item),
      itemBelow = _itemBelow(item),
      itemLeft  = _itemLeft(item),
      top       = parseInt(item.style.paddingTop),
      right     = parseInt(item.style.paddingRight),
      bottom    = parseInt(item.style.paddingBottom),
      left      = parseInt(item.style.paddingLeft),
      βl, βr

  if(itemAbove) {
    top += parseInt(itemAbove.δ)
    top += parseInt(itemAbove.ϑ.style.paddingBottom) }

  if(itemBelow) {
    bottom  += parseInt(itemBelow.δ)
    bottom  += parseInt(itemBelow.ϑ.style.paddingTop) }

  right += window.innerWidth - (β.x + β.width)
  if(itemRight) {
    βr = itemRight.ϑ.getBoundingClientRect()
    right -= βr.x
    right += parseInt(itemRight.ϑ.style.paddingLeft) }

  left += β.x
  if(itemLeft) {
    βl    = itemLeft.ϑ.getBoundingClientRect()
    left -= (βl.x + βl.width)
    left += parseInt(itemLeft.ϑ.style.paddingLeft) }

  return {top, left, bottom, right} }

function _cleanupText(item) {
  let τ   = item.querySelector('.text'),
      ς   = τ.querySelector('span'),
      β   = ς.getBoundingClientRect(),
      f   = parseInt(τ.style.fontSize),
      δl  = β.x - _.random(32, 21),
      δr  = window.innerWidth - (β.x + β.width) - _.random(32, 21),
      δx  = parseFloat(τ.getAttribute('data-x')) || 0,
      δy  = parseFloat(τ.getAttribute('data-y')) || 0,
      ηx

  if(δl < 0) {
    ηx = δx - δl
    τ.setAttribute('data-x', ηx)
    τ.style.fontSize = `${ f * 0.81 }px`
    τ.style.transform = `translateX(${ ηx }px) translateY(${ δy }px)` }

  if(δr < 0) {
    ηx = δx + δr
    τ.setAttribute('data-x', ηx)
    τ.style.width = `${ τ.clientWidth + δr }px`
    τ.style.fontSize = `${ f * 0.81 }px`
    τ.style.transform = `translateX(${ ηx }px) translateY(${ δy }px)` }

}

function _adjustText(item) {
  let ξ   = item.querySelector('.content'),
      τ   = ξ.querySelector('.text'),
      ς   = τ.querySelector('span'),
      τw  = τ.clientWidth,
      τh  = τ.clientHeight,
      τƒ  = parseInt(τ.style.fontSize),
      σ   = _whitespace(item),
      // the side with the largest amount of whitespace [top, right, left, bottom]
      μ   = _(σ)
              .reduce((ρ, ς, ι) => { 
                // texts as never above an item
              if(ς > ρ.value && ι !== 'top') {
                ρ.value = ς
                ρ.key = ι }
              return ρ }, { key: null, value: 0}),
      β,
      left, top, ratio,
      ηƒ, ηx 

  console.log('μ', μ)

  switch(μ.key) {

    case 'right': 
      // console.log('right')
      break

    case 'bottom': 
      // ratio = μ.value / τh

      // // set the new fontsize
      // ηƒ = _.random(0.24, 0.38) * ratio * τƒ
      // ηƒ = _.min([ηƒ, 64])
      // ηƒ = _.max([ηƒ, 32])
      // τ.style.fontSize  = `${ηƒ}px`

      // // adjust the position
      // top   = ξ.clientHeight + _.random(16, 48)

      // // τ.setAttribute('data-x', δℓ)
      // τ.setAttribute('data-y', top)
      // τ.style.transform = `translateX(${ 0 }px) translateY(${ top }px)`

      //debug
      // item.style['background-color'] = `#ffff99`
      break

    case 'left': 
      // console.log('left')
      break
    }


}

function _id(item) { 
  if(!item) return 'nullitem'
  return item.getAttribute('id') }

function _ids(items) {
  return _.map(items, ι => _id(ι.ϑ))}

function _layout() {

  let begin = performance.now(),
      items = document.querySelectorAll('.grid-item')

  _gridResize(items)

    // attach the geighbour data to each item
    .then( () => 
          _.each(items, item => {
            let itemsAbove = _itemsAbove(item),
                itemsRight = _itemsRight(item),
                itemsBelow = _itemsBelow(item),
                itemsLeft  = _itemsLeft(item)

            // console.log('\t\t', _ids(itemsAbove))
            // console.log('\t\t\t ↑')
            // console.log(_ids(itemsLeft), '← **', _id(item), '** →', _ids(itemsRight))
            // console.log('\t\t\t ↓')
            // console.log('\t\t', _ids(itemsBelow))
            // console.log('—————')

            // if(itemsAbove.length > 0) item.setAttribute('data-above', JSON.stringify(_ids(itemsAbove)))
            // if(itemsRight.length > 0) item.setAttribute('data-right', JSON.stringify(_ids(itemsRight)))
            // if(itemsBelow.length > 0) item.setAttribute('data-below', JSON.stringify(_ids(itemsBelow)))
            // if(itemsLeft.length  > 0) item.setAttribute('data-left',  JSON.stringify(_ids(itemsLeft))) 

            if(itemsAbove.length > 0) item.above  = itemsAbove
            if(itemsRight.length > 0) item.right  = itemsRight
            if(itemsBelow.length > 0) item.below  = itemsBelow
            if(itemsLeft.length  > 0) item.left   = itemsLeft
          }) )

    // split into lines
    .then( () => 
      _.reduce(items, (ρ, item) => {
        if(!item.left) ρ.push([item])
        else _.last(ρ).push(item)
        return ρ }, []) )

    .then( (rows) => 
      // shift the cells within their line
      _.each(rows, row => {
        // pull each element rightwards beinning with the rightmost        
        let χ = window.innerWidth
        _(row)
          .reverse()
          .each( ι => {
            let β  = ι.getBoundingClientRect(),
                μ  = _.random(χ - (β.x + β.width)),
                δx = _.max([0, μ]),
                δy = _.random(-64, 64)

            // set arrtibutes
            ι.setAttribute('data-x', δx)
            ι.setAttribute('data-y', δy)
            ι.style.transform = `translateX(${ δx }px) translateY(${ δy }px)`

            // update right hand side
            χ = β.x + δx }) }) )

    // adjust the padding
    .then( () =>  
      _.each(items, item => {
        let β = item.getBoundingClientRect()
        item.style.paddingLeft    = `${_.random(21, β.width * 0.12)}px`
        item.style.paddingRight   = `${_.random(21, β.width * 0.12)}px`
        item.style.paddingTop     = `${_.random(β.height *0.12, β.height * 0.38)}px`
        item.style.paddingBottom  = `${_.random(β.height *0.12, β.height * 0.38)}px` }))

    // resize the text
    .then( () =>  _.each(items, item => {
      item.querySelector('.text').style.fontSize = '32px'
      item.querySelector('.text').style.width = `${item.clientWidth}px` }) )

    // layout the text
    .then( () =>  _.each(items, item => _adjustText(item)))

    // clean up the text
    // .then( () =>  _.each(items, item => _cleanupText(item)))
    
    .then( () => console.log('layout complete.', `Took ${ Math.round(performance.now() - begin) }ms`) )
}


function init() {
  console.log('init content')

  _layout()

  // _(120)
  //   .range()
  //   .each( i => console.log(ȣ()))

  // ιWorker = new ImageWorker()
  
  // console.log('ImageWorker', ImageWorker)
  // console.log('ιWorker', ιWorker)

  // ιWorker.onmessage = function (image) {
  //   // console.log("eventt : " )
  //   let { id, ι } = image.data,
  //       item = document.getElementById(id),
  //       img  = item.querySelector('img')



  //   console.log('image arrived:', id, ι.substring(0, 24))
  //   // console.log(ι)
  //   console.log('item:', item)
  //   console.log('img:', img)

  //   // img.setAttribute('src', `data:image/jpg;base64,${ι}`)



  // }; 
  
  // _.defer(_loadImages)    

}
export default { init }