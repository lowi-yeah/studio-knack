import ndarray  from 'ndarray'
import cwise    from 'cwise'
import ops      from 'ndarray-ops'

import util       from '../common/util'
import neighbours from './neighbours'

function _ascii(Λ, rows, cols) {
  let slice = Λ.hi(rows, cols)

  console.log('shape:', Λ.shape)
  for(var i=0; i<slice.shape[0]; i++) {
    let s = `${i}:\t`
    for(var j=0; j<slice.shape[1]; j++) {
      let c = 'x'
      if(slice.get(i,j) === 0) c = '▯'
      if(slice.get(i,j) === 1) c = '▮'
      s += `${c} `
    }
    console.log(s)
  }
}

function _inspect(φ) {
  console.log('φ', φ.id)
  console.log('\trowStart:',  φ.rowStart)
  console.log('\trowSpan:',   φ.rowSpan)
  console.log('\tcolStart:',  φ.colStart)
  console.log('\tcolSpan:',   φ.colSpan)
  console.log('\thidden:',    φ.hidden)
  // console.log('\tpaddingTop:', φ.paddingTop)
  // console.log('\tpaddingRight:', φ.paddingRight)
  // console.log('\tpaddingBottom:', φ.paddingBottom)
  // console.log('\tpaddingLeft:', φ.paddingLeft)
  // console.log('\tratio:', φ.ratio)
  // console.log('\ttype:', φ.type)
}


let setΛ    = cwise( { args: ["array"], body: function(a) { a += 1 }}),
    unsetΛ  = cwise( { args: ["array"], body: function(a) { a -= 1 }}),
    maxΛ    = cwise( { args: ["array"],
                       pre:  function()  { this.max = 0 },
                       body: function(a) { if(a > this.max) this.max += a },
                       post: function()  { return this.max } })


function _place(φ, Φ, {Λ, x, y}) {

  // _inspect(φ)
  // console.log('----')

  if(φ.hidden) return {Λ, x, y}

  let ς = Λ.shape,
      w = φ.colSpan,
      h = φ.rowSpan,
      success = false,
      candidate,
      // update the traversal indices →↓
      update  = () => { x += 1; if(x > ς[1]-1) { x = 0; y += 1 }}

  let dangerCounter = 0

  while(!success) {
    
    dangerCounter++
    if(dangerCounter > 1024) {
      console.log('something went horribly worng')
      break}

    // check if φ can fit into the current row
    let fitRow = x + w <= ς[1]

    if(!fitRow) { update(); continue }
    else {
      candidate = Λ.lo(y,x).hi(h, w)
      setΛ(candidate)

      success = maxΛ(Λ) < 2
      if(!success) { 
        unsetΛ(candidate)
        update() } } }

  φ.rowStart = y+1
  φ.colStart = x+1

  φ.neighbours = neighbours.all(φ, Φ)

  return {Λ, x, y} }

function pack(Φ, gridStyle) {
  // let startτ = performance.now()
  return new Promise(resolve => {
    let Λ = ndarray(new Uint8Array(gridStyle.numCols * 1024), [1024,gridStyle.numCols]),
        x = _.random(0, gridStyle.numCols-1), 
        y = 0

    _.reduce(Φ, (ρ, φ) => _place(φ, Φ, ρ), {Λ, x, y})
    // _ascii(Λ, 128, gridStyle.numCols)
    // console.log(`packing finished. took ${Math.round(performance.now() - startτ)}ms`)
    resolve(Φ)
  })
}

export default { pack }