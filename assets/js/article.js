import '../sass/index.sass'

import {lory}   from 'lory.js'
// import overlay  from './common/overlay'
import util     from './common/util'
import pattern  from './common/pattern'
import curtain  from './common/curtain'
import images   from './article/images'
import menu     from './article/menu'
// import infinite from './article/infinite-scroll'

const LAYER_TOKEN   = 'pk.eyJ1IjoibG93aSIsImEiOiJjaXpyZnYwMHUwMDI2MnFzN21wNm1zeGF2In0.t4FHMAzcW-5SMIfKneu3YQ'
const ACCESS_TOKEN  = 'pk.eyJ1IjoibG93aSIsImEiOiJjajh4aXJwOHMxa3MxMzNyMHBhZGE0bnZ1In0.B6U7OjjTGl7oBB-3d1Vdsg'


function init() {

  images.init()  
  menu.init()
  pattern.init()

  // get all links and check, whether they are internal or external
  // do this here instead of in the HTML, as links can be set by datoCMS/markdown
  // and there is no way of differentiating between external & internal links
  let links = document.querySelectorAll('a[href]')
  _.each(links, link => {
    let href     = link.getAttribute('href'),
        external = href.match(/https?\:\/\/.*/)

    if(external) {
      let icon = document.createElement('i')
      icon.classList.add('material')
      icon.classList.add('icon')
      icon.innerHTML = 'exit_to_app'
      link.setAttribute('target', '_blank')
      link.appendChild(icon) }})

  // init the gallery blocks (if there are any…)
  let galleries = document.querySelectorAll('.gallery.block')
  _.each(galleries, gallery => {

    let slider = lory( gallery, { slidesToScroll: 1,
                                  infinite: true,
                                  enableMouseEvents: true,
                                  rewind: false })

    _.delay(() => util.startAnimation(0.2, slider.next), 4000)})


  // the hero image makes nuthin' but trouble
  // pin the hero frame size, so that the dissapearence of the broswer bar on 
  // mobile devices doesn't wreak havok.
  document.getElementById('hero-frame').style.height = `${window.innerHeight - 128}px`


  // infinite.init()
  
  window.dawnPromise
    .then(() => curtain.open({}))
    .then(() => {
      document.querySelector('.project.detail').style.opacity = 1
      document.getElementById('footer').style.display = 'flex'
      console.log('Welcome!')})
  
}



document.addEventListener('DOMContentLoaded', init)