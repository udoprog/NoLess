
function StdEvent( evt , src ) {
	this.event = evt;
	
	this.src = 	src;
	this.type = ( evt.type ) ? evt.type : null;
	
	this.preventDefault = function() {
		if ( this.event.preventDefault ) this.event.preventDefault();
		this.wreturn = false;
	};
	
	this.wreturn = true;
	
	return false;
}

/**	<function>addEventListener( Object reference , String type , Object Callback , Boolean Phase )</function>
 *	<return>true|false<return>
 */


/**	<object>MouseEvent</function>
 *	<return>void<return>
 */
var MouseEvent = function( ) {
	this.toString = function() { return "[Object MouseEvent]" };

	this.supported = true;

	this.Y = -1;
	this.X = -1;

	var self = this;

	function catchMouse( event ) {
		self.Y = event.clientY;
		self.X = event.clientX;
	}

	this.init = function( ) {
		if ( stdAddEventListener( document.body , "mousemove" , catchMouse , true ) ) {
			return true;
		}

		Verbose.push( this.init + " : Could not initiate.");
		return false;
	}; this.init.toString = function() { return "[Object MouseEvent].init( void )"}

	this.end = function( ) {
		if ( stdRemoveEventListener( document.body , "mousemove" , catchMouse , true ) ) {
			return true;
		}
		
		Verbose.push( this.end + " : Could not end.");
		return false;
	}; this.end.toString = function() { return "[Object MouseEvent].init( void )"}

	if ( !this.init() ) {
		Verbose.push( this + " : Browser does not support MouseEvent (FATAL).");
		this.supported = false;
	}
}

/**	<object>createDragEvent( Object dragThis , Object moveThis )</function>
 *	<return>true|false<return>
 */
var createDragEvent = function( dragThis , moveThis ) {
	this.toString = function() { return "[Object createDragEvent]" };

	if ( !MouseEvent.supported ) {
		Verbose.push( this + " : Could not find MouseEvent (FATAL).");
		return null;
	}

	this.browserType = 0;

	this.dragThis = dragThis;
	this.moveThis = moveThis;

	this.moveThis.style.position = "absolute";

	this.init = function( ) {

		var self = this;

		var isDragged = false;

		var prevY = -1;
		var prevX = -1;

		var moveInterval = null;

		function moveDrag( ) {
			if ( prevY < 0 || prevX < 0 ) {
				prevY = MouseEvent.Y;
				prevX = MouseEvent.X;
				return false;
			}

			if ( MouseEvent.Y != prevY ) {
				var mouseY = MouseEvent.Y;
			} else {
				var mouseY = prevY;
			}
			if ( MouseEvent.X != prevX ) {
				var mouseX = MouseEvent.X;
			} else {
				var mouseX = prevX;
			}

			if ( mouseY <= 0 ) { mouseY = 0; }
			if ( mouseX <= 0 ) { mouseX = 0; }

			var changeY = mouseY - prevY;
			var changeX = mouseX - prevX;

			self.moveThis.Y += changeY;
			if ( self.moveThis.Y < 0 ) {
				self.moveThis.Y = 0;
			}
			self.moveThis.style.top = self.moveThis.Y;

			self.moveThis.X += changeX;
			if ( self.moveThis.X < 0 ) {
				self.moveThis.X = 0;
			}
			self.moveThis.style.left = self.moveThis.X;

			prevY = mouseY;
			prevX = mouseX;
			
			return false;
		}

		function startDrag( ) {
			if ( !isDragged ) {
				moveInterval = setInterval( moveDrag , 10 );
				isDragged = true;
			}
		}

		function stopDrag( ) {
			if ( isDragged ) {
				prevY = -1;
				prevX = -1;
				clearInterval( moveInterval );
				isDragged = false;
			}

			notSet = true;
		}

		if ( !stdAddEventListener( self.dragThis , "mousedown" , startDrag ) ) {
			return false;
		}
		if ( !stdAddEventListener( document.body , "mouseup" , stopDrag ) ) {
			return false;
		}
		
	}; this.init.toString = function() { return "[Container Object].init( void )" };

 	this.init();
}

Events = true;