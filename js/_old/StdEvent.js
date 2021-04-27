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