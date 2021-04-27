/** Javascript Module - Container
 *	EARLY STAGE ALPHA
	Changes
 *	08:32 2007-01-06 - method setElementById added.
 *	16:57 11/01/2007 - Point changed to point at Container Object instead of element.
 *	17:55 11/01/2007 - FIX! All elements must be replaced when loading ocse ( since it's done after the page loads).
 *	18:06 2007-01-12 - FIX! Point has to be set when object is.
 *	23:05 2007-01-14 - FIX! Rewrite, adjust framework, new names of methods.
 */

var GTextElement = function( content ) {
	var DocTextElement = document.createTextNode( content );
	
	DocTextElement.replace = function( gTElement ) {
		if ( !this.parentNode ) return false;
		this.parentNode.replaceChild( gTElement , this );
		return gTElement;
	}
	
	return DocTextElement;
};
 
var GElement = function( tag , id ) {
	if ( tag )
		var DocElement = document.createElement( tag );
	
	DocElement.frame = false;
	if ( id )
		DocElement.id = id;
	DocElement.locked = false;
	
	DocElement.lock = function() { this.locked = true; return this; };
	DocElement.unlock = function() { this.locked = false; return this; };
	
	DocElement.append = function( element ) {
		if ( this.locked ) return this;
			
		this.appendChild( element );
		return this;
	}
	
	DocElement.replace = function( gElement ) {
		if ( this.locked ) return this;
		
		if ( !this.parentNode ) return false;
		this.parentNode.replaceChild( gElement , this );
		return gElement;
	}
	
	DocElement.remove = function( element ) {
		if ( this.locked ) return this;
		
		this.removeChild( element );
		return this;
	}
	
	DocElement.reset = function() {
		if ( this.locked ) return this;
		
		while ( this.firstChild )
			this.removeChild( this.firstChild );
		return this;
	}
	
	DocElement.appendText = function( text ) {
		if ( this.locked ) return this;
		this.append( document.createTextNode( text ) );
		return this;
	}
	
	DocElement.setFrame = function( isFrame ) {
		if ( this.locked ) return this;
		this.frame = isFrame;
		return this;
	}
	
	DocElement.setTarget = function( target ) {
		if ( this.locked ) return this;
		this.target = target;
		return this;
	}
	
	DocElement.Target = function() {
		if ( this.target )
			var target = document.getElementById( this.target );
		
		if ( !target )
			alert( "'target' invalid, id could not be found." );
		
		return ( target ? target : this );
	}
	
	DocElement.Frame = function( targetting ) {
		var wGEnt = this;
		
		do {
			if ( wGEnt.target && !targetting ) {
				if ( wGEnt.Target().Frame( true ) != wGEnt.Frame( true ) )
					wGEnt = wGEnt.Target();
			}
			
			if ( wGEnt.frame ) return wGEnt;
		} while ( wGEnt = wGEnt.parentNode );
		return this;
	}
	
	DocElement.addEvent = function( eType , eCall , ePhase ) {
		var self = this;
		function exeEvent( evt ) {
			var evt = ( evt ? evt : ( event ? event : null ) );
			stdEvt = new StdEvent( evt , self );
			eCall( stdEvt );
			return stdEvt.wreturn;
		}
		
		if ( this.addEventListener ) { this.addEventListener( eType , exeEvent , ePhase ); } 
		else if ( this.attachEvent ) { this.attachEvent( "on" + eType , exeEvent , ePhase ); }
		
		return this;
	};

	DocElement.removeEvent = function( eType , eCall , ePhase ) {
		var self = this;
		function exeEvent() {};
		
		if ( this.removeEventListener ) { this.removeEventListener( eType , exeEvent , ePhase ); } 
		else if ( this.detachEvent ) { this.detachEvent( "on" + eType , exeEvent , ePhase ); }
		
		return this;
	};
	
	DocElement.toString = function() { return "Gnarf's " + this; };
	
	return DocElement;
}

GElement.STRING_TAG = '$';