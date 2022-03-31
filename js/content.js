// coding with restrictions on creativity will never bring the best for anyone
const HOST = 'localhost';
const isSecure = false;
const devmode = false;
const SERVER_URL = ( ( isSecure && !devmode ) ? 'https://' : 'http://' ) + HOST + ':7005/';

const resp = { //response object
  todo: '',
  data: undefined
};


const rulesChangedToken = 13437419;
const templateIN = {
  name: 'pv-text-details__left-panel',
  location: 'text-body-small inline t-black--light break-words',
  image: 'pv-top-card-section__photo',
  summary: 'pv-about-section', // reducing data overhead
  company: 'pv-profile-section experience-section ember-view', //data retrieved will be filled in experience_list
  experience_list: [],
  contact: {
    email: 'pv-contact-info__header'
  },
  skills: [],
  certifications: [],
  position: 'text-body-medium break-words'
  //  resume: "pv-top-card-section__summary-treasury" // working on it
};


const user = {
  name: '',
  url: '', //linkedin profile URL
  location: '', //current location
  summary: '', //about section
  image: undefined, // takes image else a dummy images
  experience_list: [ '', '' ], //takes company and school list
  contact: {
    email: '' //email if it exists
  },
  experience: [], // experience section : object
  education: [], //education section : object
  skills: [], //skills : string
  certifications: [], //certifications : object
  position: '',
  phone: '',
  websites: '',
  init() {

  },
  getName: function () {
    if ( document.getElementsByClassName( templateIN.name )[ 0 ] ) {
      let temp = document.getElementsByClassName( templateIN.name )[ 0 ];
      temp = temp.firstElementChild;
      this.name = temp.textContent.trim().split( '\n' )[ 0 ];
    } else {
      this.name = '';
    }
  },
  getPosition: function () {
    const element = document.getElementsByClassName( '.text-body-medium' )[ 0 ];
    if ( element ) {
      this.position = purifyString( element.textContent.trim() );
    }
  },
  getUrl: function () {
    this.url = location.href;
  },
  getLocation: function () {
    if ( document.getElementsByClassName( templateIN.location )[ 0 ] ) {
      let temp = document.getElementsByClassName( templateIN.location )[ 0 ].innerText;
      this.location = temp.trim();
    } else {
      this.location = '';
    }
  },
  getSummary: function () {
    if ( document.getElementsByClassName( templateIN.summary )[ 0 ] ) {
      let temp = document.getElementsByClassName( templateIN.summary )[ 0 ];
      temp = temp.firstElementChild.nextElementSibling;
      if ( temp )
        user.summary = purifyString( temp.textContent );
      else user.summary = '';
    } else {
      user.summary = '';
    }
  },
  getEmail: function () {
    if ( document.getElementsByClassName( templateIN.contact.email ) ) {
      let x = document.getElementsByClassName( templateIN.contact.email );

      let flag = 0;
      for ( let i = 0; i < x.length; i++ ) {
        if ( x[ i ].textContent.trim().toLowerCase() === 'email' ) {
          user.contact.email = x[ i ].nextElementSibling.textContent;
        }
        if ( x[ i ].textContent.trim().toLowerCase() === 'phone' ) {
          user.phone = x[ i ].nextElementSibling.textContent;
        }
        if ( x[ i ].textContent.trim().toLowerCase() === 'websites' ) {
          let string = [];
          const links = x[ i ].nextElementSibling.getElementsByTagName( 'a' );
          for ( let link of links ) {
            string += link.href + ' ';
          }
          user.websites = string.trim();
        }
      }
    }
  },

};


function SetupIframe( source ) {
  let iframe = document.createElement( 'iframe' );
  iframe = createIframe( iframe, source, 'slidermenuiframe' );
  styleIframe( iframe );
  return iframe;
}

function removeIframe( id, src ) {
  let newframe = SetupIframe( src );
  document.getElementById( id ).replaceWith( newframe );
  let frame = document.getElementById( id );
  toggle();
  return frame;
}

function createIframe( iframe, src, id ) {
  iframe.id = id;
  iframe.src = window.chrome.extension.getURL( src );
  return iframe;
}

function styleIframe( iframe ) {
  iframe.style.background = '#f7f7f7';
  iframe.style.height = '100%';
  iframe.style.width = '0px';
  iframe.style.position = 'fixed';
  iframe.style.top = '0px';
  iframe.style.right = '0px';
  iframe.style.zIndex = '9000000000000000000';
  //iframe.style.borderLeft = "5px solid #becde5";
  iframe.frameBorder = 'none';
  iframe.style.transition = '0.5s';
}

function appendIframe( iframe ) {
  document.body.appendChild( iframe ); //append to the current website
}

let iframe = undefined;
////////////////////////////////////////====== Definitions End Here ======/////////////////////////////////////////////
iframe = SetupIframe( './slider.html' );
appendIframe( iframe );


// Message listener for "Extraction"
window.chrome.runtime.onMessage.addListener( function ( msg, sender, sendResponse ) {
  if ( msg.todo === 'auto_extraction_notbutton' ) {
    let isReached = false;
    let count = 5;
    while ( !isReached ) {
      if ( count === 0 ) isReached = true;
      if ( !isReached ) {
        window.scrollTo( 0, document.body.scrollHeight / count );
        setTimeout( () => {
        }, 3000 );
        count--;
      }
    }
    window.scrollTo( 0, 0 );
    extraction(); //to add some spice
    window.addEventListener( 'scroll', extraction );
    //extraction function to extract the details from linkedin profile
  }
} );

function extraction() {

  let mtsname = document.getElementsByClassName( 'pv-top-card-v3--list' )[ 0 ];
  let mtslocation = document.getElementsByClassName( 'pv-top-card-v3--list' )[ 1 ];
  let mtscompany = document.getElementsByClassName( 'pv-top-card-v3--experience-list-item' )[ 0 ];
  let mtsschool = document.getElementsByClassName( 'pv-top-card-v3--experience-list-item' )[ 1 ];
  let mtsabout = document.getElementsByClassName( 'pv-about-section' )[ 0 ];
  let mtsexperience = document.getElementsByClassName( 'experience-section' )[ 0 ];
  let mtseducation = document.getElementsByClassName( 'education-section' )[ 0 ];
  let mtsskills = document.getElementsByClassName( 'pv-skill-categories-section' )[ 0 ];
  let mtscertifications = document.getElementById( 'certifications-section' );
  let mtsimg = document.getElementsByClassName( 'pv-top-card-section__photo' )[ 0 ];
  let nodesList = [ mtsname, mtslocation, mtscompany, mtsschool, mtsimg, mtsabout, mtsexperience, mtseducation, mtsskills, mtscertifications ];
  let nodeNames = [ 'name', 'location', 'company', 'school', 'propic', 'about', 'exp', 'edu', 'skills', 'certs' ];
  let classNames = [];

  if ( devmode ) {
    if ( mtsabout ) mtsabout.style = 'background-color: #70FF72';
    if ( mtsexperience ) mtsexperience.style = 'background-color: #70FF72';
    if ( mtseducation ) mtseducation.style = 'background-color: #70FF72';
    if ( mtsskills ) mtsskills.style = 'background-color: #70FF72';
    if ( mtscertifications ) mtscertifications.style = 'background-color: #70FF72';
    if ( mtsname ) mtsname.style = 'background-color: #70FF72';
    if ( mtslocation ) mtslocation.style = 'background-color: #70FF72';
    if ( mtscompany ) mtscompany.style = 'background-color: #70FF72';
    if ( mtsschool ) mtsschool.style = 'background-color: #70FF72';
  }
  for ( let i = 0; i < nodesList.length; i++ ) {
    if ( nodesList[ i ] )
      classNames.push( nodesList[ i ].className );

    if ( !nodesList[ i ] && devmode ) {
      console.error( nodeNames[ i ] + 'A node has either been removed from the document or not loaded yet.', );
      let tempX = document.getElementsByClassName( 'pv-content' )[ 0 ];
      tempX.style = 'background-color: #FF0F0F;';
    }
    if ( ( !localStorage[ nodeNames[ i ] ] || localStorage[ 'rulesChangedToken' ] !== rulesChangedToken ) && nodesList[ i ] ) {
      localStorage[ 'rulesChangedToken' ] = rulesChangedToken;
      localStorage[ nodeNames[ i ] ] = nodesList[ i ].className.trim();
    } else if ( localStorage[ nodeNames[ i ] ] && nodesList[ i ] ) {
      if ( localStorage[ nodeNames[ i ] ].trim() !== nodesList[ i ].className.trim() && devmode ) {
        console.warn( '\n\nClass name for ' + nodeNames[ i ] + ' has been changed form "' + localStorage[ nodeNames[ i ] ] + '" to  "' + nodesList[ i ].className + '"\n\n' );
      }
    }

  }


  user.getName();
  user.getUrl();
  user.getSummary();
  user.getLocation();
  user.getEmail();
  user.getPosition();

  resp.todo = 'auto_extraction';
  resp.data = user;
  resp.src = 'content.js';

  try {
    chrome.runtime.sendMessage( resp );
  } catch ( e ) {
  }
}


window.chrome.runtime.onMessage.addListener( function ( msg, sender, sendResponse ) {
  if ( msg.todo === 'toggle' ) {
    toggle();
  }

  if ( msg.todo === 'send_data_to_server' ) {
    const hr = new XMLHttpRequest();
    const url = SERVER_URL + 'recruitUser';
    const data = JSON.stringify( user );
    hr.onerror = function () {
      if ( hr.readyState === 4 )
        alert( 'Failed to connect with server. Try again.' );
    };
    hr.open( 'POST', url, true );
    hr.setRequestHeader( 'Content-type', 'application/json' );
    hr.send( data );
    hr.onreadystatechange = function () {
      if ( hr.readyState === 4 && hr.status === 200 ) {
        alert( '' );
        alert( 'Details successfully sent.' );
      }
    };
  }
} );


resp.todo = 'showPageAction';
resp.data = undefined;
window.chrome.runtime.sendMessage( resp );

function toggle() {
  if ( iframe.style.width === '0px' ) {
    iframe.style.width = '400px';
  } else {
    iframe.style.width = '0px';
  }
}

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


chrome.runtime.onMessage.addListener( function ( request, sender, sendResponse ) {
  // console.log("Hello how r u", request.data);
  if ( request.todo === 'sendToServer' ) {
    chrome.runtime.sendMessage( chrome.runtime.id, {
      todo: 'sendToServer',
      data: request.data
    }, () => {
    } );
    toggle();
  }
} );
