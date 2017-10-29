import _              from 'lodash'
import anime          from 'animejs'
import {scaleLinear}  from 'd3-scale'
import {randomNormal} from 'd3-random'
import {parseSVG, 
        makeAbsolute} from 'svg-path-parser'

import gradient from './gradient'
import pattern  from './pattern'
import util     from './util'
import dom      from './dom'

// let EASINGS = ['linear', 'easeInQuad', 'easeInCubic', 'easeInQuart', 'easeInQuint', 'easeInSine', 'easeInExpo', 'easeInCirc', 'easeInBack', 'easeOutQuad', 'easeOutCubic', 'easeOutQuart', 'easeOutQuint', 'easeOutSine', 'easeOutExpo', 'easeOutCirc', 'easeOutBack', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutQuint', 'easeInOutSine', 'easeInOutExpo', 'easeInOutCirc', 'easeInOutBack']
let EASINGS     = ['linear', 'easeInOutQuad', 'easeInOutCubic', 'easeInOutQuart', 'easeInOutSine'],
    // viewbox of the logo svg is: '0 0 1920 809.4'
    BASEWIDTH   = 1920

function _getRatio() {
  let ww = window.innerWidth,
      kw = knackBase.getBoundingClientRect().width
  return ww/kw }

function _title(str) {
  return str.replace(/\b\S/g, function(t) { return t.toUpperCase() });
}

// we cannot use a simple resize, because the logo is a clipping path and
// normal svg scaling of such paths is not supported in all browsers
// instead, we need to parse the 'd' attribute of all strings and scale them directly
function _resize(width, baseCommands) {
  let σ     = width/BASEWIDTH,
      δx    = 16,
      δy    = 16

  console.log('width', width)
  console.log('baseCommands', baseCommands)

  _.each(baseCommands, ζ => {
    let c = _.map(ζ.commands, command => {
                let result = {}
                result.code = command.code
                switch(command.code){
                  case ('C'): 
                    result.x   = δx + (σ * command.x)
                    result.x1  = δx + (σ * command.x1)
                    result.x2  = δx + (σ * command.x2)
                    result.y   = δy + (σ * command.y)
                    result.y1  = δy + (σ * command.y1)
                    result.y2  = δy + (σ * command.y2)
                    break
                
                  case 'H': 
                    result.x   = δx + (σ * command.x)
                    break
                
                  case 'L': 
                    result.x   = δx + (σ * command.x)
                    result.y   = δy + (σ * command.y)
                    break
                
                  case 'M': 
                    result.x   = δx + (σ * command.x)
                    result.y   = δy + (σ * command.y)
                    break
                
                  case 'S': 
                    result.x   = δx + (σ * command.x)
                    result.x2  = δx + (σ * command.x2)
                    result.y   = δy + (σ * command.y)
                    result.y2  = δy + (σ * command.y2)
                    break
                
                  case 'V': 
                    result.y   = δy + (σ * command.y)
                    break
                
                  case 'Z': break }
                  // console.log('result', result)
                return result
                }),
        d = _.map(c, command => {
                switch(command.code){
                  case 'C': return `C${command.x1},${command.y1},${command.x2},${command.y2},${command.x},${command.y}`
                  case 'H': return `H${command.x}`
                  case 'L': return `L${command.x},${command.y}`
                  case 'M': return `M${command.x},${command.y}`
                  case 'S': return `S${command.x2},${command.y2},${command.x},${command.y}`
                  case 'V': return `V${command.y}`
                  case 'Z': return 'Z'}}).join('')
    ζ.path.setAttribute('d', d)
  })
  
}

function setText(baseCommands, text) {
  document.getElementById('logo-sub').textContent = _title(text)
  document
    .getElementById('logo-rect')
    .setAttribute('clip-path', `url(#${baseCommands.id})`)
  _resize( 200, baseCommands )
}

function removeText(baseCommands) {
  document.getElementById('logo-sub').textContent = ''
  document
    .getElementById('logo-rect')
    .setAttribute('clip-path', `url(#${baseCommands.id})`)

  // calculate the logo size
  let padding = 2 * 16,
      button  = 48,
      width   = _.min([window.innerWidth - padding - button, 800])
  _resize( width, baseCommands )
}


function init(text) {
  return new Promise( resolve => {

    let twoLinePaths      = document.querySelectorAll('#twoline-logo path'),
        twoLineCommands   = _.map(twoLinePaths, path => {
                                let commands = parseSVG(path.getAttribute('d'))
                                makeAbsolute(commands)
                                return {path, commands}}),
        oneLinePaths      = document.querySelectorAll('#oneline-logo path'),
        oneLineCommands   = _.map(oneLinePaths, path => {
                                let commands = parseSVG(path.getAttribute('d'))
                                makeAbsolute(commands)
                                return {path, commands}})

    twoLineCommands.id = 'twoline-logo'
    oneLineCommands.id = 'oneline-logo'
    
    this.setText    = _.partial(setText, oneLineCommands)
    this.removeText = _.partial(removeText, twoLineCommands)

    // upon init check whether we're at the index page (render big logo),
    // or whether we're at a sub-page (render small logo with texts)
    let pageType = document.getElementById('wrap').getAttribute('data-type')
    if(pageType && !_.isEqual(pageType, 'index') ) setText(oneLineCommands, pageType)
    else removeText(twoLineCommands)
    
    resolve() })}

export default {init, setText, removeText}