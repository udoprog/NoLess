
var ROOTPATH = "./javascript/";

var BOOT = Array(
	"00.osf.jscript.conf",	
	// Modules to include.			Init files to include.
	"inits/00.boot.init.js",
	
	"modules/00.GConsole.mdl.js",
	"modules/01.GXmlHttp.mdl.js",
	"modules/02.GSimpleXml.mdl.js",
	"modules/03.GEvents.mdl.js",	
	"modules/04.GEngine.mdl.js",
	"modules/05.GElement.mdl.js",
	"modules/06.GElementMake.mdl.js",
	"modules/07.GNodes.mdl.js",
	"modules/80.tools.collection.js",	
	"modules/testing/Ajax.js",	
	"modules/testing/SimpleXml.js",	
	"modules/testing/XCom.js",	
	"modules/testing/Requirements.js",
	
	"inits/99.end.init.js"
);

var Container = null;
var OCSE = null;
var XmlI = null;
var Action = null;
var XmlHttp = null;
var Events = null;
var Panel = null;


/*	<object>OSF( void )</object>
 	<return>null</return>
 	<comment>
 		OSF booting class.
 	</comment>
 	<latest_update>
 		24-11-06 01:19
 	</latest_update>
*/
OSF = new function() {
	/**	<function>getModules( void )</function>
	 *	<return>true</return>
	 *	<comment></comment>
	 */
	var BOOTPOINT = 0;

	this.boot = function() {
		if ( BOOTPOINT >= BOOT.length ) {
			clearInterval( BOOTINT );
		}
		
		var headElement = document.getElementsByTagName("head")[0];
		
		var newScript =	document.createElement("script");
			newScript.setAttribute("language","javascript");
			newScript.setAttribute("type","text/javascript");
			newScript.src = ROOTPATH + BOOT[ BOOTPOINT ] + "?r=" + new Date();
			
			headElement.appendChild( newScript );
		BOOTPOINT++;
				
		return true;
	}; this.boot.toString = function() { return "[Object OSF].boot( void )" };
	
	this.toString = function() { return "[Object OSF]"};
}

/*
	IE
		-Interval since it can't handle loops ( not even recoursive )
			No guarantee files are loaded in correct order.
*/
var BOOTINT = setInterval( OSF.boot , 1 );