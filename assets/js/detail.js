import '../sass/index.sass'

import {lory}   from 'lory.js'
// import overlay  from './common/overlay'
import util     from './common/util'
import pattern  from './common/pattern'
import curtain  from './common/curtain'
import images   from './common/images'
import logo     from './common/logo'
import menu     from './detail/menu'
import Worker   from 'worker-loader!./lib/knack.worker.js'
// import menu     from './article/menu'
// import infinite from './article/infinite-scroll'

function init() {

  // // get all links and check, whether they are internal or external
  // // do this here instead of in the HTML, as links can be set by datoCMS/markdown
  // // and there is no way of differentiating between external & internal links
  // let links = document.querySelectorAll('a[href]')
  // _.each(links, link => {
  //   let href     = link.getAttribute('href'),
  //       external = href.match(/https?\:\/\/.*/)

  //   if(external) {
  //     let icon = document.createElement('i')
  //     icon.classList.add('material')
  //     icon.classList.add('icon')
  //     icon.innerHTML = 'exit_to_app'
  //     link.setAttribute('target', '_blank')
  //     link.appendChild(icon) }})

  // // init the gallery blocks (if there are any…)
  // let galleries = document.querySelectorAll('.gallery.block')
  // _.each(galleries, gallery => {

  //   let slider = lory( gallery, { slidesToScroll: 1,
  //                                 infinite: true,
  //                                 enableMouseEvents: true,
  //                                 rewind: false })

  //   _.delay(() => util.startAnimation(0.2, slider.next), 4000)})


  // the hero image makes nuthin' but trouble
  // pin the hero frame size, so that the dissapearence of the broswer bar on 
  // mobile devices doesn't wreak havok.
  document.getElementById('hero-frame').style.height = `${window.innerHeight - 128}px`


  console.log('ready!')
  let worker = new Worker()
  images.init(worker).then(worker => { worker.terminate()})
  
  window.dawnPromise
    .then(()  => pattern.init())
    .then(()  => logo.init())
    .then(()  => menu.init())
    .then(() => {
      document.querySelector('.project.detail').style.opacity = 1
      console.log('Welcome!')})
    .then(()  => window.scrollTo(0, 1))
    .then(() => curtain.open({}))

  
}



document.addEventListener('DOMContentLoaded', init)