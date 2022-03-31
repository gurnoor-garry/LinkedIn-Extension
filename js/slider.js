var user2 = {
  name: '',
  url: '',
  location: '',
  image: undefined,
  summary: '',
  experience_list: [ '', '' ],
  contact: {
    email: ''
  },
  education: [],
  experience: [],
  skills: [],
  certifications: []
};

// Click event to toggle the slider using inframe button
document.getElementById( 'closebtn' ).addEventListener( 'click', function () {
  //closing the slider request sent
  chrome.tabs.query( {
    active: true,
    currentWindow: true
  }, function ( tabs ) {
    chrome.tabs.sendMessage( tabs[ 0 ].id, {
      todo: 'toggle'
    } );
  } );
} );

// auto extracted profile data onMessage receiver
chrome.runtime.onMessage.addListener( function ( msg, sender, sendResponse ) {
  if ( msg.todo === 'auto_extraction' ) {
    user2 = msg.data;
    sessionStorage.setItem( 'details', JSON.stringify( {
      name: purifyString( user2.name ),
      email: purifyString( user2.contact.email ),
      description: purifyString( user2.summary ),
      url: purifyString( user2.url ),
      currentLocation: purifyString( user2.location ),
      position: user2.position
    } ) );
    let uname = getById( 'uname' );
    let url = getById( 'url' );
    let loc = getById( 'location' );
    let email = getById( 'email' );
    let phone = getById( 'phone' );
    let summary = getById( 'summary' );
    let websites = getById( 'websites' );

    uname.value = user2.name.trim();
    url.value = user2.url.trim();
    loc.value = user2.location.trim();

    email.value = user2.contact.email.trim();

    email.value = user2.contact.email.trim();

    summary.value = user2.summary.trim();
    websites.value = user2.websites.trim();
    phone.value = purifyString( user2.phone ? user2.phone.split( '(' )[ 0 ].trim() : '' );

  }
  sendResponse( {
    msg: 'Success.EMR'
  } );
} );

// sendMessage for automatic extraction of the data from profile
chrome.tabs.query( {
  active: true,
  currentWindow: true
}, function ( tab ) {
  chrome.tabs.sendMessage( tab[ 0 ].id, {
    todo: 'auto_extraction_notbutton'
  } );
  chrome.tabs.onUpdated.addListener( function ( id, change ) {
    if ( change.url ) {
      chrome.tabs.sendMessage( tab[ 0 ].id, {
        todo: 'auto_extraction_notbutton'
      } );
    }
  } );
} );

function getById( id ) {
  return document.getElementById( id );
}

document.getElementById( 'submitDetails' ).addEventListener( 'click', function ( e ) {
  // console.log( sessionStorage.getItem( 'details' ) );
  const details = JSON.parse( sessionStorage.getItem( 'details' ) );
} );

function createElementManual( name, styleObj, href = '' ) {
  let ele = document.createElement( name );
  if ( href !== undefined || href !== '' )
    ele.setAttribute( 'href', href );
  return ele;
}


setTimeout( function () {
  document.getElementById( 'loader-section' ).style = 'display:none;';
  if ( document.getElementById( 'extractdatapage' ) )
    document.getElementById( 'extractdatapage' ).style = 'display:block;';
}, 100 );


function purifyString( string ) {
  string = string.replace( '...', '' );
  string = string.replace( /See More/g, '' );
  string = string.replace( /(Personal Website)/g, '' );
  string = string.replace( /see more/g, '' );
  string = string.replace( /See more/g, '' );
  string = string.replace( /\s+/g, ' ' );
  string = string.replace( /\r?\n|\r/, '' );
  string = string.trim();
  string = string.replace( /About/g, '' );
  string = string.replace( /about/g, '' );
  string = string.replace( '(', '' );
  string = string.replace( '(', '' );
  string = string.replace( ')', '' );
  string = string.replace( ')', '' );
  return string;
}

document.getElementById( 'userdetails' )
  .addEventListener( 'submit', function ( event ) {
    let form = document.getElementById( 'userdetails' );

    const payload = {
      name: form.elements[ 'uname' ].value,
      email: form.elements[ 'email' ].value,
      currentLocation: form.elements[ 'location' ].value,
      description: form.elements[ 'summary' ].value,
      location: form.elements[ 'location' ].value,
      url: form.elements[ 'url' ].value,
      mobileNumber: form.elements[ 'phone' ].value ? form.elements[ 'phone' ].value.split( '(' )[ 0 ].trim() : '',
      source: 'LinkedIn Extension',
      notes: {
        websites: form.elements['websites'].value.split(' ')
      }
    };
    console.log(payload);

    fetch( 'https://hrm.relinns.in/api/public/lead/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify( payload )
    } )
      .then( res => res.json() )
      .then( sendResponse )
      .catch( console.log("error") );

    chrome.tabs.query( {
      active: true,
      currentWindow: true
    }, function ( tab ) {
      tab.forEach( function ( t ) {
        chrome.tabs.sendMessage( t.id, {
          todo: 'sendToServer',
          data: payload
        } );
      } );
    } );
  } );
