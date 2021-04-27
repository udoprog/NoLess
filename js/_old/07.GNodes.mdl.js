var GNodes = function() {
	this.GNodeElement = null;
}

GNodes.AS_GENGINE_CONTENT_ELEMENT = 1;
GNodes.AS_SXE = 2;

GNodes.prototype.success = function() {};

GNodes.prototype.importNode = function( nodeName , returnType ) {
	var self = this;
	
	function GNodeForEachOutput( sxe ) {
		if ( !sxe )
			return false;
		
		if ( sxe.spath( "/t" )['$'] == "1" ) {
			alert( "ERROR:\n" + sxe.spath( "/c" )['$'] );
			return false;
		}
		
		if ( sxe.spath( "/t" )['$'] == "200" ) {
			switch( returnType ) {
				case GNodes.AS_GENGINE_CONTENT_ELEMENT:
					var content = sxe.spath( "/c/gnode/content" )['%'];
					var GE = new GEngine( "div" ).execute( content );
					self.GNodeElement = GE.toElement();
					self.success( GE.toElement() );
					break;
				case GNodes.AS_SXE:
					self.success( sxe.c[0] );
					break;
			}
			
			return false;
		}
		
		return true;
	}

	function GNodeXHRecall( gxh ) {
		if ( gxh.status == GRF_XH.OK ) {
			gxh.forEachOutput(
				GNodeForEachOutput
			)
		}
		
		return false;
	}
	
	var GNode = new Grf_XmlHttp( "test" ).setXHF( "NodeSend" );
	GNode.execute(
		"index.php",
		"node_name=" + nodeName,
		GNodeXHRecall,
		null
	);
	
	return false;
};