import anime  from 'animejs'
import util   from './util'

let ƒWrap, ƒLabels, ƒButton,
    isVisible = false

function _hideFilterBar() {
  let ww = ƒWrap.clientWidth,
      bw = ƒButton.clientWidth
  ƒWrap.style.transform = `translateX(${ww-bw}px)` }

function _showFilterBar() { ƒWrap.style.transform = `translateX(0px)`}

function _toggleFilterBar() {
  if(isVisible) _hideFilterBar()
  else _showFilterBar()
  isVisible = !isVisible }

function _initButton(){
  util.addEvent(ƒButton, 'click', _toggleFilterBar) // attach event handler
  _.defer(_hideFilterBar)                          // hide the filter bar upon startup
  // _.defer(_showFilterBar)
}

function init() { 
  ƒWrap   = document.getElementById('filter-wrap')
  ƒLabels = document.querySelectorAll('.text-wrap')
  ƒButton = document.getElementById('filter')
  if (!ƒWrap) return
  _initButton() } // initialize the filter button


export default { init: init }