/*	<object>Cache( void )</object>
 	<return>null</return>
 	<comment>
 		Caching class.
 	</comment>
 	<latest_update>
 		24-11-06 01:19
 	</latest_update>
*/
var Cache = new function() {
	this.CACHED = Array();
	
	/**	<function>cache( Object )</function>
	 *	<return>true</return>
	 */
	this.cache = function( object ) {
		Console.setSrc( "Cache" );
		
		if ( !validate( object ) ) {
			return false;
		}
		
		this.runType( object )
		this.runId( object )
		
		wobject = this.CACHED[ object.type ][ object.id ];
		
		return wobject;
	};
	
	/**	<function>runType( Object )</function>
	 *	<return>true</return>
	 */
	this.runType = function( object ) {
		if ( !this.CACHED[ object.type ] ) {
			this.CACHED[ object.type ] = Array();
			Console.infoLead( "Creating - 'Cache.CACHED[ " + object.type + " ]'" );	
		}
		
		return Console.info( "Executed - 'Cache.runType( " + object + " )'" );
	};

	/**	<function>runId( Object )</function>
	 *	<return>true</return>
	 */
	this.runId = function( object ) {
		if ( !this.CACHED[ object.type ][ object.id ] ) {
			this.CACHED[ object.type ][ object.id ] = object;
			Console.infoLead( "Creating - 'Cache.CACHED[ " +object.type + " ][ " + object.id + " ]'" );
		}
		
		return Console.info( "Executed - 'Cache.runId( " + object + " )'" );
	};

	/**	<function>getCache( Object )</function>
	 *	<return>array or false</return>
	 */
	this.getType = function( object ) {
		if ( !validate( object ) ) {
			return false;
		}
		
		return self.CACHED[ object.type ];
	};

	/**	<function>validate( Object )</function>
	 *	<return>true or false</return>
	 */	
	function validate( object ) {
		if ( !object.type ) {
			Console.errorLead( "'" + object + ".type' - property missing" );
		}
		
		if ( !object.id ) {
			Console.errorLead( "'" + object + ".id' - property missing" );
		}
		
		return Console.error( "'" + object + "' - failed Cache validation." );
	};
};

function Caching() {
	/**	<function>cache( Void )</function>
	 *	<return>this</return>
	 */
	this.cache = function() {
		var fC = Cache.cache( this );
		
		for ( vars in this ) {
			if ( fC[ vars ] ) {
			 	this[ vars ] = fC[ vars ];
			}
		}
		
		return this;
	};
	
	this.toString = function() { return "[" + this.type + "]" };
	return false;
}