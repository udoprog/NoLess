/**	Panels
 *
 */

var ContainerCount = 0;

GMake = new Object();

GMake.form = function( XHF ) {
	var wGEmt = new GElement( "form" );
	var XHF = XHF;
	
	function submitEvent( evt ) {
		evt.preventDefault();
		
		var Post = formToStr( wGEmt );
		
		var test = new Grf_XmlHttp( "form" ).setXHF( XHF );
		test.execute(
			"index.php",
			Post,
			function ( xh ) {
				if ( xh.status == GRF_XH.OK )
					xh.forEachOutput( null );
				return false;
			},
			null
		);
		
		return false;
	}
	
	
	wGEmt.addEvent( "submit" , submitEvent , true );
	
	return wGEmt;
};