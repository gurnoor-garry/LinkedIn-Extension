//recruiter's details object
const rekrut = {
  username: '',
  password: '',
  token: ''
};

// Github profile of Author
document.getElementById( 'author' ).addEventListener( 'click', function () {
  const goto = 'https://www.github.com/drakenwan';
  chrome.tabs.create( {
    url: goto
  } );
} );

// Click event to toggle the slider using inframe button
document.getElementById( 'closebtn' ).addEventListener( 'click', function () {
  chrome.tabs.query( {
    active: true,
    currentWindow: true
  }, function ( tabs ) {
    chrome.tabs.sendMessage( tabs[ 0 ].id, {
      todo: 'toggle'
    } );
  } );
} );

function getById( id ) {
  return document.getElementById( id );
}



setTimeout( function () {
  document.getElementById( 'loader-section' ).style = 'display: none;';
  if ( document.getElementById( 'loginsect' ) )
    document.getElementById( 'loginsect' ).style = 'display: block;';
}, 3000 );
