import SVGMorpheus from './lib/svg-morpheus'

function _openSidebar(morpheus) {
  morpheus.to('close')
  document.getElementById('sidebar').classList.add('visible')}

function _closeSidebar(morpheus) {
  morpheus.to('burger')
  document.getElementById('sidebar').classList.remove('visible')}

function _initBack() {
  if (!document.querySelector('#logo')) return
  let tocOptions  = { iconId:   'narrow',
                      duration: 240,
                      rotation: 'none' },
      morpheus    = new SVGMorpheus('#logo', tocOptions)

  document.getElementById('logo').onclick = () => {
    if( morpheus._curIconId === 'burger') _openSidebar(morpheus)
    if( morpheus._curIconId === 'close' ) _closeSidebar(morpheus) }

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
    if( morpheus._curIconId === 'burger') _openSidebar(morpheus)
    if( morpheus._curIconId === 'close' ) _closeSidebar(morpheus) }

  return morpheus
}

// function _initSidebar() {
  // let ς = document.querySelector('#sidebar')
  // if (!ς) return }

function init() {
  _initBack()
  let morpheus = _initToc()
  this.open = _.partial(_openSidebar, morpheus)
  this.close = _.partial(_closeSidebar, morpheus)
}


export default {init}

