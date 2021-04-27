/** Javascript Module - Mod_Action
 *	
 *
 */
 
/*
*	Ajax script to fetch form actions, look at ./actions/ajax_interface.php
*/

function Action( ) {
	this.action = null;
	this.post = "";
}

Action.PATH = "./index.php";
Action.INPUT_TAG = "INPUT";
Action.TEXTA_TAG = "TEXTAREA";
Action.INPUT_TYPE_VALID = /(text|button|hidden|password)/;

Action.prototype = new Caching();

Action.prototype.setPost = function( post ) {
	if ( !post ) return false;
	this.post += ( post[0] == '&' ) ? post : '&' + post ;
	return this;
};

Action.prototype.parseForm = function( formRoot ) {
	var wChild = formRoot.firstChild;
	do {
		var tName = ( wChild.tagName ) ? wChild.tagName.toUpperCase() : null ;	
		if ( !tName ) continue;
		
		switch( tName ) {
			case Action.INPUT_TAG:
				/* Get and validate type. */
				var tType = ( wChild.type ) ?	wChild.type.toLowerCase() : null ;	
				if ( !tType ) break;
				if ( !Action.INPUT_TYPE_VALID.exec( tType ) ) break;
				
				/* Get and validate name. */
				var tName = ( wChild.name ) ?	wChild.name.toLowerCase() : null ;	
				if ( !tName ) break;
				
				/* Get and validate value. */
				var tValue = ( wChild.value ) ?	wChild.value : null ;
				if ( !tValue ) break;
				
				this.setPost( tName + "=" + tValue );
				break;
			case Action.TEXTA_TAG:
				/* Get and validate name. */
				var tName = ( wChild.name ) ?	wChild.name.toLowerCase() : null ;	
				if ( !tName ) break;
				
				/* Get and validate value. */
				var tValue = ( wChild.value ) ?	wChild.value : null ;
				if ( !tValue ) break;
				
				this.setPost( tName + "=" + escape( tValue ) );
				break;
		}
		
	} while( wChild = wChild.nextSibling );
	
	return this;
};

Action.prototype.perform = function() {
 
	function actionResponse( xh ) {
		alert( xh.responseText );
	}
	
	new XmlHttp( "action_edit" , XmlHttp.ACTION | XmlHttp.STATE4 ).execute( Action.PATH , actionResponse , this.post );
}