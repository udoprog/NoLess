
/* XmlHttp Response constants */
XHRes = new Object();
XHRes.ID_QUALIFIER = "_response";
XHRes.OUTPUT_TYPE_ERROR = "1";
XHRes.OUTPUT_TYPE_INFO = "2";
XHRes.OUTPUT_TYPE_NO_OUTPUT = "100";

/* XmlHttp Request constants */
XHReq = new Object();
XHReq.ID_QUALIFIER = "_request";
XHReq.POST_FLAG = "XHF";

GRF_XH = new Object();
GRF_XH.OK = 200;
GRF_XH.NOT_FOUND = 404;
GRF_XH.INTERNAL_SERVER_ERROR = 505;

var Grf_XmlHttp = function( id ) {
 	this.id = id;
 	this.type = "[Object Grf_SimpleXML]";
 	this.requests = null;
	
	this.flags = 0;
}; Grf_XmlHttp.prototype.toString = function() { return "[Gnarf's XmlHttp Object] : " + this.id };
	
	Grf_XmlHttp.prototype.setXHF = function( flags ) {
		this.flags = flags;
		return this;
	};
	
	Grf_XmlHttp.prototype.execute = function( url , post , orscMethod ) {
		this.gxhreq = new G_XHReq( this );
		this.gxhreq.setXHF( this.flags );
		this.gxhreq.init( url , post , orscMethod );
		return this;
	}; 

/*
	G_XHRes
	Handles the response you hopefully get from an XmlHttp Request.
*/
var G_XHRes = function( grf_XmlHttpRequest ) {
	if ( !( grf_XmlHttpRequest instanceof G_XHReq ) ) {
		/* Some kind of error */
		return false;
	}

	this.id = grf_XmlHttpRequest.id + XHRes.ID_QUALIFIER;

	var xhreq = grf_XmlHttpRequest.xhreq;
	
	this.rs = xhreq.readyState;
	
	if ( this.rs == 4 ) {
		this.text =		xhreq.responseText;
		this.status =	xhreq.status;
	} else {
		this.text =		null;
		this.status =	null;
	}
	
	this.sXML = null;
	
	return this;
}; G_XHRes.prototype.toString = function() { return "[Gnarf's XmlHttpResponse Object]" + " : " + this.id ; };

	G_XHRes.prototype.loadSXMLText = function() {
		this.sXML = new Grf_SimpleXML().load_text( this.text );
		return this;
	}
	
	G_XHRes.prototype.forEachOutput = function( outputParser ) {
		if ( outputParser )
			this.forEachOutputParser = outputParser;
		
		this.sXML = new Grf_SimpleXML().load_text( this.text );
		
		var root = this.sXML.root[0];
		
		if ( !root.o ) return false;
		for ( var i = 0 ; i <= root.o.length ; i++ ) {
			if ( i != root.o.length )
				var sxe = root.o[i];
			else var sxe = false;
			
			if ( !this.forEachOutputParser( sxe ) )
				break;
		}
		
		return this;
	};
	
	G_XHRes.prototype.forEachOutputParser = function( sxe ) {
		if ( !sxe ) {
			return false;
		}
		
		var type = sxe.spath( "/t" );
		
		switch( type ) {
			case XHRes.OUTPUT_TYPE_ERROR:
				var content = sxe.spath( "/c" );
				alert( "ERROR:\n" + content );
				break;
			case XHRes.OUTPUT_TYPE_INFO:
				var content = sxe.spath( "/c" );
				alert( "INFO:\n" + content );
				break;
			case XHRes.OUTPUT_TYPE_NO_OUTPUT:
				var content = sxe.spath( "/c" );
				alert( "NO OUPUT:\n" + content );
				break;
		}
		
		return true;
	};

/*
	G_XHReq
	Is used to create and handle XmlHttpRequests.
*/
var G_XHReq = function( grf_XmlHttpInst ) {
	if ( !( grf_XmlHttpInst instanceof Grf_XmlHttp ) ) {
		/* Some kind of error */
		return false;
	}

	this.id = grf_XmlHttpInst.id + XHReq.ID_QUALIFIER;
	this.xhreq = this.createXmlHttpRequest();
	this.flags = 0;
	
	return this; 
}; G_XHReq.prototype.toString = function() { return "[Gnarf's XmlHttpRequest Object]" + " : " + this.id; };
	
	/* Methods */
	
	G_XHReq.prototype.setXHF = function( flags ) {
		this.flags = flags;
		return this;
	};
	
	G_XHReq.prototype.init = function( url , post , orscMethod ) {
		var self = this;
		this.xhreq.onreadystatechange = function( xhreq ) {
			var xhres = new G_XHRes( self );
			orscMethod( xhres );
		};
		this.xhreq.open( "POST" , url , true );
		
		/* header content-type is important for servers to recognise post variables. */
		this.xhreq.setRequestHeader(
			'content-type' ,
			'application/x-www-form-urlencoded'
		);
		
		/* set request flags */
		
		var post = XHReq.POST_FLAG + "=" + this.flags + ( post ? "&" + post : "" );
		
		this.xhreq.send( post );
		
		return this;
	};
	
	G_XHReq.prototype.createXmlHttpRequest = function() {
		return ( window.XMLHttpRequest ) ? new XMLHttpRequest() : ( window.ActiveXObject ) ? new ActiveXObject("Microsoft.XMLHTTP") : null ;
	};
	
	/* sdohteM */