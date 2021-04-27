/*var SuperClass = {	__name: "SuperClass",	__constructor: function() {},	shout: function( msg ) { alert( msg ) }};Class.create( SuperClass );var ChildClass = {	__name: "ChildClass",	__constructor: function(sd) {}}Class.create( ChildClass );ChildClass.extend( SuperClass );var test = new ChildClass();alert( test.shout );*///will output msgvar Xite = {
	xites: [],
	stop: function( id ) {
		for ( i in Xite.xites )
			Xite.xites[ i ].stop();
	},	create: function( object_id , collection ) {
		return new function() {
			if ( !Try.ifValid( object_id ) ) throw new Error( "missing argument 1; @object_id" );
			this.object_id = object_id;
			
			this.booted = false;
			
			this.xnotify = 	collection.xnotify ||	function() { alert( "'" + this.object_id + "'.xnotify not specified." ); };
			this.xboot = 	collection.xboot ||	function() { alert( "'" + this.object_id + "'.xboot not specified." ); };
			this.xunboot = 	collection.xunboot ||	function() { alert( "'" + this.object_id + "'.xunboot not specified." ); };
			this.xite = 		collection.xite ||		"";
			this.css = 		collection.css;
			
			this.RES = [];
			
			if ( collection ) {
				for ( index in collection ) {
					this[ index ] = collection[ index ];
				}
			}
			
			this.triggerNotify = function() {
				for ( index in this.RES ) {
					try {
						this.RES[ index ].start();
					} catch( e ) {
						alert( e.message );
					}
				}
			
				if ( Try.ifClass( this.notify ) ) {
					try {
						return this.notify( $( this.object_id ) );
					} catch( e ) {
						throw e;
					}
				}
			}
			
			this.start = function() {
				if ( this.booted ) this.stop();
				
				if ( !Try.ifClass( this.xboot ) ) {
					throw new Error( "xboot method missing for '" + this.object_id + "'" )
				}
				
				if ( Xite.xites[ this.object_id ] ) return false;
				
				var self = this;
				
				this.booted = true;
				
				try {
					Xite.xites[ this.object_id ] = this;
					
					$link( this.object_id , this.xite , this.css , 
						function() {
							self.xboot( $( self.object_id ) );
							self.triggerNotify();
						}
					)
				} catch( e ) {
					throw e;
				}
				
				return false;
			}
			
			this.stop = function() {
				if ( !this.booted ) return false;
			
				if ( !Try.ifClass( this.xunboot ) ) {
					throw new Error( "xunboot method missing for '" + this.object_id + "'" );
				}
				
				if ( !Xite.xites[ this.object_id ] ) return false;
				
				for ( index in this.RES ) {
					try {
						if ( this.RES[ index ].booted ) this.RES[ index ].stop();
					} catch( e ) {
						alert( e.message );
					}
				}
				
				if ( this.booted ) {
					this.booted = false;
					try {
						delete Xite.xites[ this.object_id ];
						if ( Try.ifValid( $( this.object_id ) ) ) {
							$Clear( $( this.object_id ) );
							this.xunboot( $( this.object_id ) );
						}
					} catch( e ) {
						throw e;
					}
				}
				
				return false;
			}
			
			this.addXte = function( id , collection ) {
				try {
					this.RES[ id ] = Xite.create( id , collection , this );
				} catch ( e ) {
					alert( "failed to add resource with id '" + id + "'\nMessage: " + e.message );
				}
				
				return this.RES[ id ];
			}
		};
	}}