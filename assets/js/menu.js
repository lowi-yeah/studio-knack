import SVGMorpheus  from './lib/svg-morpheus'
import voronoi      from './voronoi'

let sidebar

function _showSidebar(morpheus) {
  morpheus.to('close')
  voronoi.show()
}

function _hideSidebar(morpheus) {
  morpheus.to('burger')
  voronoi.hide()
}

function _initBack() {
  if (!document.querySelector('#logo')) return
  let tocOptions  = { iconId:   'narrow',
                      duration: 240,
                      rotation: 'none' },
      morpheus    = new SVGMorpheus('#logo', tocOptions)

  document.getElementById('logo').onclick = () => {
    if( morpheus._curIconId === 'burger') _showSidebar(morpheus)
    if( morpheus._curIconId === 'close' ) _hideSidebar(morpheus) }

  document.getElementById('logo').onmouseenter = () => morpheus.to('wide')
  document.getElementById('logo').onmouseleave = () => morpheus.to('narrow')
}

function _initToc() {
  if (!document.querySelector('#toc')) return
  let tocOptions  = { iconId:   'burger',
                      duration: 400,
                      rotation: 'none' },
      morpheus    = new SVGMorpheus('#iconset', tocOptions)
  document.getElementById('toc').onclick = () => {
    if( morpheus._curIconId === 'burger') _showSidebar(morpheus)
    if( morpheus._curIconId === 'close' ) _hideSidebar(morpheus) }
  return morpheus
}

// function _initSidebar() {
  // let ς = document.querySelector('#sidebar')
  // if (!ς) return }

function init() {
  sidebar = document.getElementById('sidebar')
  if(!sidebar) return 

  _initBack()
  
  let morpheus  = _initToc()
  this.open     = _.partial(_showSidebar, morpheus)
  this.close    = _.partial(_hideSidebar, morpheus)
  
  // _.defer(() => {_showSidebar(morpheus)}) 
}


export default { init }

