const devmode = false;
let manifest = chrome.runtime.getManifest();
let appName = manifest.name;
let appVersion = manifest.version;
//running on app reload
chrome.runtime.onInstalled.addListener( function () {

} );

//checking for pagAction request
chrome.runtime.onMessage.addListener( function ( request, sender, sendResponse ) {
  if ( request.todo === 'showPageAction' ) {
    chrome.tabs.query( {
      active: true,
      currentWindow: true
    }, function ( tabs ) {
      try {
        chrome.pageAction.show( tabs[ 0 ].id );
      } catch ( e ) {
      }
    } );
  }
} );
chrome.runtime.onMessage.addListener( function ( request, sender, sendResponse ) {
  console.log("How are u", request.data);
  if ( request.todo === 'sendToServer' ) {
    chrome.runtime.sendMessage( {
      todo: 'toggle'
    } );
    // fetch( 'https://chat.googleapis.com/v1/spaces/AAAAVCW7wWk/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=TIn-4IwkxeeRKW_ucRPHt0NVDO9WDifwIlne8b61-RE%3D', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify( {
    //     text: `*New Profile*\n\n*Name*: ${request.data.name}\n*Email*: ${request.data.email}\n*Mobile*: ${request.data.mobileNumber}\n*Location*: ${request.data.currentLocation}\n\n*Summary*: ${request.data.description}\n\n*Url*: ${request.data.url}`
    //   } )
    // } )
      // .then( res => res.json() )
      // .then( sendResponse )
      // .catch( console.log );
      console.log("Hello How are u");
    fetch( 'https://hrm.relinns.in/api/public/lead/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( request.data )
    } )
      .then( res => res.json() )
      .then( sendResponse )
      .catch( console.log("error") );
  }
} );

/* request to toggle slider whenever extension icon clicked
 */
chrome.pageAction.onClicked.addListener( function () {
  chrome.tabs.query( {
    active: true,
    currentWindow: true
  }, function ( tabs ) {
    chrome.tabs.sendMessage( tabs[ 0 ].id, {
      todo: 'toggle'
    } );
  } );
} );

chrome.runtime.onMessage.addListener( function ( req, sender, sendResponse ) {
  if ( req.method === 'getLS' )
    sendResponse( {
      ls: localStorage[ 'token' ]
    } );
  else
    sendResponse( {
      ls: undefined
    } );
} );
