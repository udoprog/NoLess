/**
 * javascript/action.js
 * 
 * Scripts to perform actions, http requests and talking to php scripts.
 * 
 * 
 * TODO:
 *   - Fix the onload function to chech for hash, if so, don't load the rest,
 *     otherwise load the rest using the DOM.
 * 
 */
 

var ajaxObj = null;
var xhttpAction = null;
var reply_exists = false;



/**
 * Main object, which contains all the functions.
 */
function Action() {

};

/**
 * Reply to post in a thread and send the variables onwards to 
 * the next function, which will contact the php-script.
 *
 * @bool 0 = reply to thread, 1 = make thread.
 * @thid Thread ID.
 */
Action.prototype.post = function( bool, thid ) {
	var _threadname, _nick, _msg, _forum, _thid, _sforum;
	
	_threadname = document.getElementById( "title" ).value;
	_nick       = document.getElementById( "nick" ).value;
	_msg        = document.getElementById( "msg" ).value;
	_thid		= thid;
	
	
	
	/* Check the threadname. */
	if ( !_threadname && bool == "1" ) {
		extra = document.getElementById( "post_title_extra" ); var ii = 0;
		/* Remove every child in the element. */
		while ( extra.firstChild ) { extra.removeChild(extra.firstChild); ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; } }			
		extra.appendChild( document.createTextNode( "You must enter a name for your thread." ) );
		return;
	}
	
	/* If creating a thread. */
	if ( bool == "1" ) {
		_sforum      = document.getElementById("forum").value;	
		if ( _sforum == "blank" ) {
			extra = document.getElementById('post_title_extra'); var ii = 0;
			/* Remove every child in the element. */
			while (extra.firstChild) { extra.removeChild(extra.firstChild);	ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }	}
			
			extra = document.getElementById('post_forum_extra'); var ii = 0;
			/* Remove every child in the element. */
			while (extra.firstChild) { extra.removeChild(extra.firstChild);	ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }	}				
			extra.appendChild(document.createTextNode("You must choose a forum to post in."));
			return;
		}
	}
	
	/* Check the username. */
	if ( !_nick ) {
		if ( bool == "1" ) {
			extra = document.getElementById( "post_title_extra" ); var ii = 0;
			/* Remove every child in the element. */
			while (extra.firstChild) { extra.removeChild(extra.firstChild);	ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }	}
		
			extra = document.getElementById( "post_forum_extra" ); var ii = 0;
			/* Remove every child in the element. */
			while (extra.firstChild) { extra.removeChild(extra.firstChild);	ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }	}
		}
		
		extra = document.getElementById('post_username_extra'); var ii = 0;
		/* Remove every child in the element. */
		while (extra.firstChild) { extra.removeChild(extra.firstChild); ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; } }			
		extra.appendChild(document.createTextNode("You must enter your name."));
		return;
	}
	
	/* Check the message. */
	if ( !_msg ) {
		if ( bool == "1" ) {
			extra = document.getElementById('post_title_extra'); var ii = 0;
			/* Remove every child in the element. */
			while (extra.firstChild) { extra.removeChild(extra.firstChild);	ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }	}
		
			extra = document.getElementById('post_forum_extra'); var ii = 0;
			/* Remove every child in the element. */
			while (extra.firstChild) { extra.removeChild(extra.firstChild);	ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }	}
		}
		
		extra = document.getElementById('post_username_extra'); var ii = 0;
		/* Remove every child in the element. */
		while (extra.firstChild) { extra.removeChild(extra.firstChild); ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; } }
		
		extra = document.getElementById('post_msg_extra'); var ii = 0;
		/* Remove every child in the element. */
		while (extra.firstChild) { extra.removeChild(extra.firstChild); ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; } }			
		extra.appendChild(document.createTextNode("You must write a message for your thread."));
		return;
	}
	
	if ( bool == "1" ) {
			 if ( _sforum >= 0  && _sforum < 5  ) { var _forum = '0' }
		else if ( _sforum >= 5  && _sforum < 10 ) { var _forum = '1' }
		else if ( _sforum >= 10 && _sforum < 14 ) { var _forum = '2' }
		else if ( _sforum >= 14 && _sforum < 19 ) { var _forum = '3' }
		else if ( _sforum >= 19 && _sforum < 24 ) { var _forum = '4' }
		else if ( _sforum >= 24 && _sforum < 30 ) { var _forum = '5' }		
		else {
			var ii = 0;
			
			ctn_main = document.getElementById( "ctn_main" );
			while (ctn_main.firstChild) {
				ctn_main.removeChild(ctn_main.firstChild);
				ii++; if ( ii > 100 ) { alert("Error 0003."); break; }
			}
			
			var ctn_main_p = document.createElement( "p" );
			var txtNode = document.createTextNode( "Error, try again or tell the devs that the script fucked up." );
			ctn_main_p.appendChild( txtNode );
			ctn_main.appendChild( ctn_main_p );
			return;
		}
	}

	url = "./main.php";
	if ( bool == '0' ) { vars = "post=" + bool + "&thname=" + _threadname + "&nick=" + _nick + "&msg=" + _msg + "&thid="  + _thid;  }
	else         { vars = "post=" + bool + "&thname=" + _threadname + "&nick=" + _nick + "&msg=" + _msg + "&forum=" + _forum + "&sforum=" + _sforum; }
	
	//ctn_main = document.getElementById( "ctn_main" );
	content = document.getElementById( "content" );

	var ii = 0;
	while ( content.firstChild ) {
		content.removeChild( content.firstChild );
		ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }
	}
	
	var div = document.createElement( "div" );
		div.setAttribute( "id", "loading_bar" );
		var divText = document.createTextNode( "Loading" );
	div.appendChild( divText );
	content.appendChild( div );
	
	this.sendRequest( url, vars, true );
};
	
/**
 * Contant the php-script and send some variables with it.
 *
 * @_url Url to call.
 * @_vars Variables to send to the url.
 */
Action.prototype.sendRequest = function( _url, _vars, asynch ) {
	request = xhttpAction;
	
	request.open( "POST", _url, asynch );
	request.onreadystatechange = this.callbackMethod;

	/* Needed for POST requests */
	var content_type = "application/x-www-form-urlencoded";
	request.setRequestHeader( "Content-Type", content_type );

	/* Data is sent as URL-encoded key=val */
	request.send( _vars );
	
	return request;
};
	
/**
 * The function that's being called when the request is done.
 */
Action.prototype.callbackMethod = function( ) {
		 if ( request.readyState == 0 ) { var txtNode = document.createTextNode( ".." ); document.getElementById( "loading_bar" ).appendChild( txtNode ); }
	else if ( request.readyState == 1 ) { var txtNode = document.createTextNode( "." ); document.getElementById( "loading_bar" ).appendChild( txtNode ); }
	else if ( request.readyState == 2 ) { var txtNode = document.createTextNode( "." ); document.getElementById( "loading_bar" ).appendChild( txtNode ); }
	else if ( request.readyState == 3 ) { var txtNode = document.createTextNode( "." ); document.getElementById( "loading_bar" ).appendChild( txtNode ); }
	
	/* readyState 4 = complete  */
	if (request.readyState == 4) {
		/* status 200 = OK */
		if (request.status == 200) {
			var content = document.getElementById( "content" );
			
			var ii = 0;
			while ( content.firstChild ) {
				content.removeChild( content.firstChild );
				ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }
			}
			
			content.innerHTML = request.responseText;
			
		}
		/* status 404 = Not found */
		else if (request.status == 404)
			this.showText("Request URL does not exist");
		else if (request.status == 12030) {
			this.showText("Error: 12030<br /><br />ERROR_WINHTTP_CONNECTION_ERROR<br /> "  + 
				"\"The connection with the server has been reset or terminated, or "  + 
				"an incompatible SSL protocol was encountered. For example, WinHTTP " +
				"version 5.1 does not support SSL2 unless the client specifically "   +
				"enables it.\" - MSDN<br /><br />Try again, it should solve the "     +
				"problem. This has to do with IE and SSL not being best friends.");
		}
		else {
			this.showText("Error: " + request.status);
		}
	}
};
	
/** 
 * Create a request that we can use depending on which browser the visitor is using.
 */
Action.prototype.createRequestObject = function() {
	return ( window.XMLHttpRequest ) ? new XMLHttpRequest() : ( window.ActiveXObject ) ? new ActiveXObject("Microsoft.XMLHTTP") : null ;
};

Action.prototype.makeElementOption = function( tag_destination, tag_value, tag_text ) {
	var newElement = document.createElement( "option" );
		newElement.setAttribute( "value", tag_value );
		
		var textNode = document.createTextNode( tag_text );
		newElement.appendChild( textNode );
		
		if ( tag_value == "blank" ) newElement.setAttribute( "disabled", "disabled" );
		
	tag_destination.appendChild( newElement );
};
	
/**
 * Show the reply form in a table, and use the argument to define if 
 * you want to reply to a thread (0) or create a thread (1).
 */
Action.prototype.reply = function( action, thid ) {
	if ( action == 1 ) {
		ctn_main = document.getElementById( "ctn_main" );
		
		var ii = 0;
		while ( ctn_main.firstChild ) {
			ctn_main.removeChild( ctn_main.firstChild );
			ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }
		}
		
		var ctnElement = document.createElement( "div" );
			ctnElement.setAttribute( "id", "ctn_reply_form" );
		
			var replyRoot = document.createElement( "div" );
				replyRoot.setAttribute( "class", "ctn_fill" );
				
				var replyForm = document.createElement( "form" );
					replyForm.setAttribute( "method", "POST" );
					replyForm.setAttribute( "action", "javascript:ajaxObj.post('" + action + "', '" + thid + "');" );
					
					var replyTable = document.createElement( "table" );
						replyTable.setAttribute( "id", "ctn_table_reply" );
						replyTable.setAttribute( "cellpadding", "0" );
						replyTable.setAttribute( "cellspacing", "0" );
						replyTable.setAttribute( "border", "0" );
						
						var replyTableTr0 = document.createElement( "tr" );
							var replyTableTr0Td0 = document.createElement( "td" );
								replyTableTr0Td0.setAttribute( "class", "inc_reply_leftcol" );									
								var replyTableTr0Td0TextNode = document.createTextNode( "Title: " );									
								replyTableTr0Td0.appendChild( replyTableTr0Td0TextNode );
							
							var replyTableTr0Td1 = document.createElement( "td" );											
								var replyTableTr0Td1Input = document.createElement( "input" );
									replyTableTr0Td1Input.setAttribute( "class", "inc_form_input" )
									replyTableTr0Td1Input.setAttribute( "type", "text" );
									replyTableTr0Td1Input.setAttribute( "name", "th" );
									replyTableTr0Td1Input.setAttribute( "id", "title" );
								
								var replyTableTr0Td1Div = document.createElement( "div" );
									replyTableTr0Td1Div.setAttribute( "id", "post_title_extra" );
								
								replyTableTr0Td1.appendChild( replyTableTr0Td1Input );
								replyTableTr0Td1.appendChild( replyTableTr0Td1Div );
							
							replyTableTr0.appendChild( replyTableTr0Td0 );
							replyTableTr0.appendChild( replyTableTr0Td1 );
							
						
						var replyTableTr1 = document.createElement( "tr" );
							var replyTableTr1Td0 = document.createElement( "td" );
								replyTableTr1Td0.setAttribute( "class", "inc_reply_leftcol" );
								
								var replyTableTr1Td0TextNode = document.createTextNode( "Forum: " );
								
								replyTableTr1Td0.appendChild( replyTableTr1Td0TextNode );
								
							var replyTableTr1Td1 = document.createElement( "td" );
								var replyTableTr1Td1Select = document.createElement( "select" );
									replyTableTr1Td1Select.setAttribute( "class", "inc_reply_select" );
									replyTableTr1Td1Select.setAttribute( "id", "forum" );
									
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "blank", 	"Announcements" 		);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "0", 	"-- Updates" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "1", 	"-- Events" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "2", 	"-- Rules" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "3", 	"-- FAQ" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "4", 	"-- Other" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "blank", "Theories" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "5", 	"-- Evil Plans" 			);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "6", 	"-- Good Plans" 			);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "7", 	"-- Scientific Theories" 	);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "8", 	"-- Theories of Life" 		);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "9", 	"-- Other" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "blank", "Projects" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "10", 	"-- Structure and Planing" 	);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "11", 	"-- Help" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "12", 	"-- Projects" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "13", 	"-- Other" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "blank", "Off Topic" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "14", 	"-- Food" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "15", 	"-- Pets" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "16", 	"-- Dreams" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "17", 	"-- Work / School" 			);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "18", 	"-- Other" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "blank", "Programming" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "19", 	"-- C / C++ / C#" 			);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "20", 	"-- PHP" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "21", 	"-- Java" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "22", 	"-- HTML / CSS" 			);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "23", 	"-- Other" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "blank", "Other" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "24", 	"-- Thoughts" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "25", 	"-- Math" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "26", 	"-- Physics" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "27", 	"-- Style" 					);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "28", 	"-- Religion" 				);
										ajaxObj.makeElementOption( replyTableTr1Td1Select, "29", 	"-- Other" 					);
										
								var replyTableTr1Td1Div = document.createElement( "div" );
									replyTableTr1Td1Div.setAttribute( "id", "post_forum_extra" );
										
								replyTableTr1Td1.appendChild( replyTableTr1Td1Select );
								replyTableTr1Td1.appendChild( replyTableTr1Td1Div );
							
							replyTableTr1.appendChild( replyTableTr1Td0 );
							replyTableTr1.appendChild( replyTableTr1Td1 );
							
								
						var replyTableTr2 = document.createElement( "tr" );
							var replyTableTr2Td0 = document.createElement( "td" );
								replyTableTr2Td0.setAttribute( "class", "inc_reply_leftcol" );
								
								var replyTableTr2Td0TextNode = document.createTextNode( "Username: " );
								
								replyTableTr2Td0.appendChild( replyTableTr2Td0TextNode );
							
							var replyTableTr2Td1 = document.createElement( "td" );
								var replyTableTr2Td1Input = document.createElement( "input" );
									replyTableTr2Td1Input.setAttribute( "class", "inc_form_input" )
									replyTableTr2Td1Input.setAttribute( "type", "text" );
									replyTableTr2Td1Input.setAttribute( "name", "nick" );
									replyTableTr2Td1Input.setAttribute( "id", "nick" );
									
								var replyTableTr2Td1Div = document.createElement( "div" );
									replyTableTr2Td1Div.setAttribute( "id", "post_username_extra" );
								
								replyTableTr2Td1.appendChild( replyTableTr2Td1Input );
								replyTableTr2Td1.appendChild( replyTableTr2Td1Div );
								
							replyTableTr2.appendChild( replyTableTr2Td0 );
							replyTableTr2.appendChild( replyTableTr2Td1 );
							
							
						var replyTableTr3 = document.createElement( "tr" );
							var replyTableTr3Td0 = document.createElement( "td" );
								replyTableTr3Td0.setAttribute( "class", "inc_reply_leftcol" );
								
								var replyTableTr3Td0TextNode = document.createTextNode( "Message: " );
									replyTableTr3Td0.appendChild( replyTableTr3Td0TextNode );
							
							var replyTableTr3Td1 = document.createElement( "td" );
								var replyTableTr3Td1TextArea = document.createElement( "textarea" );
									replyTableTr3Td1TextArea.setAttribute( "class", "inc_form_textarea" );
									replyTableTr3Td1TextArea.setAttribute( "size", "20" );
									replyTableTr3Td1TextArea.setAttribute( "name", "msg" );
									replyTableTr3Td1TextArea.setAttribute( "id", "msg" );
						
								var replyTableTr3Td1Div = document.createElement( "div" );
									replyTableTr3Td1Div.setAttribute( "id", "post_msg_extra" );
								
								replyTableTr3Td1.appendChild( replyTableTr3Td1TextArea );
								replyTableTr3Td1.appendChild( replyTableTr3Td1Div );
						
							replyTableTr3.appendChild( replyTableTr3Td0 );
							replyTableTr3.appendChild( replyTableTr3Td1 );
							
						
						var replyTableTr4 = document.createElement( "tr" );
							var replyTableTr4Td0 = document.createElement( "td" );
								replyTableTr4Td0.setAttribute( "colspan", "2" );
								
								var replyTableTr4Td0TextArea = document.createElement( "input" );
									replyTableTr4Td0TextArea.setAttribute( "type", "hidden" );
									replyTableTr4Td0TextArea.setAttribute( "id", "title" );
									replyTableTr4Td0TextArea.setAttribute( "value", "Title" );
									
								replyTableTr4Td0.appendChild( replyTableTr4Td0TextArea );
								
							replyTableTr4.appendChild( replyTableTr4Td0 );
							
						
						var replyTableTr5 = document.createElement( "tr" );
							var replyTableTr5Td0 = document.createElement( "td" );
								replyTableTr5Td0.setAttribute( "colspan", "2" );
								
								var replyTableTr5Td1Submit = document.createElement( "input" );
									replyTableTr5Td1Submit.setAttribute( "type", "submit" );
									replyTableTr5Td1Submit.setAttribute( "id", "button" );
									replyTableTr5Td1Submit.setAttribute( "class", "button_up" );
									replyTableTr5Td1Submit.setAttribute( "onmousedown", "javascript:etc.pushButton(1);" );
									replyTableTr5Td1Submit.setAttribute( "onmouseup", "javascript:etc.pushButton(0);" );
									replyTableTr5Td1Submit.setAttribute( "value", "Submit" );
									
								replyTableTr5Td0.appendChild( replyTableTr5Td1Submit );
								
							replyTableTr5.appendChild( replyTableTr5Td0 );
							
						replyTable.appendChild( replyTableTr0 );
						replyTable.appendChild( replyTableTr1 );
						replyTable.appendChild( replyTableTr2 );
						replyTable.appendChild( replyTableTr3 );
						replyTable.appendChild( replyTableTr4 );
						replyTable.appendChild( replyTableTr5 );
						
					replyForm.appendChild( replyTable );
					
				replyRoot.appendChild( replyForm );
				
			ctnElement.appendChild( replyRoot );
		
		ctn_main.appendChild( ctnElement );
		
	}
	
	else if ( action == 0 ) {
		content_reply = document.getElementById( "ctn_reply_form" );
		ctn_main = document.getElementById( "ctn_main" );
		
		var ii = 0;
		while ( content_reply.firstChild ) {
			content_reply.removeChild( content_reply.firstChild );
			ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }
		}
		
		document.getElementById( "ctn_threads" ).removeChild( content_reply );
		
		var ctnElement = document.createElement( "div" );
			ctnElement.setAttribute( "id", "ctn_reply_form" );
		
			var replyRoot = document.createElement( "div" );
				replyRoot.setAttribute( "class", "ctn_fill" );
				
				var replyForm = document.createElement( "form" );
					replyForm.setAttribute( "method", "POST" );
					replyForm.setAttribute( "action", "javascript:ajaxObj.post('" + action + "', '" + thid + "');" );
					
					var replyTable = document.createElement( "table" );
						replyTable.setAttribute( "id", "ctn_table_reply" );
						replyTable.setAttribute( "cellpadding", "0" );
						replyTable.setAttribute( "cellspacing", "0" );
						replyTable.setAttribute( "border", "0" );
						
						var replyTableTr0 = document.createElement( "tr" );
							var replyTableTr0Td0 = document.createElement( "td" );
								replyTableTr0Td0.setAttribute( "class", "post_reply_colleft" );
								
								var replyTableTr0Td0TextNode = document.createTextNode( "Username: " );
								
								replyTableTr0Td0.appendChild( replyTableTr0Td0TextNode );
							
							var replyTableTr0Td1 = document.createElement( "td" );
								var replyTableTr0Td1Input = document.createElement( "input" );
									replyTableTr0Td1Input.setAttribute( "class", "inc_form_input" )
									replyTableTr0Td1Input.setAttribute( "type", "text" );
									replyTableTr0Td1Input.setAttribute( "name", "nick" );
									replyTableTr0Td1Input.setAttribute( "id", "nick" );
									
								var replyTableTr0Td1Div = document.createElement( "div" );
									replyTableTr0Td1Div.setAttribute( "id", "post_username_extra" );
								
								replyTableTr0Td1.appendChild( replyTableTr0Td1Input );
								replyTableTr0Td1.appendChild( replyTableTr0Td1Div );
								
							replyTableTr0.appendChild( replyTableTr0Td0 );
							replyTableTr0.appendChild( replyTableTr0Td1 );
						
						
						var replyTableTr1 = document.createElement( "tr" );
							var replyTableTr1Td0 = document.createElement( "td" );
								replyTableTr1Td0.setAttribute( "class", "post_reply_colleft" );
								
								var replyTableTr1Td0TextNode = document.createTextNode( "Message: " );
									replyTableTr1Td0.appendChild( replyTableTr1Td0TextNode );
							
							var replyTableTr1Td1 = document.createElement( "td" );
								var replyTableTr1Td1TextArea = document.createElement( "textarea" );
									replyTableTr1Td1TextArea.setAttribute( "class", "inc_form_textarea" );
									replyTableTr1Td1TextArea.setAttribute( "size", "20" );
									replyTableTr1Td1TextArea.setAttribute( "name", "msg" );
									replyTableTr1Td1TextArea.setAttribute( "id", "msg" );
						
								var replyTableTr1Td1Div = document.createElement( "div" );
									replyTableTr1Td1Div.setAttribute( "id", "post_msg_extra" );
								
								replyTableTr1Td1.appendChild( replyTableTr1Td1TextArea );
								replyTableTr1Td1.appendChild( replyTableTr1Td1Div );
						
							replyTableTr1.appendChild( replyTableTr1Td0 );
							replyTableTr1.appendChild( replyTableTr1Td1 );
						
						
						var replyTableTr2 = document.createElement( "tr" );
							var replyTableTr2Td0 = document.createElement( "td" );
								replyTableTr2Td0.setAttribute( "colspan", "2" );
								
								var replyTableTr2Td0TextArea = document.createElement( "input" );
									replyTableTr2Td0TextArea.setAttribute( "type", "hidden" );
									replyTableTr2Td0TextArea.setAttribute( "id", "title" );
									replyTableTr2Td0TextArea.setAttribute( "value", "Title" );
									
								replyTableTr2Td0.appendChild( replyTableTr2Td0TextArea );
								
							replyTableTr2.appendChild( replyTableTr2Td0 );
						
						
						var replyTableTr3 = document.createElement( "tr" );
							var replyTableTr3Td0 = document.createElement( "td" );
								replyTableTr3Td0.setAttribute( "colspan", "2" );
								
								var replyTableTr3Td1Submit = document.createElement( "input" );
									replyTableTr3Td1Submit.setAttribute( "type", "submit" );
									replyTableTr3Td1Submit.setAttribute( "value", "Submit" );
									replyTableTr3Td1Submit.setAttribute( "id", "button" );
									replyTableTr3Td1Submit.setAttribute( "class", "button_up" );
									replyTableTr3Td1Submit.setAttribute( "onmousedown", "javascript:etc.pushButton(1);" );
									replyTableTr3Td1Submit.setAttribute( "onmouseup", "javascript:etc.pushButton(0);" );
									
								replyTableTr3Td0.appendChild( replyTableTr3Td1Submit );
								
							replyTableTr3.appendChild( replyTableTr3Td0 );
						
						
						replyTable.appendChild( replyTableTr0 );
						replyTable.appendChild( replyTableTr1 );
						replyTable.appendChild( replyTableTr2 );
						replyTable.appendChild( replyTableTr3 );
					
					replyForm.appendChild( replyTable );
				
				replyRoot.appendChild( replyForm );
				
			ctnElement.appendChild( replyRoot );
			
		ctn_main.appendChild( ctnElement );
	}
};

/**
 * Tell the php-script to get the thread and show it.
 */
Action.prototype.getThread = function( thid ) {
	document.location.hash = "thid=" + thid;
	
	ctn_main = document.getElementById( "content" );
	
	var ii = 0;
	
	if ( ctn_main ) {
		while ( ctn_main.firstChild ) {
			ctn_main.removeChild( ctn_main.firstChild );
			ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }
		}
	}
	
	if ( isNaN( thid ) ) {
		var txtNode = document.createTextNode("Thread ID must be a number.");
		ctn_main.appendChild(txtNode);			
		return;
	}
	
	var div = document.createElement( "div" );
		div.setAttribute( "id", "loading_bar" );
		var divText = document.createTextNode( "Loading" );
	div.appendChild( divText );
	ctn_main.appendChild( div );	
	
	url = "./main.php";
	vars = "get=0&thid=" + thid;
	this.sendRequest( url, vars, true );
};

/**
 * Tell the php-script to get the forum and show it.
 */
Action.prototype.getForum = function( forumid, subforumid ) {
	if ( subforumid ) { document.location.hash = "fid=" + forumid + "&sfid=" + subforumid; }
	else { document.location.hash = "fid=" + forumid; }

	ctn_main = document.getElementById( "content" );
	
	var ii = 0;
	while (ctn_main.firstChild) {
		ctn_main.removeChild( ctn_main.firstChild );
		ii++; if ( ii > 100 ) { alert( "Error 0003." ); break; }
	}
	
	if ( isNaN( forumid ) ) {
		var txtNode = document.createTextNode( "Forum ID must be a number." );
		ctn_main.appendChild(txtNode);
		return;
	}
	
	if ( isNaN( subforumid ) ) {
		var txtNode = document.createTextNode( "Sub Forum ID must be a number." );
		ctn_main.appendChild(txtNode);
		return;
	}
	
	var div = document.createElement( "div" );
		div.setAttribute( "id", "loading_bar" );
		var divText = document.createTextNode( "Loading" );
	div.appendChild( divText );
	ctn_main.appendChild( div );	
	
	var vars = "get=2&forumid=" + forumid + "&subforumid=" + subforumid;
	
	this.sendRequest( './main.php', vars, true );
};

/**
 * Quickly show a message.
 */
Action.prototype.showText = function( txt ) {
	var span_node = document.createElement( "p", "p_msg" );
	span_node.setAttribute( "style", "color : #FF0000;" );
	span_node.appendChild(document.createTextNode(txt));
	
	document.getElementById( "ctn_main" ).appendChild( span_node );
};
	
/**
 * Call home and list the threads.
 */
Action.prototype.home = function( ) {		
	document.location.hash = "#";
	ctn_main = document.getElementById( "content" );
	
	var ii = 0;
	while ( ctn_main.firstChild ) {
		ctn_main.removeChild( ctn_main.firstChild );
		ii++; if ( ii > 100 ) { alert( "Error: 0003." ); break; }
	}
	var div = document.createElement( "div" );
		div.setAttribute( "id", "loading_bar" );
		var divText = document.createTextNode( "Loading" );
	div.appendChild( divText );
	ctn_main.appendChild( div );
	
	var temp = this.sendRequest( "./main.php", "get=1", true );
};

/**
 * Need to call it at the begining, otherwise nothing will happen.
 */
var ajaxObj = new Action();
var xhttpAction = new ajaxObj.createRequestObject();
