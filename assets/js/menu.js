import {select}     from 'd3-selection'
import anime        from 'animejs'
import SVGMorpheus  from './lib/svg-morpheus'
import voronoi      from './voronoi'
import util         from './util'


let TRANSITION_DURATION = 1000,
    EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

let menu, navigation, contact

function _showMenu(morpheus) {
  morpheus.to('close')
  voronoi.show().then(() => {
  let τ = anime.timeline()
        τ.add({ targets:    navigation,
                              translateX: 0,
                              translateY: 0,
                              duration: _.random(320, 640),
                              easing: _.sample(EASINGS) }) 
        τ.add({ targets:    contact,
                              translateX: 0,
                              translateY: 0,
                              duration: _.random(320, 640),
                              easing: _.sample(EASINGS) })   
  })
  
}

function _hideMenu(morpheus) {
  morpheus.to('burger')
  let τ = anime.timeline(),
      δ = _.sample(['translateX', 'translateY']),
      ρ = δ === 'translateX' ?  _.sample([-navigation.clientWidth, navigation.clientWidth]) :
                                _.sample([-navigation.clientHeight, navigation.clientHeight]),
      ω = { targets:navigation,
            duration: _.random(240, 420),
            easing: _.sample(EASINGS) }

  ω[δ] = ρ

  τ.add({ targets: contact,
          translateX: 0,
          translateY: contact.clientHeight * 0.81,
          duration: _.random(240, 420),
          easing: _.sample(EASINGS) }) 

  τ.add(ω)
  
    console.log('then', τ)
    console.log('δ', δ)
    console.log('ρ', ρ)

  τ.finished.then( () => {
    console.log('then')
    voronoi.hide()
  })
}

function _initNavigation() {
  // init text
  let texts = navigation.querySelectorAll('a'),
      ww    = window.innerWidth

  _.each(texts, t => {
    let ƒs = util.fontSize(t),
        tw = t.clientWidth,
        r  = 0.81 * ww / tw 
    t.style.fontSize = `${ ƒs * r }px` })

  let δ = _.sample(['left', 'top']),
      ρ = _.sample(['-102%', '102%']),
      μ = select(navigation)
  if(δ === 'left') μ.style('transform', `translateX(${ρ})`)
  else μ.style('transform', `translateY(${ρ})`)}

function _initBack() {
  if (!document.querySelector('#logo')) return
  let tocOptions  = { iconId:   'narrow',
                      duration: 240,
                      rotation: 'none' },
      morpheus    = new SVGMorpheus('#logo', tocOptions)

  document.getElementById('logo').onclick = () => {
    if( morpheus._curIconId === 'burger') _showMenu(morpheus)
    if( morpheus._curIconId === 'close' ) _hideMenu(morpheus) }

  document.getElementById('logo').onmouseenter = () => morpheus.to('wide')
  document.getElementById('logo').onmouseleave = () => morpheus.to('narrow')
}

function _initToc() {
  let toc = document.getElementById('toc')
  if (!toc) return
  let tocOptions  = { iconId:   'burger',
                      duration: 400,
                      rotation: 'none' },
      morpheus    = new SVGMorpheus('#iconset', tocOptions)
  toc.style.display = 'flex'
  toc.onclick = () => {
    if( morpheus._curIconId === 'burger') _showMenu(morpheus)
    if( morpheus._curIconId === 'close' ) _hideMenu(morpheus) }
  return morpheus
}


function _initContact() {
  // init text
  let texts = document.querySelectorAll('.contact.section a'),
      ww    = window.innerWidth
  _.each(texts, t => {
    let ƒs = util.fontSize(t),
        tw = t.clientWidth,
        r  = 0.81 * ww / tw 
    t.style.fontSize = `${ ƒs * r }px`
    // t.style['line-height'] = `${ 0.81 * ƒs * r }px`
    t.style['line-height'] = `0.8`

  })

  select(contact).style('transform', 'translateY(102%)')
}

function init() {
  menu        = document.getElementById('menu'),
  navigation  = menu.querySelector('.navigation')
  contact     = menu.querySelector('.contact')
  
  if(!menu) return 

  select(menu).style('display', 'flex')

  _initBack()
  _initNavigation()
  _initContact()
  
  let morpheus  = _initToc()
  this.open     = _.partial(_showMenu, morpheus)
  this.close    = _.partial(_hideMenu, morpheus)

  // this.open()
}


export default { init }

