var NClientCom = {
	URL: "./query.php",
	METHOD: "post",
	STATES: /4/,
	operation: function( operation , query , onResponse , onFinalize ) {
		if ( !Ajax ) {
			alert( "Ajax Object must be implemented in order to run action!" );
			return false;
		}
		
		if ( Try.ifObject( query ) )
			var params = NClientCom.Obj2Qry( operation , query );
		else if ( Try.ifString( query ) ) {
			var params = query;
		}
		
		if ( !params ) return false;
		
		function NCCNotifier( xh ) {
			onResponse( xh );
			if ( onFinalize )
				onFinalize();
		}
		
		try {
			return Ajax.send( NClientCom.URL ,
				{
					method: NClientCom.METHOD,
					states: NClientCom.STATES,
					notify: NCCNotifier,
					parameters: params
				}
			)
		} catch ( e ) {
			throw e;
		}
		
		return false;
	},
	Obj2Qry: function( operation , vars ) {
		var params = "";
		
		var notEmpty = false;
		for ( key in vars ) {
			notEmpty = true;
			break;
		}
		
		if ( !notEmpty ) return false;
		
		for ( key in vars ) {
			if ( vars[key] instanceof Object )
				params += NClient.formatParams( key , vars[key] )
			else {
				params += "&" + operation + "[" + key  + "]=" + escape( vars[key] );
			}
		}
		
		return params;
	}
};