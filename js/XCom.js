/*	XmlCommunication 0.1 Alpha	Written By John-John Tedro (pentropia at gmail dot com)		XmlCommunication is used to easily enterprate formatted server output.*/var XCom = {
	ERROR_NO_TYPE:			"@type not specified and no default could be used",	ERROR_NO_OUTPUTSXE:	"@outputSxe not specified",	ERROR_OUTPUTSXE_TYPE:	"@outputSxe type invalid",	ERROR_NO_COLLECTION:	"@Collection not specified",	ERROR_COLLECTION_TYPE:	"@Collection not of type 'Object'",	ERROR_NO_FOREACHOUTPUT:	"Method to recieve output from server not specified ( @collection.foreachoutput ).",		ERROR_NO_XML_FROM_SERVER: "No output from server",	
	/* Response types for recognising type conversion */
	R_STR: 1,
	R_AJAX: 2,
	R_SXE: 3,
	R_DEFAULT: 2,	/* Since XCom is (mostly) associated with ajax responses */
		type: {		INFO: "100",		ERROR: "400",		EXCEPTION: "500"	},	handles: {		ERROR_UNRECOGNISED_TYPE: "XCom caught type that it couldn't handle",				INFO: function( xco ) {			alert( xco.content['$'] );			return false;		},		ERROR: function( xco ) {			alert( xco.content['$'] );			return false;		},		EXCEPTION: function( xco ) {			alert( xco.content['$'] );			return false;		},		UNKOWN: function( xco ) {			throw new InvalidException( this.ERROR_UNRECOGNISED_TYPE + "\nThe type was: " + xco.type );			return false;		}	},	recieve: function( outputSxe , collection , type ) {
		
		var type = ( type || XCom.R_DEFAULT )
		
		while ( true ) {
			switch ( type ) {
				case XCom.R_STRING:
					var outputSxe = SimpleXml.str2Sxe( outputSxe );
					break;
				case XCom.R_SXE:
					var outputSxe = outputSxe;
					break;
				case XCom.R_AJAX:
					var outputSxe = SimpleXml.str2Sxe( outputSxe.text );
					break;
				default:
					throw new Error( this.ERROR_NO_TYPE );
					break;
			}
			
			break;
		}
				if ( !outputSxe ) 							throw new Error( this.ERROR_NO_OUTPUTSXE );		if ( !( outputSxe instanceof SimpleXmlNode ) ) 	throw new Error( this.ERROR_OUTPUTSXE_TYPE );		if ( !collection )							throw new Error( this.ERROR_NO_COLLECTION );		if ( !(collection instanceof Object) )			throw new Error( this.ERROR_COLLECTION_TYPE );				var foreachoutput =						( collection.foreachoutput || false );			var finalize =							( collection.finalize || false );				var types =							( collection.types || /^.*$/ );				if ( !foreachoutput )	throw new Error( this.ERROR_NO_FOREACHOUTPUT );
				if ( !outputSxe.xcom )	throw new Error( this.ERROR_NO_XML_FROM_SERVER );
				var sxe_root = outputSxe.xcom[0];		
		if ( sxe_root && sxe_root.o && sxe_root.o.length )			for ( var i = 0 ; i < sxe_root.o.length ; i++ ) {								if ( i != sxe_root.o.length ) {					var wSxe = sxe_root.o[i];				}								var type = wSxe.spath( "/t" ).$;								var XComOutput = {					type: type,					content: wSxe.spath( "/c" ),					toString: function() { return "[Object XComOutput]"; }				};								if ( types.test( type ) )					foreachoutput( XComOutput );				else switch( type ) {					case XCom.type.INFO:			XCom.handles.INFO( XComOutput );		break;					case XCom.type.ERROR:		XCom.handles.ERROR( XComOutput );		break;					case XCom.type.EXCEPTION:		XCom.handles.EXCEPTION( XComOutput );	break;					default: 					XCom.handles.UNKNOWN( XComOutput );		break;				}			}				if ( finalize )			finalize();				return false;	},	foreachoutput: function( xco ) {		switch ( xco.type ) {			case XCom.type.INFO:				alert( xco.content );				break;		}	},
	simpleCall: function( collection ) {
		NClientCom.operation( collection.op , collection.params , 
			function( response ) {
				if ( collection.xco_begin )
					collection.xco_begin( response );
				
				var BEGIN = [];
				
				XCom.recieve( response , 
					{
						foreachoutput: function( xco ) {
							if ( collection[ "xco_all" ] )
								collection[ "xco_all" ]( xco );
							
							if ( !BEGIN[ xco.type ] ) {
								if ( collection[ "xco_" + xco.type + "_begin" ] ) {
									collection[ "xco_" + xco.type + "_begin" ]();
								}
								BEGIN[ xco.type ] = true;
							}
							
							if ( collection[ "xco_" + xco.type ] )
								collection[ "xco_" + xco.type ]( xco );
						},
						types: /.*/,
						finalize: collection.xco_finalize || false
					}
				);
			}
		);
	},	toString: function() { return "[Object XCom]"; }};