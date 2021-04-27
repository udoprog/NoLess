/*
	This module holds functions and objects which are useful for developing applications on Gnarf
*/

function print_r( object ) {
	var prints = object + "\n";
	
	for ( props in object ) {
		prints += "['" + props + "'] = " + object[props] + "\n";
	}
	
	var pre = document.createElement( "pre" );
	pre.appendChild( 
		document.createTextNode( prints )
	);
	document.body.appendChild( pre );
	
	return false;
}

function is_string( _string ) {
	if ( !_string ) {
		return false;
	}

	if ( !_string.length ) {
		return false;
	}

	if ( !_string.toLowerCase ) {
		return false;
	}

	return true;
}

function strToXml( xml_string ) {
	if ( window.DOMParser ){
		var xmlObj = new DOMParser().parseFromString( xml_string , "text/xml");
	} else if ( window.ActiveXObject ) {
		var wXml  = new ActiveXObject("Microsoft.XMLDOM");
		wXml.async = false;
		wXml.loadXML( xml_string );
		var xmlObj = wXml;
	}
	
	var xml = xmlObj.getElementsByTagName( "*" )[0];
	
	return xml;
}

function formToStr( formElement ) {
	var PATH = "./index.php";
	var INPUT_TAG = "INPUT";
	var TEXTA_TAG = "TEXTAREA";
	var INPUT_TYPE_VALID = /(text|button|hidden|password)/;
	
	var Post = "";
	
	var wChild = formElement.firstChild;
	do {
		var tName = ( wChild.tagName ) ? wChild.tagName.toUpperCase() : null ;	
		if ( !tName ) continue;
		
		switch( tName ) {
			case INPUT_TAG:
				/* Get and validate type. */
				var tType = ( wChild.type ? wChild.type.toLowerCase() : null );	
				if ( !tType ) break;
				if ( !INPUT_TYPE_VALID.exec( tType ) ) break;
				
				/* Get and validate name. */
				var tName = ( wChild.name ? wChild.name.toLowerCase() : null );	
				if ( !tName ) break;
				
				/* Get and validate value. */
				var tValue = ( wChild.value ? wChild.value : null );
				if ( !tValue ) break;
				
				Post += ( Post[0] ? '&' : '' ) + tName + "=" + tValue;
				break;
			case TEXTA_TAG:
				/* Get and validate name. */
				var tName = ( wChild.name ? wChild.name.toLowerCase() : null );	
				if ( !tName ) break;
				
				/* Get and validate value. */
				var tValue = ( wChild.value ? wChild.value : null );
				if ( !tValue ) break;
				
				Post += ( Post[0] ? '&' : '' ) + tName + "=" + escape( tValue );
				break;
		}
		
	} while( wChild = wChild.nextSibling );
	
	return Post;
}

/*	<object>Benchmark( void )</object>
 	<return>null</return>
 	<comment>
 		Benchmark testing.
 	</comment>
 	<latest_update>
 		24-11-06 01:02
 	</latest_update>
*/

Benchmark = new function() {
	this.initTime = null;
	this.endTime = null;
	this.results = -1;

/*		<function>init( void )</function>
	 	<return>true or false</return>
	 	<comment>
	 		Null
	 	</comment>
*/
	this.init = function() {
		if ( this.initTime ) {
			Verbose.push( this.end + " : Benchmark has already been initiated. Use " + this.end + " to stop." );
			return false;
		}

		if ( this.results >= 0 ) {
			Verbose.push( this.end + " : Benchmark has already been performed. Use " + this.getResults + " to get results.");
			return false;
		}

		this.initTime = new Date();
		return true;
	}; this.init.toString = function() { return "[Object Benchmark].init( void )" };

/*		<function>end( void )</function>
	 	<return>true or false</return>
	 	<comment>
	 		Send return with Verbose.push.
	 	</comment>
*/
	this.end = function() {
		if ( this.endTime ) {
			Verbose.push( this.end + " : Benchmark has already been initiated. Use " + this.end + " to stop." );
			return false;
		}

		if ( !this.initTime ) {
			Verbose.push( this.end + " : Benchmark has not been initiated. Use " + this.init + "." );
			return false;
		}

		this.endTime = new Date();
		
		Verbose.push( this.end + " : Results from benchmark = " + this.results + "ms." );
		
		return null;
	}; this.end.toString = function() { return "[Object Benchmark].end( void )" };

	this.toString = function() { return "[Object Benchmark]" };
	
	return null;
}