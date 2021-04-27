/*
	Written By John-John Tedro
	Released under the GPL public license.
	Many thanks to the prototype framework, especially for the $() id function and Try.each ( Which is known as Try.these in Prototype )
*/

function $( id ) {
	return document.getElementById( id );
}

function $Tag( tag , doc ) {
	var doc = doc ? doc : document;
	return doc.getElementsByTagName( tag );
}

function $E( element_tag , element_class , element_id ) {
	var emt = document.createElement( element_tag );
	if ( element_class ) emt.className = element_class;
	if ( element_id ) emt.id = element_id;
	return emt;
}

function $T( text ) {
	return document.createTextNode( text );
}

function $Clear( target ) {
	try {
		var target = ( Try.ifString( target ) ? $( target ) : target );
		var replace = target.cloneNode( false );
		target.parentNode.replaceChild( replace , target );
	} catch ( e ) {
		return false;
	}
	
	return replace;
}

function $Remove( target ) {
	var parent = target.parentNode || target.ownerDocument || null;
	try {
		parent.removeChild( target );
	} catch ( e ) {
		throw e;
	}
	return true;
}

function $TxT( source , target , no_unescape ) {
	try {
		if ( Try.ifObject( source ) ) {
			var txt = source.textContent || source.text || source.innerHTML || "";
		} else if( Try.ifString( source ) ) {
			var txt = source;
		} else {
			throw new Error( "@source is of unsupported target" );
		}
		
		if ( !Try.ifValid( txt ) )	throw new Error( "could not get text content from $source object" );
		
		if ( !no_unescape ) txt = unescape( txt );
		
		if ( target ) {
			txt = Try.each(
				function () { return target.textContent = txt },
				function () { return target.innerHTML = txt }
			);
		}
	} catch( e ) {
		throw e;
	}
	
	if ( target )
		return target;
	else
		return txt;
}

function $Put( source , target )

function $Css( path , id ) {
	try {
		var head = $Tag( "head" ).item(0);
		
		var id = id || path;
		
		var cssElement;
		if ( cssElement = $( id ) ) {
			cssElement.setAttribute( "href" ,	path			);
		} else {
			cssElement = $E( "link"						);
			cssElement.setAttribute( "href" ,	path			);
			cssElement.setAttribute( "type" ,	"text/css"		);
			cssElement.setAttribute( "rel" ,	"stylesheet"	);
			cssElement.id = id;
		}
		
		head.appendChild( cssElement );
	} catch( e ) {
		throw e;
	}
	return cssElement;
}

/*
	$Selection under development, not certain if it is working atm.
*/

function $Selection() {
	
	function selection() {
		this.selection = Try.each(
			function() { return window.getSelection() },
			function() { return document.getSelection() },
			function() { return document.selection.createRange().text }
		)
		
		this.alerts = function() {
			return false;
		}
	}
	
	return new selection();
}

function $addEvent( element , evtColl ) {
	var element = element;
	var type = ( evtColl && evtColl.type );
	var notify = ( evtColl && evtColl.notify ) || function(){};
	var bubble = ( evtColl && evtColl.bubble ) || true;
	
	if ( !type ) throw new Error( "can't remove event without specifying type" );
	
	return Try.each(
		function() { return element.addEventListener( type , notify , bubble ); },
		function() { return element.attachEvent( "on" + type , notify ); }
	)
}

function $remEvent( element , evtColl ) {
	var element = element;
	var type = ( evtColl && evtColl.type );
	var notify = ( evtColl && evtColl.notify );
	var bubble = ( evtColl && evtColl.bubble ) || true;
	
	return Try.each(
		function() { return element.attachEventListener( type , notify , bubble ); },
		function() { return element.detachEvent( "on" + type , notify ); }
	)
}

/*
	Fx
*/

Fx = {
	hide: function( element ) {
		Try.each(
			function() {
				element.style.display = "none";
				return true;
			}
		)
	},
	unhide: function( element ) {
		Try.each(
			function() {
				element.style.display = "inline";
				return true;
			}
		)
	},
	switchVisible: function( element ) {
		if ( !element.style.display ) {
			element.style.display = "inline";
		} else {
			switch ( element.style.display ) {
				case "inline":
					Fx.hide( element );
					break;
				case "none":
					Fx.unhide( element );
					break;
			}
		}
		
		return false;
	}
}

/*
	Class
*/

var Class = {
	ERROR_NO_NAME: "Object construction missing critical property '__name'",
	ERROR_INVALID_EXTEND: "Type cannot extend a class",
	ERROR_INVALID_ABSTRACT: "Type cannot be abstracted",
	ERROR_OBJECT_IS_ABSTRACT: "Class abstract and can't be declared",
	ERROR_OBJECT_IS_DECLARED: "Class is already declared",
	IGNORE: {
		"toString": true,
		"__name": true,
		"__constructor": true,
		"__abstract": true
	},
	create: function() {
		for ( var i = arguments.length ; object = arguments[--i] ; ) {
			if ( object.__abstract ) throw new Error( this.ERROR_OBJECT_IS_ABSTRACT );
			if ( !object.__name ) throw new Error( this.ERROR_NO_NAME );
			
			/* Setting Constructor */
			if ( object.__constructor )	window[ object.__name ] = object.__constructor;
			else window[ object.__name ] =	function() {};
			
			/* Inhereting Methods and Properties */
			for ( props in object )	window[ object.__name ].prototype[ props ] = object[ props ];
			
			/* 'for in' loops doesn't catch 'toString' */
			if ( object.toString )	window[ object.__name ].prototype.toString = object.toString;
			
			/* Add extend on object level */
			window[ object.__name ].extend = this.extend;
			
			return false;
		}
		return false;
	},
	createAbstract: function( lambda ) {
		if ( !Try.ifValid( lambda ) ) return false;
		
		if ( Try.ifObject( lambda ) ) var object = lambda;
		else if ( Try.ifClass( lambda ) ) throw new Error( this.ERROR_OBJECT_IS_DECLARED );
		else throw new Error( this.ERROR_INVALID_ABSTRACT );
		
		object.__abstract = true;
		
		return true;
	},
	extend: function( lambda ) {
		if ( !Try.ifValid( lambda ) ) return false;
		
		if ( Try.ifObject( lambda ) ) var object = lambda;
		else if ( Try.ifClass( lambda ) ) var object = lambda.prototype;
		else throw new Error( this.ERROR_INVALID_EXTEND );
		
		for ( props in object )
			this.prototype[ props ] = object[ props ];
		
		return true;
	}
}

/*
	Try
*/

function TryException( msg , code ) {
	this.message = msg;
	this.errorCode = code;
}

var Try = {
	ifString: function( str ) {
		if ( typeof(str) == "string" ) return str;
		else return false;
	},
	ifObject: function( object ) {
		if ( typeof( object ) == "object" ) return object;
		else return false;
	},
	ifClass: function( instance ) {
		if ( typeof(instance) == "function" ) return instance;
		else return false;
	},
	ifValid: function( lambda ) {
		if ( lambda == undefined )	return false;
		if ( lambda == null )		return false;
		return true;
	},
	
	EVA_LES: "<",
	EVA_LTE: "<=",
	EVA_LAR: ">",
	EVA_LTA: ">=",
	EVA_EQU: "==",
	EVA_NEQ: "!=",
	
	EVA_ERR_INVALID: 1,
	EVA_ERR_TYPE: 2,
	EVA_ERR_LES: 3,
	EVA_ERR_LTE: 4,
	EVA_ERR_LAR: 5,
	EVA_ERR_LTA: 6,
	EVA_ERR_EQU: 7,
	EVA_ERR_NEQ: 8,
	EVA_ERR_PREG: 9,
	
	evalid: function( value , rules ) {
	
		var tests		= rules.test;
		var property	= ( rules && rules.property )			|| false;
		var mod		= ( rules && rules.mod )			|| "==";
		var preg		= ( rules && rules.preg )			|| /.*/;
		var optional	= ( rules && rules.optional )			|| false;
		
		if ( !optional ) {
			if ( !Try.ifValid( value ) ) throw new TryException( value + " not valid" , Try.EVA_ERR_INVALID );
		}
		try {
			var value = ( property && value[ property ] ? value[ property ] : value );
		} catch( e ) {
			var value = value || null;
		}
		
		Try.iteration(
			tests,
			function( test , i ) {
				if ( value == null ) {
					return false;
				}
			
				switch ( mod ) {
					case "<":
						if ( !( value < test ) ) throw new TryException( "@value(" + value + ") not less than " + test , 3 );
						break;
					case "<=":
						if ( !( value <= test ) ) throw new TryException( "@value(" + value + ") not less or equal than " + test, 4  );
						break;
					case ">":
						if ( !( value >  test ) ) throw new TryException( "@value(" + value + ") not larger than " + test, 5 );
						break;
					case ">=":
						if ( !( value >=  test ) ) throw new TryException( "@value(" + value + ") not larger or equal to " + test , 6 );
						break;
					case "==":
						if ( !( value == test ) ) throw new TryException( "@value(" + value + ") not equal to " + test , 7 );
						break;
					case "!=":
						if ( !( value != test ) ) throw new TryException( "@value(" + value + ") equals to " + test , 8 );
						break;
				}
			}
		)
		
		if ( !preg.test( value ) ) throw new TryException( value + " did not match regular expression" , 9 );
		
		return false;
	},
	each: function() {
		if ( !arguments ) return false;
		var result = false;
		for ( var i = 0 ; lambda = arguments[i] ; i++ ) {
			try {
				result = lambda();
			} catch( e ){}
		}
		return result;
	},
	/*
		Try Iteration, finds out if @lambda is iteratable and then iterates over all indexes.
	*/
	iteration: function( lambda , iterator ) {
		if ( Try.ifString( lambda ) )
			var Iterations = lambda && [lambda] || [];
		else
			var Iterations = lambda && ( lambda.length ? lambda : [lambda] ) || [];
		
		for ( var i = 0 ; i < Iterations.length ; i++ ) {
			var iterate = Iterations[i];
			iterator( iterate , i );
		}
	}
}

/*
	Make
*/

var Make = {
	USList: {
		'\"': "22", '%': "25", '&': "26", '\'': "27", '\\': "5C",
		'=': "3D",  '<': "3C", '>': "3E",  '!': "33",  '[': "5B",
		']': "5D",  '{': "7B", '}': "7D"
	},
	strUrlSafe: function( str ) {
		var result = "";
		for ( var i = 0 ; i < str.length ; i++ ) {
			var chr = str[ i ];
			var rep;
			if ( rep = this.USList[ chr ] ) {
				result += '%' + rep;
			} else {
				result += chr;
			}
		}
		return result;
	},
	strToXml: function( xml_string ) {
		var xmlDocument = Try.each(
			function() {
				return new DOMParser().parseFromString( xml_string , "text/xml");
			},
			function() {
				var xmldoc = new ActiveXObject("Microsoft.XMLDOM");
				xmldoc.async = false;
				xmldoc.loadXML( xml_string );
				return xmldoc;
			}
		)
		
		var xmlElement = xmlDocument.documentElement;
		
		return xmlElement;
	},
	siblingIterator: function( node , iterator ) {
		var child = node.firstChild || null;
		var document = node.ownerDocument || null;
		
		do {
			if ( !child ) break;
		
			var nextChild = child.nextSibling;
			
			iterator( child , node , document );
		} while( child = nextChild );
		
		return false;
	},
	domIterator: function( doc , iterator ) {
		var items = doc.getElementsByTagName("*");
		var i=0;
		var item;
		while ( item = items.item(i++) ) {
			iterator( item );
		}
	},
	replaceIteration: function( xml , collection ) {
		if ( !xml ) return false;
		
		var xml = xml;
		var collection = collection;
		
		Make.siblingIterator(
			xml,
			function( xml , stage ) {
				var type = xml.nodeType;
				
				switch ( type ) {
					case 1:
						if ( name = xml.getAttribute( "fetch" ) ) {
							
							if ( collection[ name ] ) {
								xml.parentNode.replaceChild(  new NTextElement( collection[ name ] ) , xml );
							}
							
							xml.removeAttribute( "fetch" );
						}
						
						for ( var i = 0 ; att = xml.attributes[i] ; i++ ) {
							if ( collection[ att.nodeValue ] )
								att.nodeValue = collection[ att.nodeValue ];
						}
						break;
				}
			},
			true	/* Making it deep */
		)
		
		return xml;
	},
	query: {	
		fromForm: function( formElement ) {
			var INPUT_TAG = "INPUT";
			var TEXTA_TAG = "TEXTAREA";
			var INPUT_TYPE_VALID = /(text|button|hidden|password)/;
			
			var Post = new Object();
			var PName = "";
			var PValue = "";
			
			Make.domIterator(
				formElement,
				function( wChild ) {
					var tName = ( wChild.tagName ) ? wChild.tagName.toUpperCase() : null ;	
					if ( !tName ) return false;
					
					switch( tName ) {
						case INPUT_TAG:
							/* Get and validate type. */
							var tType = ( wChild.type ) ?	wChild.type.toLowerCase() : null ;	
							if ( !tType ) break;
							if ( !INPUT_TYPE_VALID.exec( tType ) ) break;
							
							/* Get and validate name. */
							var tName = ( wChild.name ) ?	wChild.name.toLowerCase() : null ;	
							if ( !tName ) break;
							
							/* Get and validate value. */
							var tValue = ( wChild.value ) ?	wChild.value : "" ;
							
							PName = tName;
							PValue = escape( tValue );
							break;
						case TEXTA_TAG:
							/* Get and validate name. */
							var tName = ( wChild.name ) ?	wChild.name.toLowerCase() : null ;	
							if ( !tName ) break;
							
							/* Get and validate value. */
							var tValue = ( wChild.value ) ?	wChild.value : "" ;
							
							PName = tName;
							PValue = escape( tValue );
							break;
					}
					
					if ( PName && PValue ) {
						Post[ PName ] = ( Try.ifValid( PValue ) ? PValue : null );
						PName = "";
						PValue = "";
					}
					
					return false;
				}
			)
			
			return Post;
		},
		validation: function( query ) {
			var query = query;
			var prevElement = null;
			var addElement = null;
		
			for ( var i = 1 ; element = arguments[i] ; i++ ) {
				if ( element.name == "%" ) {
					addElement = element;
					element = prevElement;
				}
				
				if ( !Try.ifValid( element ) ) throw new TryException( "element is null or undefined" );
				
				var inputName =		( addElement && addElement.name ) || ( element && element.name );
				var failId =			( addElement && addElement.failId ) || ( element && element.failId );
				var fail =			( addElement && addElement.fail ) || ( element && element.fail );
				var evalids =		( addElement && addElement.evalid ) || ( element && element.evalid );
				
				try {
					Try.iteration(
						evalids,
						function( evalid , i ) {
							Try.evalid( query[ inputName ] , evalid );
						}
					)
				} catch ( e ) {
					var emt = $( failId );
					var msg = "";
					
					switch ( e.errorCode ) {
						case Try.EVA_ERR_INVALID:
							msg = fail.invalid;
							break;
						case Try.EVA_ERR_TYPE:
							msg = fail.type;
							break;
						case Try.EVA_ERR_LES:
							msg = fail.less;
							break;
						case Try.EVA_ERR_LTE:
							msg = fail.eqless;
							break;
						case Try.EVA_ERR_LAR:
							msg = fail.large;
							break;
						case Try.EVA_ERR_LTA:
							msg = fail.eqlarge;
							break;
						case Try.EVA_ERR_EQU:
							msg = fail.equal;
							break;
						case Try.EVA_ERR_NEQ:
							msg = fail.notequal;
							break;
						case Try.EVA_ERR_PREG:
							msg = fail.preg;
							break;
					}
					
					if ( !Try.ifValid( msg ) ) {
						msg = fail.global || e.message || "UNSPECIFIED";
					}
					
					$TxT( msg , emt );
					
					throw new TryException( e.message );
					return false;
				}
				
				addElement = null;
				prevElement = element;
				$Clear( $( failId ) );
			}
			
			return query;
		}
	}
}


/*
	siblingIterator: function( node , parent , iterator , deep , stage ) {
		var Args = new Object();
		
		Args.stage = stage || 0;
		Args.node = node;
		Args.parent = node.parentNode;
		
		var next = null;
		var child = null;
		
		var deep = deep;
		
		do {
			next = Args.node.nextSibling;
			child = Args.node.firstChild;
			
			switch ( Args.node.nodeType ) {
				case 1:
					Args.newNode = new NElement( $E( Args.node.tagName ) );
					
					var attr;
					for ( var i = 0 ; attr = Args.node.attributes[i++] ; ) {
						Args.newNode.setAttribute( attr.nodeName , attr.nodeValue );
					}
					
					break;
				case 3:
					if ( /^\s*$/.test( Args.node.nodeValue ) ) continue;
					Args.newNode = new NElement( $T( Args.node.nodeValue ) );
					break;
				default:
					continue;
					break;
			}
			
			Args.parent.replaceChild( Args.newNode , Args.node );
			var response = iterator( Args.newNode , Args.parent , stage );
			
			if ( response ) Args.newNode = response;
			
			if ( !child || !deep ) continue;
			
			Make.siblingIterator( child , Args.node , iterator , deep , ++stage );
		} while(Args.node = next );
		
		return Args.node;
	},
*/