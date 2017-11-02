import ndarray  from 'ndarray'
import cwise    from 'cwise'
import ops      from 'ndarray-ops'

import util       from '../common/util'

function _inspect(φ) {
  // console.log('φ', φ.id)
  console.log( φ.id, φ.title)
  console.log(`\t rowStart: ${φ.rowStart}, colStart: ${φ.colStart}, rowSpan: ${φ.rowSpan}, colSpan: ${φ.colSpan}`)
 
}


function ascii(Λ, rows, cols) {
  console.log('shape:', Λ.shape)
  for(var i=0; i<Λ.shape[0]; i++) {
    let s = `${i}:\t`
    for(var j=0; j<Λ.shape[1]; j++) s += `${Λ.get(i,j)} `
    console.log(s)
  }
}

let addΛ      = cwise( { args: ["array"], body: function(a) { a += 1 }}),
    subtractΛ = cwise( { args: ["array"], body: function(a) { a -= 1 }}),
    setΛ      = cwise( { args: ["array", "scalar"], body: function(a, s) { a = s }}),
    maxΛ      = cwise( { args: ["array"],
                         pre:  function()  { this.max = 0 },
                         body: function(a) { if(a > this.max) this.max += a },
                         post: function()  { return this.max } })

function growꜰℕsꜰℕ(Λ){
  return  { 
            // upwards:    α => {  let γ = _.clone(α)
            //                     γ.y0 = _.max([γ.y0 - 1, 0])
            //                     return γ },
            rightwards: α => {  let γ = _.clone(α)
                                γ.x1 = _.min([γ.x1 + 1, Λ.shape[1]])
                                return γ },
            downwards:  α => {  let γ = _.clone(α)
                                γ.y1 = _.min([γ.y1 + 1, Λ.shape[0]])
                                return γ },
            leftwards:  α => {  let γ = _.clone(α)
                                γ.x0 = _.max([γ.x0 - 1, 0])
                                return γ } }}

function moveꜰℕsꜰℕ(Λ){
  return  { 
            // upwards:    α => {  let γ = _.clone(α),
            //                         h = α.y1 - α.y0 
            //                     γ.y0 = _.max([γ.y0 - 1, 0])
            //                     γ.y1 = γ.y0 + h
            //                     return γ },
            rightwards: α => {  let γ = _.clone(α),
                                    w = α.x1 - α.x0
                                γ.x1 = _.min([γ.x1 + 1, Λ.shape[1]])
                                γ.x0 = γ.x1 - w 
                                return γ },
            downwards:  α => {  let γ = _.clone(α),
                                    h = α.y1 - α.y0 
                                γ.y1 = _.min([γ.y1 + 1, Λ.shape[0]])
                                γ.y0 = γ.y1 - h
                                return γ },
            leftwards:  α => {  let γ = _.clone(α),
                                    w = α.x1 - α.x0
                                γ.x0 = _.max([γ.x0 - 1, 0])
                                γ.x1 = γ.x0 + w
                                return γ } }}

function _slice(area, Λ) { return Λ.hi(area.y1, area.x1).lo(area.y0, area.x0) }

// update the traversal indices →↓
// of an area α
function _update(α, Λ) { 
  let w = α.x1 - α.x0
  α.x0 += 1
  α.x1 += 1

  if(α.x1 > Λ.shape[1]) { 
    α.x0  = 0 
    α.y0 += 1
    α.x1  = w 
    α.y1 += 1 }
  return α }

function _offsetY({x, y}) { 
  y += _.random(2, 6)
  return {x, y} }

function _place(φ, Φ, ι, {Λ}) {
  if(φ.hidden) return {Λ}

  let α = { x0: 0, x1: φ.colSpan, y0: 0, y1: φ.rowSpan},
      dangerCounter = 0, αΛ

  while(true) { // obacht
    dangerCounter++
    if(dangerCounter > 1024) {
      console.warn('something went horribly worng')
      return {Λ} }

    // get the slice
    αΛ = _slice(α, Λ)
    // and check whether the cell fits
    addΛ(αΛ)
    if(maxΛ(Λ) < 2) { 
      φ.rowStart = α.y0 + 1
      φ.colStart = α.x0 + 1
      return {Λ} 
    } else {
      subtractΛ(αΛ)
      α = _update(α, Λ) }} // continue…
  return {Λ} }



function _randomSeed(φ, Λ, ι) {

  // prevent endless recursion
  if(ι > 64) return null
  if(Λ.shape[1] === 1) return null

  let dir = _.sample(['right', 'left']),
      // dir = _.sample(['top', 'right', 'left', 'bottom']),
      x0, x1, y0, y1
  switch (dir) {
      case 'top':
        // random 1x1 area along the top edge
        x0 = _.random(φ.colStart, φ.colStart + φ.colSpan - 1)
        x1 = x0 + 1
        y0 = φ.rowStart - 2
        y1 = y0 + 1
        break
      case 'right':
        // random 1x1 area along the right edge
        x0 = φ.colStart + φ.colSpan - 1,
        x1 = x0 + 1
        y0 = _.random(φ.rowStart, φ.rowStart + φ.rowSpan - 1)
        // y0 = _.random(φ.rowStart + 1, φ.rowStart + φ.rowSpan - 2)
        // y0 = φ.rowStart + _.random(0, 3)
        y1 = y0 + 1
        break
      case 'left':
        // random 1x1 area along the right edge
        x0 = φ.colStart - 2,
        x1 = x0 + 1
        y0 = _.random(φ.rowStart, φ.rowStart + φ.rowSpan - 1)
        // y0 = _.random(φ.rowStart + 1, φ.rowStart + φ.rowSpan - 2)
        // y0 = φ.rowStart + _.random(0, 3)
        y1 = y0 + 1
        break
      case 'bottom':
        // random 1x1 area along the top edge
        x0 = _.random(φ.colStart, φ.colStart + φ.colSpan - 1)
        x1 = x0 + 1
        y0 = φ.rowStart + φ.rowSpan - 1
        y1 = y0 + 1
        break
    }
  
  // try again
  if(x0 < 0 || x1 > Λ.shape[1]) return _randomSeed(φ, Λ, ι++)
  return  { x0, y0, x1, y1 } }

// recursive helper function for growing a random area
// area:  an area of the grid, represented by the corners {x0, y0, x1, y1}
// Λ:     the ndArray representing our grid
function _grow(area, Λ) {
  // pick a random direction
  let growꜰℕs     = growꜰℕsꜰℕ(Λ),
      growꜰℕ      = _(growꜰℕs).values().sample(),

      // apply the grow-in-that-direction-fuction to the area
      // growths resizes the given area by 1 in the chosen direction
      // (if the grid-dimensions allow it)
      grownArea   = growꜰℕ(area)

  // check if the area has grown at all
  if( _equalAreas(area, grownArea) ) return area

  // get the corresponding slice from the grid
  let areaΛ       = _slice(grownArea, Λ)
  // area++
  addΛ(areaΛ)   

  // success means that we have not caused an overlap by growing the area
  let success = maxΛ(Λ) < 2
  if(success) { 
    // if we were successful, we clean up after ourselves and keep growing
    subtractΛ(areaΛ)
    return _grow(grownArea, Λ) } 
  else {
    // if not, we still clean up after ourselves and return the smaller inoffensive area
    subtractΛ(areaΛ)
    return area } }

// φ: the cell whose label shall be places
// Λ: the ndArray representing our grid, 
// ρ: the reduce result, 
// ι: the iteration index
function _randomArea(φ, Λ, ρ) {
  // grow a random area 
  // by first selecting a random seed along the edge of the cell
  let seed    = _randomSeed(φ, Λ, 0)
  if(_.isNil(seed)) return ρ

  // and then growing it…
  let area    = _grow(seed, Λ),

      // check how big the result is
      width   = area.x1 - area.x0,
      height  = area.y1 - area.y0,
      size    = width * height
  if(ρ.size < size) {
    ρ.width  = width
    ρ.height = height
    ρ.size   = size,
    ρ.area   = area }
  return ρ }

function _equalAreas(α0, α1) {
  return α0.x0 === α1.x0 && α0.x1 === α1.x1 && α0.y0 === α1.y0 && α0.y1 === α1.y1
}

function _jiggle(Φ, Λ) {
  return new Promise( resolve => {
    let moveꜰℕs = moveꜰℕsꜰℕ(Λ)
    _(12)
      .range()
      .each( ι => {
        _(Φ)
          .shuffle()
          .each(φ => {
            let x0 = (φ.colStart - 1), 
                x1 = x0 + φ.colSpan, 
                y0 = (φ.rowStart - 1), 
                y1 = y0 + φ.rowSpan, 
                α  = {x0, x1, y0, y1},
                ꜰℕ = _(moveꜰℕs).values().sample(),
                μα = ꜰℕ(α), 
                αΛ = _slice(α, Λ), 
                μΛ = _slice(μα, Λ)

                if( _equalAreas(α, μα) ) return
    
                subtractΛ(αΛ)
                addΛ(μΛ)
                if(maxΛ(Λ) < 2) { 
                  // success. update the cell
                  φ.colStart = μα.x0 + 1
                  φ.rowStart = μα.y0 + 1
                } else {
                  subtractΛ(μΛ)
                  addΛ(αΛ) }})})
    resolve({Φ, Λ}) })}

function placeLabel(φ, Λ) {
  if(φ.hidden) return

  // we need to find an area in the for the label that is close to it's cell (φ)
  // and provides enough space to accomodate the text
  
  // the way we search for an area is more of a shotgun approch and thus pretty inefficient.
  // But this does't really matter, because a: we don't have a whole lot of data in our ndArray, 
  // b: we don't need an optimal result but some result that works,
  // and c: ndArray is supposed to real quick.

  // we give our search many tries and eventually pick the 'best' one
  let iterations  = 64,               // the number of tries
      result      = { width:  0,      // our reduce result
                      height: 0,
                      size:   0,
                      area:   {x0: -1, y0: -1, x1: 0, y1: 0}}
  _(iterations)
    .range()
    .reduce((ρ,ι) => _randomArea(φ, Λ, ρ), result)

      // the resulting area comes from the ndArray and is thus 0-index-based
      // the css grid however is 1-index-based
      // adjust accordingly…
  let rowStart    = result.area.y0 + 1,
      rowSpan     = result.area.y1 - result.area.y0,
      colStart    = result.area.x0 + 1,
      colSpan     = result.area.x1 - result.area.x0,

      // after we have found a place, claim it on the grid
      // and for good measure, make it larger by 1 in each direction
      largerArea  = {x0: _.max([result.area.x0 - 1, 0]),
                       y0: _.max([result.area.y0 - 1, 0]),
                       x1: _.min([result.area.x1 + 1, Λ.shape[1]]), 
                       y1: _.min([result.area.y1 + 1, Λ.shape[0]])},
      areaΛ       = _slice(largerArea, Λ)
    setΛ(areaΛ, 1)   

  return {rowStart, rowSpan, colStart, colSpan} }

function pack(Φ, gridStyle) {
  return new Promise(resolve => {
    let numLines = _.size(Φ) * 48,
        Λ = ndarray(new Uint8Array(gridStyle.numCols * numLines), [numLines,gridStyle.numCols])
    _.reduce(Φ, (ρ, φ, ι) => _place(φ, Φ, ι, ρ), {Λ})
    _jiggle(Φ, Λ)
      .then(() => resolve({Φ, Λ})) })}

export default { pack, placeLabel, ascii }