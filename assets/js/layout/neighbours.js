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

function _horizontalOverlap(εφ, εϑ) {
  let left  = (εϑ.x1 <= εφ.x0),
      right = (εφ.x1 <= εϑ.x0)
  return !(left || right) }

function _verticalOverlap(εφ, εϑ) {
  let top     = (εϑ.y1 <= εφ.y0),
      bottom  = (εφ.y1 <= εϑ.y0)
  return !(top || bottom) }

function above(φ, Φ) {
  // the compare function
  // checks whether the 'compared-to' item ϑ
  // is above the 'base-compare' item
  let ꜰℕ = (φ, ϑ) => { 
    // don't compare to iself
    if(φ.id === ϑ.id) return null
    let εφ      = φ.itemExtent,
        εϑ      = ϑ.itemExtent,
        overlap = _horizontalOverlap(εφ, εϑ)
    // do the items overlap horizontally?
    if(!overlap) return null        // no they don't
    else return (εφ.y0 - εϑ.y1) }   // indeed they do, and they're that far appart vertically
  return _neighbours(φ, Φ, ꜰℕ) }

function below(φ, Φ) {
  let ꜰℕ = (φ, ϑ) => { 
    if(φ.id === ϑ.id) return null
    let εφ      = φ.itemExtent,
        εϑ      = ϑ.itemExtent,
        overlap = _horizontalOverlap(εφ, εϑ)
    if(!overlap) return null      
    else return (εϑ.y0 - εφ.y1) } 
  return _neighbours(φ, Φ, ꜰℕ) }

function left(φ, Φ) {
  let ꜰℕ = (φ, ϑ) => { 
    if(φ.id === ϑ.id) return null
    let εφ      = φ.itemExtent,
        εϑ      = ϑ.itemExtent,
        overlap = _verticalOverlap(εφ, εϑ)
    if(!overlap) return null     
    else return (εφ.x0 - εϑ.x1) }
  return _neighbours(φ, Φ, ꜰℕ) }

function right(φ, Φ) {
  let ꜰℕ = (φ, ϑ) => { 
    if(φ.id === ϑ.id) return null
    let εφ      = φ.itemExtent,
        εϑ      = ϑ.itemExtent,
        overlap = _verticalOverlap(εφ, εϑ)
    if(!overlap) return null     
    return (εϑ.x0 - εφ.x1) }
  return _neighbours(φ, Φ, ꜰℕ) }

function all(φ, Φ) {
  return {above:  above(φ, Φ),
          right:  right(φ, Φ),
          below:  below(φ, Φ),
          left:   left(φ, Φ)}}

export default { all, above, below, left, right }