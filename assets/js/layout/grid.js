import dom      from '../common/dom'
import util     from '../common/util'
import overlay  from '../common/overlay'
import parallax from '../common/parallax'
import cells    from './cells'
import packing  from './bin-packing'

// retrieves the style properties required for calclulating the layout
function _gridStyle(grid) {
  return new Promise( resolve => {
    let style     = window.getComputedStyle(grid,null)
    // we need some extra delay for the style to load completely
    _.delay( () => {
      let rowStyle  = style.getPropertyValue('grid-auto-rows'),
          rowHeight = parseFloat(rowStyle) || 48,
          colStyle  = style.getPropertyValue('grid-template-columns'),
          numCols   = colStyle.split(' ').length,
          colWidth  = parseFloat(colStyle.split(' ')[0]),
          gridWidth = parseFloat(style.width)
      resolve({ rowHeight, numCols, colWidth, gridWidth } )}, 200)})}

function show() {
  console.log('show grid')
}

function update(Φ, gridStyle) {
  console.log('update grid')
  return new Promise(resolve => 
    cells.reset(Φ, gridStyle)
      .then(Φ => packing.pack(Φ, gridStyle))
      // .then(Φ => cells.jiggle(Φ, gridStyle))
      .then(Φ => cells.labels(Φ, gridStyle))
      .then(Φ => cells.update(Φ, gridStyle))
      .then(resolve))}

// mouse event handlers for grid item hovers
// dunno where else to put them
function _attachEventHandlers(Φ) {
  let overlayId,
      over        = false,
      isMobile    = util.isMobile(),
        
      show        = φ => _.delay(() => { 
                                if(!over) return
                                overlayId = φ.id
                                overlay.set(φ) }, 200),
      hide        = () => _.delay(() => {
                              if(over) return
                              overlayId = undefined
                              overlay.remove()  
                            }, 200),
      toggle      = φ => {     
                      if(φ.id === overlayId) {
                        overlay.remove() 
                        overlayId = undefined }
                      else {
                        overlay.set(φ)
                        overlayId = φ.id }}

  _.each(Φ, φ => {
    if(isMobile)
      util.addEvent(φ.frame, 'click', () => toggle(φ))
    else {
      util.addEvent(φ.frame, 'mouseenter', event => {
        over = true
        show(φ) }) 

      util.addEvent(φ.frame, 'mouseleave', event => {
        over = false
        _.delay(hide, 200) 
      })}})
  return Φ }

function init(options) {
  console.log('initializing grid')
  let self = this
  return new Promise( (resolve, reject) => {

    // initialize the options
    options = options || {}
    options = _.defaults(options, { container:  '#grid',
                                    items:      '.grid-item'})
  
    // get the grid container
    let container = dom.getElement(options.container)
    // if it ain't there: reject
    if(!container) reject('no grid')

    let items = document.querySelectorAll(options.items)

    _gridStyle(container)
      .then(gridStyle => {
        cells.init(items, gridStyle)
          .then(Φ => packing.pack(Φ, gridStyle))
          // .then(Φ => cells.jiggle(Φ, gridStyle))
          .then(Φ => cells.labels(Φ, gridStyle))
          .then(Φ => cells.update(Φ, gridStyle))
          .then(Φ => _attachEventHandlers(Φ))
          .then(Φ => parallax.init(Φ))
          .then(Φ => { self.update = _.partial(update, Φ, gridStyle); return Φ})
          .then(Φ => resolve(Φ))
      })
  })

  
}

export default { init, show }