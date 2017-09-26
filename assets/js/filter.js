import anime  from 'animejs'
import util   from './util'

let ƒWrap, ƒLabels, ƒButton,
    isVisible = false


function _click(e) {
  e.preventDefault()
  let ι = this.querySelector('input[type=checkbox]')
  console.log('click', ι)
  ι.checked = !ι.checked
}

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
  _.defer(_hideFilterBar)}                          // hide the filter bar upon startup

function init() { 
  ƒWrap   = document.getElementById('filter-wrap')
  ƒLabels = document.querySelectorAll('label.filter')
  ƒButton = document.getElementById('filter')
  if (!ƒWrap) return

  _initButton()  

  // console.log('init filter') 
  // console.log('ƒWrap', ƒWrap) 
  // console.log('ƒLabels', ƒLabels) 

  _.each(ƒLabels, (ƒl) => util.addEvent(ƒl, 'click', _click))
}

export default { init: init }