import dom      from '../common/dom'
import util     from '../common/util'
import parallax from '../common/parallax'
import curtain  from '../common/curtain'
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
    cells.reset(Φ)
      .then(Φ => packing.pack(Φ, gridStyle))
      .then(({Φ, Λ}) => {
        cells.labels(Φ, Λ)
          .then(() => cells.update(Φ, gridStyle))
          .then(() => resolve(Φ))}))}   

// mouse event handlers for grid item hovers
// dunno where else to put them
function _attachEventHandlers(Φ) {
  let over        = false,
      isMobile    = util.isMobile(),
        
      show        = φ =>  { φ.caption.classList.add('active')
                            φ.image.classList.add('active')
                            φ.active = true },
      hide        = φ => {  φ.caption.classList.remove('active')
                            φ.image.classList.remove('active')
                            φ.active = false },
      toggle      = φ => {     
                      if(φ.active) hide(φ)
                      else show(φ) }

  _.each(Φ, φ => {
    if(isMobile)
      util.addEvent(φ.frame, 'click', () => toggle(φ))
    else {
      util.addEvent(φ.frame, 'mouseenter', event => show(φ)) 
      util.addEvent(φ.frame, 'mouseleave', event => hide(φ))
      util.addEvent(φ.frame, 'click', event => {
        console.log('clickedy click', φ.link)
        curtain.close({toCookie: true}).then(() => window.location = φ.link)
      })
    }})
  return Φ }

function _attachFilter(Φ) {
  return new Promise(resolve => {
    let filtered  = document.getElementById('wrap')
                      .getAttribute('data-type')
                      .toLowerCase() || 'index'
    Φ.filtered = filtered 
    resolve(Φ)})}

function init(options) {
  console.log('initializing grid')
  let self = this
  return new Promise( (resolve, reject) => {

    // initialize the options
    options = options || {}
    options = _.defaults(options, { container:  '#grid',
                                    items:      '.grid-item'})
  
    let container = dom.getElement(options.container),
        items     = document.querySelectorAll(options.items)

    // if the container ain't there: reject
    if(!container) reject('no grid')

    _gridStyle(container)
      .then(gridStyle => {
        _attachFilter([])
          .then(Φ => cells.init(Φ, items, gridStyle))
          .then(Φ => packing.pack(Φ, gridStyle))
          .then(({Φ, Λ}) => {
              cells.labels(Φ, Λ, gridStyle)
                .then(() => cells.update(Φ, gridStyle))
                .then(() => _attachEventHandlers(Φ))
                .then(() => parallax.init(Φ))
                .then(() => { self.update = _.partial(update, Φ, gridStyle); return Φ})
                .then(() => resolve(Φ))
            })
      })
  })
}

export default { init, show }