import _        from 'lodash'
import gradient from './common/gradient'

window.dawnPromise = 
  gradient.init()
    .then(() => {
      document.getElementById('whiteout').classList.add('invisible')
      document.getElementById('rainbow').classList.remove('invisible') })
