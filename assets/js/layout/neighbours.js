import util from '../common/util'

function _neighbours(φ, Φ, ꜰℕ) {
  let n = _.reduce(Φ, (ρ, ϑ) => {
              let δ = ꜰℕ(φ, ϑ)
              if(_.isNumber(δ) && δ <= ρ.δ && δ >= 0) { 
                ρ.δ = δ
                ρ.η.push(ϑ) }
              return ρ }, 
              { η: [], δ: Number.MAX_SAFE_INTEGER})
  if(n.η.length > 0) return n }

function _horizontalOverlap(φ, ϑ) {
  let left  = (ϑ.colStart + ϑ.colSpan <= φ.colStart),
      right = (φ.colStart + φ.colSpan <= ϑ.colStart)
  return !(left || right) 
}

function _verticalOverlap(φ, ϑ) {
  let top     = (ϑ.rowStart + ϑ.rowSpan <= φ.rowStart),
      bottom  = (φ.rowStart + φ.rowSpan <= ϑ.rowStart)
  return !(top || bottom) 
}


function above(φ, Φ) {
  // the compare function
  // checks whether the 'compared-to' item ϑ
  // is above the 'base-compare' item
  let ꜰℕ = (φ, ϑ) => { 
    // don't compare to iself
    if(φ.id === ϑ.id) return null
    let overlap = _horizontalOverlap(φ, ϑ)                  // do the items overlap horizontally?
    if(!overlap) return null                                // no they don't
    else return (φ.rowStart - (ϑ.rowStart + ϑ.rowSpan)) }   // indeed they do, and they're that far appart vertically
  return _neighbours(φ, Φ, ꜰℕ) }


function below(φ, Φ) {
  let ꜰℕ = (φ, ϑ) => { 
    if(φ.id === ϑ.id) return null
    let overlap = _horizontalOverlap(φ, ϑ)
    if(!overlap) return null      
    else return (ϑ.rowStart - (φ.rowStart + φ.rowSpan)) } 
  return _neighbours(φ, Φ, ꜰℕ) }

function left(φ, Φ) {
  let ꜰℕ = (φ, ϑ) => { 
    if(φ.id === ϑ.id) return null
    let overlap = _verticalOverlap(φ, ϑ)
    if(!overlap) return null     
    else return (φ.colStart - (ϑ.colStart + ϑ.colSpan)) }
  return _neighbours(φ, Φ, ꜰℕ) }

function right(φ, Φ) {
  let ꜰℕ = (φ, ϑ) => { 
    if(φ.id === ϑ.id) return null
    let εφ      = φ.itemExtent,
        εϑ      = ϑ.itemExtent,
        overlap = _verticalOverlap(φ, ϑ)
    if(!overlap) return null     
    else return (ϑ.colStart - (φ.colStart + φ.colSpan)) }
  return _neighbours(φ, Φ, ꜰℕ) }

function all(φ, Φ) {
  return {above:  above(φ, Φ),
          right:  right(φ, Φ),
          below:  below(φ, Φ),
          left:   left(φ, Φ) }}

export default { all, above, below, left, right }