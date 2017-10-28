
import lunr from 'lunr'

let URL = '/lunr-knack.json',
    idx

function init(worker) {
  return new Promise(resolve => {
    worker.onmessage = function (event) {
      idx = lunr.Index.load(event.data)

      console.log('idx', idx)


      resolve(worker)
    }
    worker.postMessage({url: URL, type: 'json'})  
  })
  
}

function search(string) {
  console.log('search for', string)
  let searchResults = idx.search(string)
  console.log('searchResults', searchResults)

}

export default { init, search }