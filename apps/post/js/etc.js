/**
 * javascript/etc.js
 * 
 * Scripts to perform minor scripts.
 */
 
function boot() {
	$link( 'navigation_main' , "navigation" );
	$link( 'main_content' , "main" );
	$link( 'top_large_rightbox' , "users/top_large_rightbox" );
	$link( 'top_small_rightbox' , "users/top_small_rightbox" );
}

function act_ViewForum( id ) {
	boot_forum( id );
}

function ToggleTop( isLarge ) {
	TopIsLarge = isLarge || TopIsLarge;
	
	var hideElement = TopIsLarge ? $( "top_large" ) : $( "top_small" ) ;
	var showElement = TopIsLarge ? $( "top_small" ) : $( "top_large" ) ;
	
	TopIsLarge = !TopIsLarge;
	
	showElement.style.display = "block";
	
	hideElement.style.display = "none";
	
	return false;
}

function act_Logout( ) {
	var Query = {
		action: "logout"
	};
	
	XCom.simpleCall({
		op: "userManager",
		params: Query,
		xco_100: function( xco ) {
			$link( 'top_large_rightbox' );
			$link( 'top_small_rightbox' );
		},
		xco_400: function( xco ) {
			alert( "Error: " + xco.content.$ );
		},
		xco_begin: function( resp ) {
			
		}
	});
}

function frm_LoginSubmit() {
	var Query = Make.query.fromForm( $( "LoginForm" ) );
	
	try {
		var Query = Make.query.validation(
			Query , 
			{
				name: "name",
				failId:	"login_error",
				evalid: {  },
				fail: {
					global:		"Validation failed",
					invalid:	"You must fill in valid username"
				}
			},
			{
				name: "pass",
				failId:	"login_error",
				evalid: {  },
				fail: {
					global:	"Validation failed",
					invalid:	"You must fill in valid password"
				}
			}
		);
	} catch( e ) {
		return false;
	}
	
	if ( !Query ) return false;
	
	Query.action = "login";
	
	XCom.simpleCall({
		op: "userManager",
		params: Query,
		xco_100: function( xco ) {
			$( "login_error" ).appendChild( $T( xco.content.$ ) );
			$( "login_error" ).appendChild( $E( "br" ) );
			$link( 'top_large_rightbox' , 'users/top_large_rightbox' );
			$link( 'top_small_rightbox' , 'users/top_small_rightbox' );
		},
		xco_400: function( xco ) {
			$( "login_error" ).appendChild( $T( xco.content.$ ) );
			$( "login_error" ).appendChild( $E( "br" ) );
		},
		xco_begin: function( resp ) {
			$Clear( $( "login_error" ) );
		}
	});
	
	
	return false;
}

function act_ListNews() {
	Query = new Object();
	Query.action = "list_news";
	
	XCom.simpleCall({
		op: "forumManager",
		params: Query,
		xco_100: function( xco ) {
			var content = xco.content.sxe.spath( "/list/content" ).$;
			var author = xco.content.sxe.spath( "/list/author_name" ).$;
			
			var news_entry = $E( "div" );
			news_entry.className = "content_news_list_entry";
			$TxT( unescape( content ) + "<br />written by: <b>" + author + "</b>" , news_entry );
			
			$( "content_news_list" ).appendChild( news_entry );
		},
		xco_400: function( xco ) {
			alert( "failed to get news" );
		},
		xco_begin: function( resp ) {
			$Clear( $("content_news_list") );
		}
	})
	
	return false;
}