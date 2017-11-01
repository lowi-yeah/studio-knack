import InfiniteScroll from 'infinite-scroll'

function init() {
  
  console.log('initialize infinite scroll')

  let s = new InfiniteScroll('#articles', {
                path: 'a.next',
                append: '.single',
                checkLastPage: true,
                
                // Loads and appends pages on intialization until scroll requirement is met.
                prefill: false,
                
                responseType: 'document',
                
                outlayer: false,
              
                // Sets the distance between the viewport to scroll area
                // for scrollThreshold event to be triggered.
                scrollThreshold: 400,
                
                // Sets scroller to an element for overflow element scrolling
                elementScroll: false,
                
                // Loads next page when scroll crosses over scrollThreshold
                loadOnScroll: true,
                
                // Set to 'push' to use history.pushState()
                // to create new history entries for each page change.
                // history: 'replace',
                
                // Updates the window title. Requires history enabled.
                historyTitle: false,
                
                // Displays status elements indicating state of page loading:
                // .infinite-scroll-request, .infinite-scroll-load, .infinite-scroll-error
                // status: '.page-load-status'
                status: undefined,
              
                onInit: undefined,
                // called on initialization
                // useful for binding events on init
                // onInit: function() {
                //   this.on( 'append', function() {...})
                // }
              
                debug: true })
}

export default { init }