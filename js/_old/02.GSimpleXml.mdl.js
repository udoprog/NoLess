/*
BUGFIXES
08:23 2007-01-06 - G_SimpleXMLTextNode.INDEX_TAG was called G_SimpleXMLTextNode.INDEX and therefore caused major crashes. Remember to reset version!
*/

Grf_SimpleXML.NODE_ELEMENT				= 1;
Grf_SimpleXML.NODE_TEXT					= 3;

Grf_SimpleXML.DOM_TAG					= '%';

G_SimpleXMLAttr.INDEX_TAG				= '@';

G_SimpleXMLNode.XPATH_REGEX = /\/([a-zA-Z]+)/g;

G_SimpleXMLTextNode.IGNORE_TEXT_REGEX	= /^[\s]*$/;
G_SimpleXMLTextNode.INDEX_TAG			= '$';

/*
	To keep track of DOM attributes.
*/
function G_SimpleXMLAttr() {
	this.length = 0;
	this.attr = new Array();
	return this;
}

G_SimpleXMLAttr.prototype.load_attr = function( attr ) {
	if ( !attr ) return this;
	this.length = attr.length;
	if ( !this.length ) return this;
	
	for ( var i = 0 ; i < this.length ; i++ )
		this[ attr[i].nodeName ] = attr[i].nodeValue;
	
	return this;
};

G_SimpleXMLAttr.prototype.toString = function() { return "[Object G_SimpleXMLAttr]"; };

/*
	To keep track of DOM nodes.
*/

function G_SimpleXMLNode() {
	this[ G_SimpleXMLAttr.INDEX_TAG ] = null;		//To hold G_SimpleXMLAttr
	this[ G_SimpleXMLTextNode.INDEX_TAG ] = null;	//To hold G_SimpleXMLTextNode
} G_SimpleXMLNode.prototype.toString = function() { return "[Object G_SimpleXMLNode]"; };

G_SimpleXMLNode.prototype.spath = function( spath ) {
	var Node = this;
	
	while ( G_SimpleXMLNode.XPATH_REGEX.exec( spath ) ) {
		if ( Node[RegExp.$1] )
			Node = Node[RegExp.$1][0];
		else
			return false;
	}
	
	var response = Array();
	
	if ( Node['$'] ) response['$'] = unescape( Node['$'][0]['value'] );
	else response['$'] = false;
	if ( Node['%'] ) response['%'] = Node['%'];
	else response['€'] = false;
	
	return response;
}

function G_SimpleXMLTextNode() {
	this['value'] = null;
} G_SimpleXMLTextNode.prototype.toString = function() { return "[Object G_SimpleXMLTextNode]"; };

G_SimpleXMLTextNode.prototype.load_text = function( text ) {
	this['value'] = text;
	return this;
}

/*
	To utilise other objects.
*/

function Grf_SimpleXML() {
	
} Grf_SimpleXML.prototype.toString = function() { return "[Object Grf_SimpleXML]"; };

Grf_SimpleXML.prototype.load = function( xml ) {
	var wArray = new Array();
	var xml = xml;
	
	var sXMLNode = new G_SimpleXMLNode();
	
	do {
		if ( !xml ) break;
		
		var type = xml.nodeType;
		
		switch ( type ) {
			case Grf_SimpleXML.NODE_ELEMENT:
				var name = ( xml.tagName ) ? xml.tagName.toLowerCase() : null ;
				var attr = ( xml.attributes ) ? xml.attributes : null ;
				
				if ( !sXMLNode[ name ] ) sXMLNode[ name ] = new Array();
					var length = sXMLNode[ name ].length;
				
				sXMLNode[ name ][ length ] =								new Array();
				sXMLNode[ name ][ length ] =								new Grf_SimpleXML().load( xml.firstChild );
				sXMLNode[ name ][ length ][ G_SimpleXMLAttr.INDEX_TAG ] =	new G_SimpleXMLAttr().load_attr( attr );
				sXMLNode[ name ][ length ][ Grf_SimpleXML.DOM_TAG ]		=	xml;
				break;
			case Grf_SimpleXML.NODE_TEXT:
				var value = xml.nodeValue;
				
				if ( G_SimpleXMLTextNode.IGNORE_TEXT_REGEX.exec( value ) ) break;
				
				var tag = G_SimpleXMLTextNode.INDEX_TAG;
				
				if ( !sXMLNode[ tag ] ) sXMLNode[ tag ] = new Array();
					var length = sXMLNode[ tag ].length;
				
				sXMLNode[ tag ][ length ] =	new G_SimpleXMLTextNode().load_text( value );
				break;
		}
			
	} while ( xml = xml.nextSibling );
	
	return sXMLNode;
}

Grf_SimpleXML.prototype.load_text = function( xml_string ) {
	var xml = strToXml( xml_string );
	return new Grf_SimpleXML().load( xml );
}