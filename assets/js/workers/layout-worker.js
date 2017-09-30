
//Listener for events of message type coming from main thread.
self.addEventListener('message', function(e) {

  // e.data.forEach( δ => {
  //   console.log('δ', δ)
   
  // })


  console.log('LAYOUT WORKER', e.data)
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