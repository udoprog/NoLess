function frm_RegisterSubmit() {
	var Query = Make.query.fromForm( $( "RegisterForm" ) );
	
	var EvalidLow = {
		test: 5,
		property: "length",
		mod: ">="
	};
	
	var EvalidHigh = {
		test: 32,
		property: "length",
		mod: "<="
	};
	
	var StupidPasses = {
		test: [ "PASSWORD" , Query.name , Query.email ],
		mod: "!="
	}
	
	try {
		var Query = Make.query.validation(
			Query , 
			{
				name: "name",
				failId:	"register_message",
				evalid: [ EvalidLow, EvalidHigh ],
				fail: {
					global:		"Username validation failed",
					invalid:	"You must fill in valid username",
					eqlarge:	"Username can't be less than 5 characters (5-32)",
					eqless:		"Username can't be larger than 32 characters (5-32)",
					preg:		"Preg pattern mismatch"
				}
			},
			{
				name: "pass",
				failId:	"register_message",
				evalid: [ EvalidLow, EvalidHigh , StupidPasses ],
				fail: {
					global:		"Password validation failed",
					invalid:	"You must fill in valid password",
					eqlarge:	"Password can't be less than 5 characters (5-32)",
					eqless:		"Password can't be larger than 32 characters (5-32)",
					equal:		"Password check not equal",
					preg:		"Preg pattern mismatch",
					notequal:	"You may not have such a simple password"
				}
			},
			{
				name: "pass_check",
				failId:	"register_message",
				evalid: {
					test: Query.pass,
					mod: "=="
				},
				fail: {
					global:		"Password check validation failed",
					invalid:	"You must fill in valid string in password check",
					equal:		"Password check not equal"
				}
			},
			{
				name: "email",
				failId:	"register_message",
				evalid: [
					{
						test:		6,
						property:	"length",
						mod:		">="
					},
					{
						preg:		/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/
					}
				],
				fail: {
					global:		"Email validation failed",
					invalid:	"Please fill in valid email",
					eqlarge:	"Email too short",
					preg:		"Email is invalid"
				}
			},
			{
				name: "email_check",
				failId:	"register_message",
				evalid: {
					test: Query.email,
					mod: "=="
				},
				fail: {
					global:		"Email validation failed",
					invalid:	"You must fill in valid string in email check",
					equal:		"email check not equal"
				}
			},
			{
				name: "avatar_url",
				failId: "register_message",
				evalid: {
					test: 16,
					property: "length",
					mod: ">=",
					optional: true
				},
				fail: {
					global: 	"Avatur URL validation failed",
					eqlarge: 	"Avatar URL too short"
				}
			},
			{
				name: "location",
				failId: "register_message",
				evalid: {
					test: 2,
					property: "length",
					mod: ">=",
					optional: true
				},
				fail: {
					global: 	"Location validation failed",
					eqlarge: 	"Location is too short"
				}
			},
			{
				name: "im_jabber",
				failId: "register_message",
				evalid: {
					test: 6,
					property: "length",
					mod: ">=",
					optional: true
				},
				fail: {
					global: 	"Jabber contact validation failed",
					eqlarge: 	"Jabber contact is too short"
				}
			},
			{
				name: "im_msn",
				failId: "register_message",
				evalid: {
					test: 6,
					property: "length",
					mod: ">=",
					optional: true
				},
				fail: {
					global: 	"MSN Messenger contact validation failed",
					eqlarge: 	"MSN Messenger contact is too short"
				}
			},
			{
				name: "im_icq",
				failId: "register_message",
				evalid: {
					optional: true
				},
				fail: {
					global: 	"ICQ contact validation failed"
				}
			},
			{
				name: "im_aim",
				failId: "register_message",
				evalid: {
					test: 6,
					property: "length",
					mod: ">=",
					optional: true
				},
				fail: {
					global: 	"AIM contact validation failed",
					eqlarge: 	"AIM contact is too short"
				}
			},
			{
				name: "im_yahoo",
				failId: "register_message",
				evalid: {
					test: 6,
					property: "length",
					mod: ">=",
					optional: true
				},
				fail: {
					global: 	"Yahoo Messenger contact validation failed",
					eqlarge: 	"Yahoo Messenger contact is too short"
				}
			},
			{
				name: "signature",
				failId: "register_message",
				evalid: {
					test: 512,
					property: "length",
					mod: "<=",
					optional: true
				},
				fail: {
					global: 	"Signature validation failed",
					eqless: 	"Signature too long, must be shorter or equal to 512 characters, yours was " + ( Query.signature ? Query.signature.length : 0 )
				}
			}
		);
	} catch( e ) {
		return false;
	}
	
	if ( !Query ) return false;
	
	Query.action = "register";
	XCom.simpleCall({
		op: "userManager",
		params: Query,
		xco_100: function( xco ) {
			$Clear( $( "register_content" ) );
			$( "register_message" ).appendChild( $T( xco.content.$ ) );
			$( "register_message" ).appendChild( $E( "br" ) );
			$link( "main_content" );
		},
		xco_400: function( xco ) {
			$( "register_message" ).appendChild( $T( xco.content.$ ) );
			$( "register_message" ).appendChild( $E( "br" ) );
		},
		xco_begin: function( resp ) {
			$Clear( $( "register_message" ) );
		}
	})
	
	return false;
}