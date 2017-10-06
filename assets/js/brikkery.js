// import Bricks
// import Bricks from 'bricks.js'
// var MyWorker = require("worker-loader!./file.js");

// create an instance
let sizes = [ { columns: 2, gutter: 0 },
              { mq: '768px', columns: 3, gutter: 0 },
              { mq: '1024px', columns: 4, gutter: 0 } 
              ],
    β

function init() {
  β = Bricks({ 
    container: '#grid',
    packed: 'data-packed',
    sizes: sizes
  })
  β.pack()

}
export default { init }