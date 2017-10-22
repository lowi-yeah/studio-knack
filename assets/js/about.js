import _              from 'lodash'
import isMobile       from 'ismobilejs'
import anime          from 'animejs'
import initSlider     from './init-slider'

let TRANSITION_DURATION = 1000,
    EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']

function _mobile() { return (isMobile.phone || isMobile.seven_inch ) }

function _initTransitions() {
  let δ = _.random(800, 1600),
      ε = _.sample(EASINGS),
      ω = { targets:  '#about > header',
            height:   '320px',
            easing:   ε,
            duration: δ},
      α  = anime(ω) 

  // ω = { targets:        '#about > header > .wrap',
  //       'margin-left':  '96px',
  //       easing:         ε,
  //       duration:       δ}
  // α  = anime(ω) 

  ω = { targets:      '#about > header > .wrap > h1',
        'font-size':  '48px',
        easing:       ε,
        duration:     δ}
  α  = anime(ω) 

} 

function init() {
  let a = document.getElementById('about')
  if(!a) return

  _initTransitions()

  // resise elements
  let gallery = a.querySelector('.grid-item.gallery'),
      w       = _mobile() ? 100 : _.random(33, 81)
  gallery.style.width = `${w}%`

  _.defer(() => initSlider('#about .slider'))


  // let isotope   = new Isotope( '.about.grid', { itemSelector: '.grid-item',
  //                                               layoutMode:   'fitRows'})

  // console.log('_initAbout')
  // console.log('isotope', isotope)

    // // initialize the existing grid items. then re-layout
    // _.each(isotope.items, item => {
    //     let box     = item.element.getElementsByClassName('box')[0],
    //         content = box.getElementsByClassName('content')[0],
    //         caption = content.getElementsByClassName('overlay')[0]
    //                     .getElementsByClassName('text')[0]
    //     _sizeUp(item.element)
    //     _randomizePadding(box)
    //     _resizeCaption(caption)
    //     _initOverlay(content)})

  //   isotope.layout()
    
  }

export default {init: init}
