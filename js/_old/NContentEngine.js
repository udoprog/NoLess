/** Javascript Module - OCSE

TODO:
	foreach iteration

 */

var tmpObject = null;

var NContentEngine = {
	execute: function( sourceRoot , targetRoot ) {
		return NContentEngine.parse( sourceRoot , targetRoot );
	},
	parse: function( domSrc , domTarget ) {
		var domSrc = domSrc.cloneNode( true );
		var domTarget = domTarget;
		
		Make.domIterator(
			domSrc.ownerDocument , 
			function( node ) {
				node.setAttribute( "test" , "sug" );
			}
		);
		
		Make.siblingIterator(
			domSrc.firstChild , 
			function( node , document ) {
				domTarget.appendChild( node );
			}
		);
		
		return false;
	},
	buildNElement: function( node ) {
		var Wnode = node;
		
		switch ( node.tagName.toLowerCase() ) {
			case "link": 
				alert( "link" );
				break;
		}
		
		return false;
	},
	buildNElementEvent: function( node ) {
		
		switch ( node.tagName.toLowerCase() ) {
			case "link":
			
				alert( "link" );
			
				function aClick( e ) {
					e.preventDefault();
					alert( "click" );
					return false;
				}
				
				break;
		}
		
		return false;
	}
}


