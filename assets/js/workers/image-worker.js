import request from '../lib/request'

function b64EncodeUnicode(str) {
    // first we use encodeURIComponent to get percent-encoded UTF-8,
    // then we convert the percent encodings into raw bytes which
    // can be fed into btoa.
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,
        function toSolidBytes(match, p1) {
            return String.fromCharCode('0x' + p1);
    }));
}

//Listener for events of message type coming from main thread.
self.addEventListener('message', function(e) {

  // let Δ = e.data
  // console.log('image worker got message:', urls)

  e.data.forEach( δ => {
    console.log('δ', δ)
    request.image(δ.url).then( ι => {
      self.postMessage({ ι: b64EncodeUnicode(ι), id: δ.id })
    })
  })


  // console.log('this', this)
  // console.log('request', request)
  // console.log('self', self)
  // //colorArray : is satatic array of hexa color.
  // var colorArray = ["d0efb1","9dc3c2","4d7298"];
  // //initializes the counter.
  // var cp = e.data;
  // //used to iterate the execution of instructions in each 1000 seconds.
  // setInterval(function(){
  //   //Send the message back to main thread.
  //   self.postMessage(colorArray[cp]);
  //   cp++;
  //   if(cp == colorArray.length ){
  //     cp = 0;
  //   }
  //  }, 1000);
   
}, false);