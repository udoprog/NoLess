Console = new function() {
	this.object = document.createElement( "div" );
	
	this.errorLead = function( error_lead ) {
	
		if ( !this.error_lead ) {
			this.error_lead = document.createElement( "div" );
		}
	
		var wErrorLeadElement = document.createElement( "div" );
			wErrorLeadElement.className = "console_error_lead";
			wErrorLeadElement.appendChild(
				document.createTextNode( error_lead )
			);
		
		this.error_lead.appendChild( wErrorLeadElement );
		
		return false;
	};
	
	this.error = function( error ) {
	
		if ( !this.error_lead ) return true;
		
		var wErrorElement = document.createElement( "div" );
			wErrorElement.className = "console_error";
			wErrorElement.appendChild( this.error_lead )
			wErrorElement.appendChild(
				document.createTextNode( this.src + " : " + error )
			);
		
		this.error_lead = null;
		
		this.object.appendChild( wErrorElement );
		
		return false;
	};
	
	this.infoLead = function( info_lead ) {
	
		if ( !this.info_lead ) {
			this.info_lead = document.createElement( "div" );
		}
	
		var wInfoLeadElement = document.createElement( "div" );
			wInfoLeadElement.className = "console_info_lead";
			wInfoLeadElement.appendChild(
				document.createTextNode( info_lead )
			);
		
		this.info_lead.appendChild( wInfoLeadElement );
		
		return false;
	};
	
	this.info = function( info ) {
	
		var wInfoElement = document.createElement( "div" );
			wInfoElement.className = "console_info";
			if ( this.info_lead  ) wInfoElement.appendChild( this.info_lead );
			wInfoElement.appendChild(
				document.createTextNode( this.src + " : " + info )
			);
		
		this.info_lead = null;
		
		this.object.appendChild( wInfoElement );
		
		return true;
	};
	
	this.setSrc = function( src ) {
		this.src = src;
		return false;
	};
	
	this.getObject = function() {
		return ( this.object ) ? this.object : null;
	};
	
	return false;
};