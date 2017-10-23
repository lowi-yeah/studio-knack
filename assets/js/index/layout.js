import {randomNormal}   from 'd3-random'
import anime            from 'animejs'
import {scaleLinear, 
        scaleQuantize}  from 'd3-scale'
import parallax         from '../common/parallax'
import util             from '../common/util'
import gradient         from '../common/gradient'
import overlay          from '../common/overlay'

const NUM_COLUMNS = 24
const ȣ = randomNormal(0, 0.5)
const EASINGS = ['easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine']

const ΔCONFIG = {
    mobile:     { numCols: 1,
                  minColSpan: 24,
                  maxColSpan: 24,
                  minRowSpan: 21,
                  maxRowSpan: 28,
                  minPaddingX: 0,
                  maxPaddingX: 0,
                  minPaddingY: 48,
                  maxPaddingY: 144 },
    tablet:     { numCols: 3,
                  minColSpan: 10,
                  maxColSpan: 19,
                  minRowSpan: 16,
                  maxRowSpan: 21,
                  minPaddingX: 24,
                  maxPaddingX: 48,
                  minPaddingY: 48,
                  maxPaddingY: 92 },
    desktop:    { numCols: 3,
                  minColSpan: 12,
                  maxColSpan: 21,
                  minRowSpan: 18,
                  maxRowSpan: 28,
                  minPaddingX: 24,
                  maxPaddingX: 48,
                  minPaddingY: 48,
                  maxPaddingY: 144 },
    widescreen: { numCols: 3,
                  minColSpan: 10,
                  maxColSpan: 18,
                  minRowSpan: 18,
                  maxRowSpan: 24,
                  minPaddingX: 24,
                  maxPaddingX: 92,
                  minPaddingY: 48,
                  maxPaddingY: 92 },
    fullhd:     { numCols: 5,
                  minColSpan: 8,
                  maxColSpan: 10,
                  minRowSpan: 24,
                  maxRowSpan: 32,
                  minPaddingX: 16,
                  maxPaddingX: 48,
                  minPaddingY: 96,
                  maxPaddingY: 144 }}

const SHADOWS = ['shadow-2', 'shadow-3', 'shadow-4', 'shadow-6', 'shadow-8', 'shadow-16']

function _minPaddingX(){
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].minPaddingX
}

function _maxPaddingX(){
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].maxPaddingX
}

function _minPaddingY(){
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].minPaddingY
}

function _maxPaddingY(){
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].maxPaddingY
}


function _numCols() {
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].numCols
}

function _minColSpan() {
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].minColSpan
}

function _maxColSpan() {
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].maxColSpan
}

function _minRowSpan() {
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].minRowSpan
}

function _maxRowSpan() {
  let device = util.getDevice(window.innerWidth)
  return ΔCONFIG[device].maxRowSpan
}

function _layoutCells(items, {x, y, colFn, rowFn}) {
  if(_.size(items) === 0) return
  // split into head and tail, 
  // random interval between 1 and the max number of columns η
  let item  = _.head(items),
      δ     = {x: colFn(), y: rowFn()},
      ν     = parseInt(item.getAttribute('data-visible')) === 1

  if(ν) {
    item.style.display = 'flex'
    item.style['grid-column'] = `span ${δ.x}`
    item.style['grid-row']    = `span ${δ.y}`
    item.setAttribute('data-column', `${δ.x}`)
    item.setAttribute('data-row',    `${δ.y}`) } 
  else item.style.display = 'none'


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

  let before = [], 
      after = []

  // if the lower bound is negative get previous siblings
  if(lower < 0) {
    let ι = item,
        visible,
        η = -1 * lower

    while(η > 0) {
      // if there is no ι: break 
      if(!ι) break

      // check whether the current item is visible
      visible = parseInt(ι.getAttribute('data-visible')) === 1

      // update ι with the previous sibling node
      ι = ι.previousElementSibling

      if(visible) {
        before = _.concat(before, ι)
        η -= 1
      }
    }
  }

    // before = _(Math.abs(lower))
    //           .range()
    //           .reduce( (ρ, ι) => {

    //             if(!ρ.ι) return ρ
    //             let φ = ρ.ι.previousElementSibling

    //             // update the reduce result
    //             ρ.ℓ = _.concat(ρ.ℓ, φ)
    //             ρ.ι = φ
    //             return ρ
    //           }, {ι: item, ℓ: []}).ℓ }

  if(upper > 0) {
    let ι = item,
        visible,
        η = upper

    while(η > 0) {
      // if there is no ι: break 
      if(!ι) break

      // check whether the current item is visible
      visible = parseInt(ι.getAttribute('data-visible')) === 1

      // update ι with the previous sibling node
      ι = ι.nextElementSibling

      if(visible) {
        before = _.concat(before, ι)
        η -= 1
      }
    }
  }

  // // if the upper bound is positive get next siblings
  // if(upper > 0) {
  //   after = _(upper)
  //             .range()
  //             .reduce( (ρ, ι) => {

  //               if(!ρ.ι) return ρ
  //               let φ = ρ.ι.nextElementSibling

  //               // update the reduce result
  //               ρ.ℓ = _.concat(ρ.ℓ, φ)
  //               ρ.ι = φ
  //               return ρ
  //             }, {ι: item, ℓ: []}).ℓ }

  return _(before)
          .concat(after)
          .compact()
          .value()
}

function _itemz(item, siblings, overlapFn, deltaFn) {
  let ε = util.extent(item)

  return _.reduce(siblings, (ρ, ϑ) => {
    let εϑ = util.extent(ϑ)

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
  // let a = _itemsAbove(item)
  let a = item.above
  return _(a).sortBy( ι => ι.δ ).first() }

function _itemRight(item) {
  // let r = _itemsRight(item)
  let r = item.right
  return _(r).sortBy( ι => ι.δ ).first() }

function _itemBelow(item) {
  // let b = _itemsBelow(item)
  let b = item.below
  return _(b).sortBy( ι => ι.δ ).first() }

function _itemLeft(item) {
  // let l = _itemsLeft(item)
  let l = item.left
  return _(l).sortBy( ι => ι.δ ).first() }

// calculates the whitespace of an item by adding it's own padding
// with the directional padding of the items around it
function _whitespace(item) {
  let β         = util.boundingBox(item),
      ε         = util.extent(item),
      itemAbove = _itemAbove(item),                         // the items to the sides
      itemRight = _itemRight(item),
      itemBelow = _itemBelow(item),
      itemLeft  = _itemLeft(item),
      δx        = parseInt(item.getAttribute('data-x')),    // the item's transform: translate
      δy        = parseInt(item.getAttribute('data-y')),
      top       = parseInt(item.style.paddingTop),          // the initial values
      right     = parseInt(item.style.paddingRight),        // initialized to the respective padding-values
      bottom    = parseInt(item.style.paddingBottom),
      left      = parseInt(item.style.paddingLeft),
      γh        = document.getElementById('grid').clientHeight, // the height of the grid container
      εχ // helper
  
  if(itemAbove) {
    εχ = util.extent(itemAbove.ϑ)
    top += ε.y0 - εχ.y1
    top += parseInt(itemAbove.ϑ.style.paddingBottom) }
  // no else.
  // [..]
  // why?
  // cause I said so…!
  // actually… we don't push text upwards and so we could ignore the whole above-shebang

  if(itemBelow) {
    εχ = util.extent(itemBelow.ϑ)
    bottom += εχ.y0 - ε.y1
    bottom  += parseInt(itemBelow.ϑ.style.paddingTop) } 
  else bottom += (γh - (β.y + β.height) + 192)

  if(itemLeft) {
    εχ = util.extent(itemLeft.ϑ)
    left += ε.x0 - εχ.x1
    left += parseInt(itemLeft.ϑ.style.paddingRight) }
  else left += ε.x0

  if(itemRight) {
    εχ = util.extent(itemRight.ϑ)
    right += εχ.x0 - ε.x1
    right += parseInt(itemRight.ϑ.style.paddingLeft) }
  else
    right += (window.innerWidth - ε.x1)

  return {top, left, bottom, right} }

function _doDomElementsOverlap(element0, element1) {
  let ε0 = util.extent(element0),                   // bounding boxes
      ε1 = util.extent(element1),
      ωt = (ε1.y0 <= ε0.y0 && ε1.y1 >= ε0.y0),  // overlap flags
      ωb = (ε1.y0 >= ε0.y0 && ε1.y0 <= ε0.y1),
      ωl = (ε1.x0 <= ε0.x0 && ε1.x1 >= ε0.x0),
      ωr = (ε1.x0 >= ε0.x0 && ε1.x0 <= ε0.x1)

  if ( ωl && (ωt || ωb) ) return ε0.x0 - ε1.x1
  if ( ωr && (ωt || ωb) ) return ε0.x1 - ε1.x0 // maybe buggy?
  else return 0 }

function _doItemsOverlap(itemRight, itemLeft) {
  let ς0 = itemRight.querySelector('.text span'), // text spans
      ς1 = itemLeft.querySelector('.text span'),
      ζ1 = itemLeft.querySelector('.image')        // image span

  let textsOverlap      = _doDomElementsOverlap(ς0, ς1),
      textImageOverlap  = _doDomElementsOverlap(ς0, ζ1)

  return (textsOverlap !== 0 || textImageOverlap !== 0)
}

let fontWeightΣ = scaleQuantize()
                    .domain([1, 81])
                    .range(['900', '800', '700', '400'])

function _cleanupText(item) {
  return new Promise( (resolve) => { 
    _.defer(() => { 
      let τ = item.querySelector('.text'),
          ς = τ.querySelector('span'),
    
          τβ  = util.boundingBox(τ),
          ςβ  = util.boundingBox(ς),
    
          f   = parseInt(τ.style.fontSize),
          η   = ς.innerHTML.trim().length,
          δx, δy, ϴ,
          ιl, ιr, ιb, ω, ζ
    
      // check if there is ample space withing the .text element
      if( τβ.width * 0.72  > ςβ.width) {
        ϴ = τβ.width/ςβ.width
        ϴ = _.random(ϴ * 0.618, ϴ, true)
        τ.style.fontSize = `${ _.min([f * ϴ, 64]) }px` }
    
      // apply font weight based on text length
      τ.style.fontWeight = `${ fontWeightΣ(η) }` 
      
      // check if the text overshoots the right window edge
      if( ςβ.x + ςβ.width > (window.innerWidth - 21)) {
        ς.style.transform       = `translateX(${ςβ.height/2}px) translateY(${-ςβ.width/2}px) rotate(90deg)`
        ς.style.display         = 'inline-block'
        ς.style.transformOrigin = 'left center'
        }
    
      // check if the text overshoots the left window edge
      // @obacht: the text may be right alligned
      // if( τ.style.textAlign === 'right' && (ςβ.x0 - ςβ.width) < 21 ||
      //     τ.style.textAlign !== 'right' && ςβ.x0 < 21 ) {
      if(ςβ.x < 21) {
        ς.style.transform       = `translateX(${-ςβ.height/2}px) translateY(${-ςβ.width/2}px) rotate(-90deg)`
        ς.style.display         = 'inline-block'
        ς.style.transformOrigin = 'right center'
        ς.style.textAlign       = 'left'
        }


      // do the text overlap?
      ιl = _itemLeft(item)
      if(ιl) {
        ω  = _doItemsOverlap(item, ιl.ϑ)
        if(ω) {
          ς.style.display = 'none'
          ς.style.visibility = 'hidden'
        }
      }

      // ιr = _itemRight(item)
      // if(ιr) {
      //   ζ = ιr.ϑ.querySelector('.image')          
      //   ω  = _doDomElementsOverlap(ς, ζ)
      //   if(ω) {
      //     ς.style.display = 'none'
      //     ς.style.visibility = 'hidden'
      //   }
      // }

      // ιb = _itemBelow(item)
      // if(ιb) {
      //   ζ = ιb.ϑ.querySelector('.image')          
      //   ω  = _doDomElementsOverlap(ς, ζ)
      //   if(ω) {
      //     ς.style.display = 'none'
      //     ς.style.visibility = 'hidden'
      //   }
      // }


      // console.log('item', item)
      // console.log('left', item.left)
      // console.log('right', item.right)




      // if(δl < 0) {
      //   ηx = δx - δl
      //   τ.setAttribute('data-x', ηx)
      //   τ.style.fontSize = `${ f * 0.81 }px`
      //   τ.style.transform = `translateX(${ ηx }px) translateY(${ δy }px)` }
    
      // if(δr < 0) {
      //   ηx = δx + δr
      //   τ.setAttribute('data-x', ηx)
      //   τ.style.width = `${ τ.clientWidth + δr }px`
      //   τ.style.fontSize = `${ f * 0.81 }px`
      //   τ.style.transform = `translateX(${ ηx }px) translateY(${ δy }px)` }
      resolve() })})}

function _adjustText(item) {
  return new Promise( (resolve) => { 
    _.defer(() => {
      let ς = item.querySelector('.content'),
          τ = item.querySelector('.text'),
          s = τ.querySelector('span'),
          ƒ = parseInt(τ.style.fontSize),
          σ = _whitespace(item),
          // the side with the largest amount of whitespace [top, right, left, bottom]
          μ = _(σ)
                .reduce((ρ, ς, ι) => { 
                if(util.getDevice(window.innerWidth) === 'mobile') {
                  ρ.value = σ['bottom']
                  ρ.key = 'bottom'
                }

                // texts as never above an item
                if(ς > ρ.value && ι !== 'top') {
                  ρ.value = ς
                  ρ.key = ι }
                return ρ }, { key: null, value: 0}),
          // ηƒ,             // new font size
          δx, δy,         // offset
          ει, ες, ετ, εs, // bounding boxez
          ηw, ηh          // new width & height
      
      switch(μ.key) {
    
        // top is being ignored
         // case 'top': 
         //  ες = util.extent(ς)
         //  ετ = util.extent(τ)
         //  δx = _.random(-σ.left)
         //  δy = ες.y0 - ετ.y1
         //  ηw = (ες.x1 + σ.right) - (ετ.x0 + δx) - 48
         //  τ.style.width = `${ ηw }px`
         //  τ.style.transform = `translateX(${ 32 + δx }px) translateY(${ δy }px)`
         //  τ.style.color = '#A6C85D'
         //  break
    
        case 'right': 
          ει = util.extent(item)
          ες = util.extent(ς)
          ετ = util.extent(τ)
    
          δx = (ες.x1 - ει.x0) + 21
          δy = ες.y0 - ετ.y0 + _.random(21, (ες.y1 - ες.y0) * 0.618)
          ηw = (ες.x1 + σ.right) - (ετ.x0 + δx)
    
          τ.setAttribute('data-text-pos', 'right')
          τ.style.width = `${ ηw }px`
          τ.style.transform = `translateX(${ δx }px) translateY(${ δy }px)`
          break
    
        case 'bottom': 
          ει = util.extent(item)
          ες = util.extent(ς)
          ετ = util.extent(τ)
          
          δx = _.max([-σ.left + (ες.x0 - ει.x0), -128])
          δy = ες.y1 - ετ.y0 + 21
          ηw = (ες.x1 + σ.right) - (ετ.x0 + δx) - 64
          ηw = _.min([ηw, window.innerWidth * 0.618])
    
          τ.setAttribute('data-text-pos', 'bottom')
          τ.style.width = `${ ηw }px`
          τ.style.transform = `translateX(${ 32 + δx }px) translateY(${ δy }px)`


          // add the height of the text to the height of the grid item
          // item.style.height = `(ει.y1 - ει.y0) + (ετ.y1 - ετ.y0)px`
    

          break
    
        case 'left': 
          ει = util.extent(item)
          ες = util.extent(ς)
          ετ = util.extent(τ)
          εs = util.extent(s)
    
          δx = -(εs.x1 - εs.x0) + (ες.x0 - ει.x0) -21
          δy = ες.y0 - ετ.y0 + _.random(21, (ες.y1 - ες.y0) * 0.618)
          ηw = ετ.x0 - (ετ.x0 + δx)
    
          τ.setAttribute('data-text-pos', 'left')
          τ.style.width = `${ ηw }px`
          τ.style.transform = `translateX(${ δx }px) translateY(${ δy }px)`
          τ.style.textAlign = 'right'
          break
        }
        resolve()
      })
    })
}

function _id(item) { 
  if(!item) return 'nullitem'
  return item.getAttribute('id') }

function _ids(items) {
  return _.map(items, ι => _id(ι.ϑ))}

// function _clearGrid() {
//   return new Promise( (resolve, reject) => {
//     var grid = document.getElementById('grid')
//     while (grid.firstChild) grid.removeChild(grid.firstChild)
//     resolve() }) }

function _hideGrid() {
  return new Promise( resolve => {
    let ƒ = document.querySelector('.grid-wrap')
    anime({ targets:  ƒ, 
            opacity:  0,
            duration: 240 + Math.random() * 320,
            easing:   _.sample(EASINGS),
            complete: resolve})})}

function _showGrid() {
  return new Promise( resolve => {
    let ƒ = document.querySelector('.grid-wrap')
    // ƒ.style.transform =  `translateX(${window.innerWidth})`
    // ƒ.style.opacity   =  1
    anime({ targets:  '.grid-wrap', 
            opacity: 1, 
            duration: 240 + Math.random() * 320,
            easing:   _.sample(EASINGS),
            complete: resolve})})}

function _update() {
  let grid = document.getElementById('grid')
  if(!grid) return

  let items = document.querySelectorAll('.grid-item')
  return _hideGrid()
    .then( () => _gridResize(items))
    .then( () => scroll(0, 0))

    // attach the neighbour data to each item
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

            if(itemsAbove.length > 0) item.setAttribute('data-above', JSON.stringify(_ids(itemsAbove)))
            if(itemsRight.length > 0) item.setAttribute('data-right', JSON.stringify(_ids(itemsRight)))
            if(itemsBelow.length > 0) item.setAttribute('data-below', JSON.stringify(_ids(itemsBelow)))
            if(itemsLeft.length  > 0) item.setAttribute('data-left',  JSON.stringify(_ids(itemsLeft))) 

            item.above  = itemsAbove
            item.right  = itemsRight
            item.below  = itemsBelow
            item.left   = itemsLeft
          }) )

    // split into lines
    .then( () => 
      _.reduce(items, (ρ, item) => {
        if(item.left.length === 0) ρ.push([item])
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
            let β  = util.boundingBox(ι),
                μ  = _.random(χ - (β.x + β.width)),
                δx = _.max([0, μ]),
                δy = _.random(0, 240)
                // δy = 0

            // set arrtibutes
            ι.δx = δx
            ι.δy = δy
            ι.setAttribute('data-x', δx)
            ι.setAttribute('data-y', δy)
            ι.style.transform = `translateX(${ δx }px) translateY(${ δy }px)`

            // update right hand side
            χ = β.x + δx }) }) )

    // adjust the padding
    .then( () =>  
      _.each(items, item => {
        item.style.paddingLeft    = `${_.random(_minPaddingX(), _maxPaddingX())}px`
        item.style.paddingRight   = `${_.random(_minPaddingX(), _maxPaddingX())}px`
        item.style.paddingTop     = `${_.random(_minPaddingY(), _maxPaddingY())}px`
        item.style.paddingBottom  = `${_.random(_minPaddingY(), _maxPaddingY())}px` 
      }))

    // set image shadow
    // .then( () =>  _.each(items, item => {
    //   item.querySelector('.content').setAttribute(_.sample(SHADOWS), 1)}) )

    // resize the text
    .then( () =>  _.each(items, item => {
      let text = item.querySelector('.text')
      if(!text) return
      text.style.fontSize = '48px'
      text.style.width = `${item.clientWidth}px` }) )

    // layout the text
    .then( () =>  {
      let promises  = _(items)
                        .map(items, item => {
                          if(!item.querySelector('.text')) return
                          return _adjustText(item)})
                        .compact()
                        .value()
      return Promise.all(promises)})

    // clean up the text
    .then( () =>  {
      let promises  = _(items)
                        .map(items, item => {
                          if(!item.querySelector('.text')) return
                          return _cleanupText(item)})
                        .compact()
                        .value()
      return Promise.all(promises)})
    
    // initialize the parallax
    .then( () =>  parallax.init(items))

    // click & hover
    .then( () => {

      let overlayId,
          over        = false,
          isMobile    = util.isMobile(),
            
          show        = item => _.delay(() => { 
                                    if(!over) return
                                    overlayId = item.getAttribute('id')
                                    overlay.set(item) }, 200),
  
          hide        = () => _.delay(() => {
                                  if(over) return
                                  overlayId = undefined
                                  overlay.remove()  
                                }, 200),
  
          toggle      = item => {     
                          if(item.getAttribute('id') === overlayId) {
                            overlay.remove() 
                            overlayId = undefined }
                          else {
                            overlay.set(item)
                            overlayId = item.getAttribute('id') }}

      _.each(items, item => {
        let content = item.querySelector('.content')
              
        if(isMobile)
          util.addEvent(content, 'click', () => toggle(item))
        else {
          util.addEvent(content, 'mouseenter', event => {
            over = true
            show(item) }) 

          util.addEvent(content, 'mouseleave', event => {
            over = false
            _.delay(hide, 200) 
          })}})})

    // adjust the top padding an position of the first item
    // so we have a realtive consistent first impression upon opening the page
    .then( () =>  {
        let ƒ = _.first(items)
        if(!ƒ) return
        let x = parseFloat(ƒ.getAttribute('data-x')),
            y = _.random(32, 128)
        ƒ.setAttribute('data-y', y)
        ƒ.style.transform   = `translateX(${ x }px) translateY(${ y }px)`
        ƒ.style.paddingTop  = 24 }) }

function update() {
  return _update().then(_showGrid)
}

function init() {
  return _update()
}

function show() {
  _showGrid()
}

export default { init, update, show }