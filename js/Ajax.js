/*Run = {	instances: Array(),		each: function() {		instances[ instances.length ]		return false;	},	append: function( method ) {		instances[ instances.length ] = method;		return false;	}}*/
function ArgException( msg ) {	this.name = "Argument Exception";	this.message = msg;		return this;}function InvalidException( msg ) {	this.name = "Invalid Variable Exception";	this.message = msg;		return this;}var Ajax = {
	PENDING: [],
		/* Constants */	METHOD_GET: "get",	METHOD_POST: "post",	METHOD_DEFAULT: "post",		/* Errors */	ERROR_METHOD_NOT_IMPLEMENTED:	"Specified method cannot be implemented",	ERROR_NO_METHOD:				"Method not specified",	ERROR_NO_URL:					"@Url not specified",	ERROR_URL_TYPE:					"@Url not of type 'String'",	ERROR_NO_COLLECTION:			"@Collection not specified",	ERROR_COLLECTION_TYPE:			"@Collection not of type 'Object'",		state: {		UNINITIALISED: 0,		LOADING: 1,		HEADERS_RECIEVED: 2,		BODY_RECIEVED: 3,		COMPLETE: 4	},		status: {		OK: 200,		NOT_FOUND: 404,		INTERNAL_SERVER_ERROR: 500	},		/* Methods */	send: function( url , collection ) {
		var url = url;
				if ( !url )						throw new ArgException( this.ERROR_NO_URL );		if ( !(typeof( url ) == "string") )		throw new ArgException( this.ERROR_URL_TYPE );		if ( !collection )					throw new ArgException( this.ERROR_NO_COLLECTION );		if ( !(collection instanceof Object) )	throw new ArgException( this.ERROR_COLLECTION_TYPE );				var method =		( ( collection.method && collection.method.toLowerCase() ) || this.METHOD_DEFAULT || "" );					var parameters =	( collection.parameters		|| collection.params || "" );		var notify =		( collection.notify	|| false );		var states =		( collection.states		|| /4/ );		var uri = url + parameters;
		
		if ( Try.ifValid( Ajax.PENDING[ uri ] ) && Ajax.PENDING[ uri ] ) {
			throw new Error( "pending request to same url, aborting" );
		} else {
			Ajax.PENDING[ uri ] = true;
		}
				var request = Try.each(			function() { return new ActiveXObject("Microsoft.XMLHTTP") },			function() { return new XMLHttpRequest() }		)				if ( notify )	request.onreadystatechange = function() {			if ( states.test( request.readyState ) ) {				var complete = ( request.readyState == Ajax.state.COMPLETE );				var response = {					text:		( ( complete && request.responseText )	|| null ),					status:	( ( complete && request.status )		|| 0 ),					rs:		request.readyState,					toString:	function() { return "[Object AjaxResponse]"; }				}
				if ( complete )	Ajax.PENDING[ uri ] = false;				notify( response );			}			return false;		};					if ( method == this.METHOD_GET )			url += "?" + arguments;				request.open( method , url , true );				switch ( method ) {			case this.METHOD_POST:				request.setRequestHeader( 'content-type' , 'application/x-www-form-urlencoded' );				break;			case this.METHOD_GET:				arguments = null;				break;			case null:				throw new Error( this.ERROR_NO_METHOD );				break;			default:				throw new Error( this.ERROR_METHOD_NOT_IMPLEMENTED );				break;		}				request.send( parameters );		return {
			stop: function() {
				request.close();
			}
		};	},		toString: function() { return "[Object Ajax]"; }};/*	Demonstration*/