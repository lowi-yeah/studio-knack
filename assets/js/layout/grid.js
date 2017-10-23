import dom  from '../common/dom'
import util from '../common/util'

import cells from './cells'

// retrieves the style properties required for calclulating the layout
function _gridStyle(grid) {
  let style     = window.getComputedStyle(grid,null),
      rowStyle  = style.getPropertyValue('grid-auto-rows'),
      rowHeight = parseFloat(rowStyle),
      colStyle  = style.getPropertyValue('grid-template-columns'),
      numCols   = colStyle.split(' ').length,
      colWidth  = parseFloat(colStyle.split(' ')[0])
  return { rowHeight, numCols, colWidth } }

function _cellStyle(cell) {
  let style     = window.getComputedStyle(cell,null),
      colStart  = style.gridColumnStart,
      colEnd    = style.gridColumnEnd
  // return { rowHeight, numCols, colWidth } 

  console.log('cell', cell.getAttribute('id'))
  console.log('colStart', colStart)
  console.log('colEnd', colEnd)
  return style
}

// create line segments from the items by means of their neighbour information
// function _lineup(Φ) {
//   let _next = φ => φ.neighbours.right ? φ.neighbours.right.η : null
//   return new Promise( resolve => 
//     resolve(_.reduce(Φ, (ρ, φ) => {
//               if(!φ.neighbours.left) {
//                 let ℓ = [φ],
//                     η = _next(φ)
//                 while(η) {
//                   console.log('n', η)
//                   ℓ.push(η)
//                   η = _next(η) }
//                 ρ.push(ℓ) }
//               return ρ }, [])))}

// function _distributeLines(ℒ, {numCols}) {
//   let w = window.innerWidth,
//       ȴ = console.log('numCols', numCols),
//       ρ = _.map(ℒ, ℓ => 
//             new Promise( resolve => {
//               console.log('line', ℓ)
//               let n         = _.size(ℓ),
//                   lineWidth = _.reduce(ℓ, (ρ, φ) => ρ += φ.colSpan, 0),
//                   remainder = numCols - lineWidth
//               console.log('numCols', numCols)
//               console.log('lineWidth', lineWidth)
//               console.log('remainder', remainder)

//               resolve()
//             })) 
//   return Promise.all(ρ) }

function _distribute(Φ) {
  console.log('_distribute')

  _(Φ)
    // filter the cells that do not have a right neighbour
    .filter(φ => _.isNil(φ.neighbours.right))
    .map(φ => 
      new Promise( resolve => {
      console.log('φ', φ)
      let style = _cellStyle(φ.item)


      resolve()

      }))
    .value()
}

function show() {
  console.log('show grid')
}

function update() {
  console.log('update grid')
}

function init(options) {
  console.log('initializing grid')

  // initialize the options
  options = options || {}
  options = _.defaults(options, { container:  '#grid',
                                  items:      '.grid-item'})

  // get the grid container
  let container = dom.getElement(options.container),
      items     = document.querySelectorAll(options.items),
      gridStyle = _gridStyle(container)
  // check whether the grid container exists. exit if it doesn't
  if(!grid) {
    console.warn(`grid container '${options.container}' ain't there. Returning…`)
    return }

  cells.place(items, {gridStyle})
    .then(Φ => _distribute(Φ))
    // .then(ℒ => _distributeLines(ℒ, gridStyle))
}

export default { init, update, show }