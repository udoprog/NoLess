/*
	SimpleXml 0.5 Beta
	Written By John-John Tedro (pentropia at gmail dot com)
	
	Concept: SimpleXml is originally a oncept developed related to PHP.
	I realised that the simplicity of SimpleXml is something that would be greatly
	appreciated when writing pages with DOM relying content because compared to the
	DOM traversal functionality that is mostly focused on portability. SimpleXml is
	focusing on accessing the correct content you are seaking with as few lines of
	code as possible.
	
	Example.xml:
		var xmlString = "<root>	"
+ "			<child attr="value">"
+ "				<subchild>		" 
+ "					content		"
+ "				</subchild>		"
+ "			</child>			"
+ "			<child>				"
+ "				<subchild>		"
+ "					content		"
+ "				</subchild>		"
+ "			</child>			"
+ "		</root>";
		
		var sxe = SimpleXml.str2Sxe( xmlString );
		
		// first Subchild could be accessed the following way.
		// '$' simply means 'access all textnodes' contained in element.
		alert( sxe.root[0].child[0].subchild[0].$[0][value] );
		
		// To access child's attribute 'attr' value
		alert( sxe.root[0].child[0]['@']['attr'] );
		
		// You can still axxess the original DOM by using '%':
		alert( sxe.root[0]['%'] );
		
		//! spath ! experimental, may change without notice.
		//spath 'simplepath' is used to in a simple way access certain elements.
		//example:
		alert( sxe.spath("/root/child/subchild")['$'] );
		// would alert the value of the 'first' subchild nestled in the 'first' child node in root.
		
	TODO:
	Code is all messy, got to clean it properly.
	spath method is experimantal, 
	
	
*/

/*
	To keep track of DOM attributes.
*/
var SimpleXmlAttr = {
	__name: "SimpleXmlAttr",
	__constructor: function() {
		this.length = 0;
		this.attr = new Array();
	},
	load_attr: function( attr ) {
		if ( !attr ) return this;
		this.length = attr.length;
		if ( !this.length ) return this;
		
		for ( var i = 0 ; i < this.length ; i++ )
			this[ attr[i].nodeName ] = attr[i].nodeValue;
		
		return this;
	},
	toString: function() { return "[Class SimpleXmlAttr]"; }
}
Class.create( SimpleXmlAttr );
/*
	To keep track of DOM nodes.
*/

var SimpleXmlNode = {
	XPATH_REGEX: /\/([a-zA-Z\_]+)/g,

	__name: "SimpleXmlNode",
	__constructor: function() {
		this[ SimpleXml.tags.ATTR ] = null;
		this[ SimpleXml.tags.TEXT ] = null;
	},
	spath: function( spath ) {
		var Node = this;
		
		while ( this.XPATH_REGEX.exec( spath ) ) {
			if ( Node[RegExp.$1] )
				Node = Node[RegExp.$1][0];
			else {
				Node = null;
				break;
			}
		}
		
		var textTag = SimpleXml.tags.TEXT;
		var domTag = SimpleXml.tags.DOM;
		var attrTag = SimpleXml.tags.ATTR;
		
		var sxeSpathCollection = {
			'$': ( $TxT( Node[ domTag ] ) ? $TxT( Node[ domTag ] ) : false ),
			'%': ( Node[ domTag ] ? Node[ domTag ] : false ),
			'@': ( Node[ attrTag ] ? Node[ attrTag ] : false ),
			'sxe': Node,
			toString: function() { return "[Object SimpleXmlSpathCollection]"; }
		}
		
		return sxeSpathCollection;
	},
	toString: function() { return "[Class SimpleXmlNode]"; }
}; Class.create( SimpleXmlNode );

var SimpleXmlTextNode = {
	__name: "SimpleXmlTextNode",
	__constructor: function() {
		this.value = null;
	},
	load_text: function( text ) {
		this.value = text;
		return this;
	},
	toString: function() { return "[Class SimpleXmlTextNode]"; }
}; Class.create( SimpleXmlTextNode );
/*
var Collection = {
	length: 0,
	__name: "Collection",
	toString: function() { return "[Object Collection]"; },
	push: function( object ) {
		this[ this.length++ ] = object;
		return this;
	},
	pop: function() {
		delete this[ this.length-- ];
		return this;
	}
}; Class.create( Collection );*/

/*
	To utilise other objects.
*/

var SimpleXml = {
	IGNORE_TEXT_REGEX: /^[\s]*$/,
	types: {
		TEXT: 3,
		ELEMENT: 1
	},
	tags: {
		TEXT: '$',
		DOM: '%',
		ATTR: '@'
	},
	load: function( xml ) {
		var wArray = new Array();
		var xml = xml;
		
		var sxNode = new SimpleXmlNode();
		
		do {
			if ( !xml ) break;
			
			var type = xml.nodeType;
			
			switch ( type ) {
				case SimpleXml.types.ELEMENT:
					var name = ( xml.tagName ) ? xml.tagName.toLowerCase() : null ;
					var attr = ( xml.attributes ) ? xml.attributes : null ;
					
					if ( !sxNode[ name ] ) sxNode[ name ] = new Array();
						var length = sxNode[ name ].length;
					
					sxNode[ name ][ length ] =					new Array();
					sxNode[ name ][ length ] =					SimpleXml.load( xml.firstChild );
					sxNode[ name ][ length ][ SimpleXml.tags.ATTR ] =	new SimpleXmlAttr().load_attr( attr );
					sxNode[ name ][ length ][ SimpleXml.tags.DOM  ] =	xml;
					break;
				case SimpleXml.types.TEXT:
					var value = xml.nodeValue;
					
					if ( SimpleXml.IGNORE_TEXT_REGEX.exec( value ) ) break;
					
					var tag = SimpleXml.tags.TEXT;
					
					if ( !sxNode[ tag ] ) sxNode[ tag ] = new Array();
						var length = sxNode[ tag ].length;
					
					sxNode[ tag ][ length ] = new SimpleXmlTextNode().load_text( value );
					break;
			}
		} while ( xml = xml.nextSibling );
		
		return sxNode;
	},
	str2Sxe: function( xml_string ) {
		var xml = Make.strToXml( xml_string );
		return this.load( xml );
	}
};