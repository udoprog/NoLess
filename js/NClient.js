var NClient = {
	sendXite: function( target , name ) {
		NClientCom.operation( "xite" ,
			{ 
				name: name
			},
			function( xh ) {
				var xml = Make.strToXml( xh.text );
				
				var first = xml.firstChild.nextSibling;
				
				var test = new NElement( "div" );
				
				target.Frame().reset();
				NContentEngine.execute( xml , target );
			}
		);
		
		return false;
	},
	sendXCom: function( operation , param , response , finalize ) {
		NClientCom.operation( operation , param ,
			function( xh ) {
				var xml = Make.strToXml( xh.text );
				var sxe = SimpleXml.load( xml );
				XCom.recieve( sxe , {
						foreachoutput: response
					}
				);
			},
			finalize
		);
	},
	putResponse: function( target , operation , params , finalize ) {
		XCom.simpleCall({
			op: operation,
			params: params,
			xco_100: function( xco ) {
				$TxT( xco.content['%'] , $Clear( target ) );
			},
			xco_400: function( xco ) {
				alert( "ERROR\n" + xco.content.$ );
			},
			xco_finalize: finalize || false
		})
		
		return false;
	}
};

function $link( targetId , href , css , finalize_method ) {
	var target = 		$( targetId );
	var href =			href;
	var finalize_method = finalize_method || false;
	
	var css_id = targetId + "_css";
	
	if ( !Try.ifValid( target ) ) {
		alert( "target invalid" );
	}
	
	if ( css ) {
		var css = Try.ifString( css ) || href;
	}
	
	if ( href )
		target.setAttribute( "link" , href );
	else
		href = target.getAttribute( "link" ) || null;
	
	var css_href = "./css/" + css + ".css";
	var css_element;
	
	try {
		if ( href ) {
			function applyCss() {
				if ( css ) {
					$Css( css_href , css_id );
				} else if ( css_element || $( css_id ) ) {
					$Css( "null" , targetId + "_css" );
				}
			}
			
			NClient.putResponse( target , "pageManager" , { page: href } ,
				function() {
					applyCss();
					
					if ( Try.ifClass( finalize_method ) ) {
						finalize_method();
					}
					return false;
				}
			);
		}
	} catch( e ) {
		throw e;
	}
	
	return false;
}

