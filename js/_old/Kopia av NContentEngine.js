/** Javascript Module - OCSE

TODO:
	foreach iteration

 */

var NContentEngine = function( tag ) {
	this.element = new NElement( tag );
	return this;
};

NContentEngine.IGNORE_TEXT_REGEX = /^[\s]*$/;
NContentEngine.CLEAN_TEXT_REGEX = /^\s*(.*)\s*$/;

NContentEngine.prototype.toElement = function() {
	return this.element;
};

NContentEngine.prototype.execute = function( elementRoot ) {
	this.parse( elementRoot.firstChild , this.element );
	return this;
};

NContentEngine.prototype.parse = function( xml , xmlTo ) {
	var xml = xml;
	
	do {
		if ( !xml ) break;
		
		var type = xml.nodeType;
		
		switch ( type ) {
			case 1:
				var name = ( xml.tagName 	? xml.tagName.toLowerCase() : null );
				var attr = ( xml.attributes	? xml.attributes : null );
				
				var wNEmt = this.buildNElement( name , xml );
				
				xmlTo.appendChild( wNEmt );
				
				if ( !xml.firstChild )
					continue;
				
				this.parse( xml.firstChild , wNEmt );
				break;
			case 3:
				var value = xml.nodeValue;
				if ( NContentEngine.IGNORE_TEXT_REGEX.test( value ) ) break;
				NContentEngine.CLEAN_TEXT_REGEX.test( value );
				
				xmlTo.appendText( RegExp.$1 );
				break;
		}
	} while ( xml = xml.nextSibling );
	
	return this;
};

NContentEngine.prototype.buildNElement = function( tag , element ) {
	var NEmt = null;
	
	switch ( tag ) {
		case "nbutton":
			NEmt = new NElement( "input" );
			NEmt.type = "button";
			
			if ( element.getAttribute( "text" ) )
				NEmt.value = element.getAttribute( "text" );
			break;
		case "ntext":
			NEmt = new NElement( "input" );
			NEmt.type = "text";
			
			if ( element.getAttribute( "text" ) )
				NEmt.value = element.getAttribute( "text" );
			if ( element.getAttribute( "name" ) )
				NEmt.name = element.getAttribute( "name" );
			break;
		case "ntextarea":
			NEmt = new NElement( "textarea" );
			if ( element.getAttribute( "name" ) )
				NEmt.name = element.getAttribute( "name" );
			break;
		case "header":
			NEmt = new NElement( "span" );
			break;
		case "nsubmit":
			NEmt = new NElement( "input" );
			NEmt.type = "submit";
			NEmt.value = element.getAttribute( "text" );
			break;
		case "nframe":
			NEmt = new NElement( "div" );
			break;
		case "link":
			NEmt = new NElement( "a" );
			
			function linkClick( evt ) {
				evt.preventDefault();
				
				alert( NEmt.href );
				
				return false;
			}
			
			NEmt.addEvent( "click" , linkClick , true );
			
			var href = element.getAttribute( "href" );
			if ( href ) NEmt.href = href;
			break;
		case "nform":
			var xhf = element.getAttribute( "xhf" );
			
			NEmt = GMake.form(
				( xhf ? xhf : "" )
			);
			break;
		case "nimport":
			if ( element.getAttribute( "spath" ) )
				var spath = element.getAttribute( "spath" );
			else return new NTextElement( "GImport ! No spath" );
			
			NEmt = new NTextElement( "text" );
			
			var name = element.getAttribute( "name" );
			
			var Index = new GNodes();
			Index.success = function( sxe ) {
				var response = sxe.spath( "/gnode" + spath );
				if ( !response ) 
					var GEReplace = new NTextElement( "GImport ! Invalid spath" );
				else
					var GEReplace = new NTextElement( response['$'] );
					
				NEmt.replace( GEReplace );
				return false;
			};
			Index.importNode( name , GNodes.AS_SXE );
			
			break;
		case "nbsp":
			NEmt = new NTextElement( " " );
			break;
			
		case "foreach":
			var TempSign = new NTextElement( "Loading" );
			var NEmt = new NElement( "div" ).append( TempSign );
			NEmt.noBuild = true;
			NEmt.setFrame( true );
			
			var BuildEmt = null;
			var MoldEmt = null;
			
			var query = element.getAttribute( "query" );
			var operation = element.getAttribute( "operation" );
			
			function xcomResponse( xcom ) {
				if ( !BuildEmt || !MoldEmt ) {
					BuildEmt = new NElement( "div" );
					NEmt.remove( TempSign );
				}
				
				MoldEmt =  NEmt.copy();
				
				var collection = Object();
				
				Make.siblingIterator(
					xcom.content['%'].firstChild,
					function( dom ) {
						replaceEmt = NEmt.copy();
						collection[ dom.tagName ] = dom.firstChild.nodeValue;
					}
				)
				
				var RawEmt = Make.replaceIteration( MoldEmt , collection );
				BuildEmt.append( RawEmt );
				
				return false;
			}
			
			function xcomFinalize() {
				NEmt.parentNode.replace( BuildEmt );
				
				return false;
			}
			
			NClient.sendXCom( operation , { query: query } , xcomResponse , xcomFinalize );
			
			break;
		case "element": case "br": case "p": case "list": case "li": case "b": case "u": case "i": case "div": case "img": case "span": case "h1":
			NEmt = new NElement( tag );
			break;
		default:
			NEmt = new NElement( "span" ).appendText( "[Tag Unknown]" ).lock();
			break;
	}
	
	if ( element.getAttribute( "size" ) )
		NEmt.style.fontSize = element.getAttribute( "size" );
	
	if ( element.getAttribute( "weight" ) )
		NEmt.style.fontWeight = element.getAttribute( "weight" );
	
	if ( element.getAttribute( "class" ) )
		NEmt.className = element.getAttribute( "class" );
	
	if ( element.getAttribute( "id" ) )
		NEmt.id = element.getAttribute( "id" );
		
	if ( element.getAttribute( "target" ) )
		NEmt.setTarget( element.getAttribute( "target" ) );
		
	if ( element.getAttribute( "class" ) )
		NEmt.className = element.getAttribute( "class" );
		
	if ( element.getAttribute( "src" ) )
		NEmt.src = element.getAttribute( "src" );
	
	if ( element.getAttribute( "fetch" ) )
		NEmt.setAttribute( "fetch" , element.getAttribute( "fetch" ) );
		
	if ( element.getAttribute( "frame" ) ) {
		NEmt.setFrame( true );
		NEmt.id = element.getAttribute( "frame" );
	}
	
	if ( element.getAttribute( "default" ) ) {
		NClient.sendXite( NEmt , element.getAttribute( "default" ) );
	}
	
	return NEmt;
};











