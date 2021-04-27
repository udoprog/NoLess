var Forum = Xite.create(
	"main_content" , 
	{
		xboot: function( object ) {
			
		},
		xunboot: function( object ) {
			
		},
		xite: "forum/main",
		css: "forum/main"
	}
);

Forum.addXte(
	"forum_thread_creation" ,	
	{
		xboot: function( object ) {
			Forum.list( Forum.LIST_THREADS );
		},
		xunboot: function( object ) {
			
		},
		xite: "forum/thread_creation"
	}
)

Forum.addXte(
	"forum_entry_creation" ,	
	{
		xboot: function( object ) {
			Forum.list( Forum.LIST_ENTRIES );
		},
		xunboot: function( object ) {
			
		},
		xite: "forum/entry_creation"
	}
)

Forum.relist = function( id ) {
	if ( Try.ifValid( id ) ) Forum.thread_id = id;
	Forum.list( Forum.LIST_THREADS );
	Forum.list( Forum.LIST_ENTRIES );
};

Forum.switchEntryMenu = function( id , bypass ) {	
	var id = "emenu_" + id;
	
	Fx.switchVisible( $( id ) );
	
	$( id ).hidden = !$( id ).hidden;

	return false;
}

Forum.LIST_THREADS = 1;
Forum.LIST_ENTRIES = 2;

Forum.LIST_THREAD_ID = "forum_thread_list";
Forum.LIST_ENTRY_ID = "forum_entry_list";
Forum.THREAD_TREE_ID = "forum_thread_tree";

Forum.list = function( type ) {
	var Query = new Object();
	
	Query.action = "list";
	Query.thread_id = Forum.thread_id;
	
	switch( type ) {
		case Forum.LIST_THREADS:
			Query.list = "threads";
			break;
		case Forum.LIST_ENTRIES:
			Query.list = "entries";
			break;
	}
	
	/*
		101: thread list
		111: tree_name and tree_id fetch
		102: entry list
		103: thread navigation tree
		
		201: thread msg
		202: entry msg
		
	*/
	
	XCom.simpleCall(
		{
			op: "forumManager",
			params: Query,
			xco_101: function( xco ) {
				var sxe = xco.content.sxe;
				var t_id =		sxe.spath( "/id" ).$;
				var t_name =	sxe.spath( "/name" ).$;
				
				var thread_div = $E( "div" );						thread_div.className = "forum_thread";
				
				$TxT(
					"<span onclick='Forum.relist(" + t_id + ")' class='link'>" + t_name + "</a>",
					thread_div
				)
				
				$( Forum.LIST_THREAD_ID ).appendChild( thread_div );
				
				return false;
			},
			xco_101_begin: function() {
				$Clear( $( "forum_thread_messages" ) );
				$Clear( $( Forum.LIST_THREAD_ID ) );
			},
			xco_102: function( xco ) {
				var sxe = xco.content.sxe;
				var e_id =			sxe.spath( "/id" ).$;
				var e_content =		sxe.spath( "/content" ).$;
				var e_author_name =	sxe.spath( "/author_name" ).$;
				var e_author_id =	sxe.spath( "/author_id" ).$;
				
				var entry_div = $E( "div" , "forum_entry" );
				var entry_left = entry_div.appendChild( $E( "div" , "forum_entry_left" ) );
				var entry_right = entry_div.appendChild( $E( "div" , "forum_entry_right" ) );
				
				var entry_menu = entry_div.appendChild( $E( "div" , "forum_entry_menu" ) );
				
				Fx.hide( entry_menu );
				
				var quote_content = "<div class='forum_entry_quote'>" + e_content + "</div>\nWritten By: " + e_author_name + "<br /><br />\n";
				
				var QuoteSpan = $E( "span" , "link" );
				$TxT( "Quote" , QuoteSpan );
				QuoteSpan.onclick = function() {
					$TxT( quote_content , $Clear( $( 'forum_create_entry_input' ) ) );
					
					return false;
				}
				
				var HideSpan = $E( "span" , "link" );
				$TxT( "Hide" , HideSpan );
				HideSpan.onclick = function() {
					Forum.switchEntryMenu( e_id );
					return false;
				}
				
				var RemoveSpan = $E( "span" , "link" );
				$TxT( "Remove" , RemoveSpan );
				RemoveSpan.onclick = function() {
					Forum.remove_entry( e_id );
					return false;
				}
				
				entry_menu.appendChild( RemoveSpan );
				entry_menu.appendChild( $E( "br" ) );
				entry_menu.appendChild( $T( " - - - - - - " ) );
				entry_menu.appendChild( $E( "br" ) );
				entry_menu.appendChild( QuoteSpan );
				entry_menu.appendChild( $E( "br" ) );
				entry_menu.appendChild( HideSpan );
				entry_menu.appendChild( $E( "br" ) );
				
				entry_menu.id = "emenu_" + e_id;
				entry_menu.hidden = true;

				var entry_unfloat =  entry_div.appendChild( $E( "div" ) );	entry_unfloat.className = "forum_entry_unfloat";
				
				entry_left.appendChild( $T( e_author_name ) );
				
				$TxT(
					e_content +
					"<br /><span" + 
					" onclick=\"Forum.switchEntryMenu(" + e_id + ")\"" + 
					" class='link'>Actions</span>",
					entry_right
				);

				$( Forum.LIST_ENTRY_ID ).appendChild( entry_div );
				
				return false;
			},
			xco_102_begin: function() {
				$Clear( $( "forum_entry_messages" ) );
				$Clear( $( Forum.LIST_ENTRY_ID ) );
			},
			xco_201: function( xco ) {
				var msg = xco.content.$
				
				$TxT( msg , $Clear( $( "forum_thread_messages" ) ) );
				$Clear( $( Forum.LIST_THREAD_ID ) );
				
				return false;
			},
			xco_202: function( xco ) {
				var msg = xco.content.$
				
				$TxT( msg , $Clear( $( "forum_entry_messages" ) ) );
				$Clear( $( Forum.LIST_ENTRY_ID ) );
				
				return false;
			},
			xco_111: function( xco ) {
				var sxe = xco.content.sxe;
				
				var t_tree_name =	sxe.spath( "/tree_name" ).$;
				var t_tree_id =		sxe.spath( "/tree_id" ).$;
				var t_name =		sxe.spath( "/name" ).$;
				var t_id =			sxe.spath( "/id" ).$;
				
				var a_tree_names =	t_tree_name.split('/');
				var a_tree_ids =		t_tree_id.split('/');
				
				var thread_tree_string = "/";
				
				for ( var i = 1 ; name = a_tree_names[ i ] ; i++ ) {
					thread_tree_string += "<span class='forum_thread_tree_link' onclick='Forum.relist(" + a_tree_ids[ i ] + ")' >" + name + "</span>/";
				}
				
				$TxT( thread_tree_string + t_name , $Clear( $( "forum_thread_tree" ) ) );
				
				return false;
			}
		}
	)
}

Forum.ENTRY_MSG_ID = "forum_create_entry_msg";

Forum.create_entry = function() {
	var Query = Make.query.fromForm( $( "EntryForm" ) );
	Query.action = "create";
	Query.create = "entry";
	Query.thread_id = Forum.thread_id;
	
	try {
		var Query = Make.query.validation(
			Query , 
			{
				name: "content",
				failId:	"forum_entry_message",
				evalid: {  
					test: 32768,
					property: "length",
					mod: "<="
				},
				
				fail: {
					global:	"Validation of entry name failed",
					eqless:	"Entry must me less or equal to 32768 characters, yours was " + ( Query.name ? Query.name.length : 0 ),
					invalid:	"You must fill in a valid entry"
				}
			}
		);
	} catch( e ) {
		return false;
	}
	
	/*
		100: sucessful creation
		400: error
	*/
	
	var create_entry_msg = $( Forum.ENTRY_MSG_ID );
	
	XCom.simpleCall(
		{
			op: "forumManager",
			params: Query,
			xco_100: function( xco ) {
				$TxT( xco.content.$ , create_entry_msg );
				Forum.list( Forum.LIST_ENTRIES );
				return false;
			},
			xco_100_begin: function() {
				$Clear( $( "forum_create_entry_input" ) );
			},
			xco_400: function( xco ) {
				$TxT( xco.content.$ , create_entry_msg );
				return false;
			}
		}
	)
	
	return false;
}

Forum.create_thread = function( ) {
	var Query = Make.query.fromForm( $( "ThreadForm" ) );
	Query.action = "create";
	Query.create = "thread";
	Query.thread_id = Forum.thread_id;
	
	try {
		var Query = Make.query.validation(
			Query , 
			{
				name: "name",
				failId:	"forum_thread_message",
				evalid: {  
					test: 128,
					property: "length",
					mod: "<="
				},
				
				fail: {
					global:		"Validation of thread name failed",
					eqless:		"Thread name must me less or equal to 128 characters, yours was " + ( Query.name ? Query.name.length : 0 ),
					invalid:	"You must fill in a valid thread name"
				}
			}
		);
	} catch( e ) {
		return false;
	}
	
	var create_entry_msg = $( Forum.ENTRY_MSG_ID );
	
	XCom.simpleCall(
		{
			op: "forumManager",
			params: Query,
			xco_100: function( xco ) {
				$TxT( xco.content.$ , create_entry_msg );
				Forum.list( Forum.LIST_THREADS );
				return false;
			},
			xco_400: function( xco ) {
				$TxT( xco.content.$ , create_entry_msg );
				return false;
			}
		}
	)
	
	return false;
}


Forum.remove_entry = function( id ) {
	Query = new Object();
	Query.action = "remove";
	Query.remove = "entry";
	Query.id = id;
	
	Query.thread_id = Forum.thread_id;
	
	XCom.simpleCall(
		{
			op: "forumManager",
			params: Query,
			xco_100: function( xco ) {
				$TxT( xco.content.$ , $( Forum.ENTRY_MSG_ID ) );
				Forum.list( Forum.LIST_ENTRIES );
				return false;
			},
			xco_400: function( xco ) {
				$TxT( xco.content.$ , $( Forum.ENTRY_MSG_ID ) );
				return false;
			}
		}
	)
	
	return false;
}

function boot_forum( thread_id ) {
	Forum.thread_id = thread_id;
	Forum.start();
}
