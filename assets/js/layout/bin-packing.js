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
  // console.log('φ', φ.id)
  console.log(φ.title)
  console.log(`\t rowStart: ${φ.rowStart}, colStart: ${φ.colStart}, rowSpan: ${φ.rowSpan}, colSpan: ${φ.colSpan}`)
  
  let η = _(φ.neighbours)
            .map((n, dir) => {
              if(!n) return 
              let ν = _.map(n.η, Ϟ => Ϟ.id).join(' ')
              return `${dir}: ${ν} (δ: ${n.δ})`})
            .compact()
            .value()
  console.log(`\t neighbours — ${η.join(' | ')}`)

  // console.log('\trowStart:',  φ.rowStart)
  // console.log('\trowSpan:',   φ.rowSpan)
  // console.log('\tcolStart:',  φ.colStart)
  // console.log('\tcolSpan:',   φ.colSpan)
  // console.log('\thidden:',    φ.hidden)
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


// update the traversal indices →↓
function update({x, y}, ς) { 
  x += 1
  if(x > ς[1]) { x = 1; y += 1 }
  return {x, y} }

function _place(φ, Φ, {Λ}) {

  // console.log('----')

  if(φ.hidden) return {Λ}

  let ς = Λ.shape,
      ω = {x: 1, y: 1},
      w = φ.colSpan,
      h = φ.rowSpan,
      success = false,
      candidate

  let dangerCounter = 0

  while(!success) {
    
    dangerCounter++
    if(dangerCounter > 1024) {
      console.log('something went horribly worng')
      break}

    // check if φ can fit into the current row
    let fitRow = ω.x + w <= ς[1] + 1
    if(!fitRow) { 
      ω = update(ω, ς)
      continue }
    else {
      candidate = Λ.lo(ω.y,ω.x).hi(h, w)
      setΛ(candidate)

      success = maxΛ(Λ) < 2
      if(!success) { 
        unsetΛ(candidate)
        ω = update(ω, ς) } } }

  φ.rowStart = ω.y
  φ.colStart = ω.x

  return {Λ} }

function pack(Φ, gridStyle) {
  // let startτ = performance.now()
  return new Promise(resolve => {
    let Λ = ndarray(new Uint8Array(gridStyle.numCols * 1024), [1024,gridStyle.numCols])

    _.reduce(Φ, (ρ, φ) => _place(φ, Φ, ρ), {Λ})

    _.defer(() => {
      _.each(Φ, φ => φ.neighbours = neighbours.all(φ, Φ))  
      _.each(Φ, φ => _inspect(φ))  

      
      resolve(Φ)
    })

    // _ascii(Λ, 128, gridStyle.numCols)
    // console.log(`packing finished. took ${Math.round(performance.now() - startτ)}ms`)
  })
}

export default { pack }