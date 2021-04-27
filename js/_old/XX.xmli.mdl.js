/** Javascript Module - Mod_XMLI
 *	Ajax script to handle xml documents.
 *
 */

function XmlI( id ) {
	this.id = id;
	this.type = "Object_XmlI";
	
	this.XMLS = null;
	this.Text = null;
	
	return false;
};

XmlI.XMLHANDLE = "./index.php";

XmlI.prototype = new Caching( );

XmlI.prototype.execute = function( xml ) {
	
};

XmlI.prototype.loadXmlHttpNode = function( node , readyObject ) {
	var self = this;
	
	xmlHttp = new XmlHttp( node , XmlHttp.STATE4 | XmlHttp.NODE ).execute(
		XmlI.XMLHANDLE ,
		function( xh ) {
			self.Text = xh.responseText;
			self.SXML = new SimpleXML().load_text( self.Text );
			
			readyObject( self );
		} , 
		"node=" + node
	);
	
	return this;
};
