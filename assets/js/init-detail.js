import _                from 'lodash'
import Draggabilly      from 'draggabilly'
import isMobile         from 'ismobilejs'
import initSlider       from './init-slider'

let selector = '.draggable'

export default function initDetail() {
  if(!document.querySelector(selector)) return
  new Draggabilly(selector, {})
  
  if(isMobile.phone) {
    document.querySelector(selector).style.left = 0
    document.querySelector(selector).style.top  = '84vh' } 
  else {
    document.querySelector(selector).style.left = _.random(64) + 'vh'
    document.querySelector(selector).style.top  = _.random(25, 81) + 'vh' }

  initSlider('.single .slider') }
