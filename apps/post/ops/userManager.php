<?
class userManager extends PostApp implements
							Operation ,
							Input_Post , 
							DB_Pgsql , 
							NSecurity , 
							Doc_XCom , 
							Output_Client
{
	private $errors = array();
	private $sql;
	private $nsecure;

	private $params = array();
	
	private function dump() {
		$this->resolveImp( "Doc_XCom" );
		$this->resolveImp( "Output_Client" );
		$this->after();
	}
	
	public function before() {
		
	}
	
	public function post( $post ) {
		$this->params = $post->getParam( "userManager" );
		
		if ( !isset( $this->params[ 'action' ] ) ) {
			$this->errors[] = "Action not specified";
			$this->dump();
			return false;
		} else {
			$this->action = $this->params[ 'action' ];
		}
		
		switch ( $this->action ) {
			case "login":
				
				if ( !isset( $this->params[ 'name' ] ) ) $this->errors[] = "'Username' not specified";
				if ( !isset( $this->params[ 'pass' ] ) ) $this->errors[] = "'Password' not specified";
				
				break;
			case "logout":
				break;
			case "register":
				
				if ( !isset( $this->params[ 'name' ] ) )	$this->errors[] =	"''Username' not specified";
				if ( !isset( $this->params[ 'pass' ] ) )	$this->errors[] =	"'Password' not specified";
				if ( !isset( $this->params[ 'email' ] ) )	$this->errors[] =	"'E-Mail' not specified";
				
				break;
		}
		
		return false;
	}
	
	public function pgsql( $db ) {
		$this->sql = $db;
		return false;
	}
	
	public function check( $sec ) {
		$this->nsecure = $sec;
		
		switch ( $this->action ) {
			case "login":
				try {
					$this->nsecure->db_Validate( $this->sql , $this->params[ 'name' ] , $this->params[ 'pass' ] );
					$this->nsecure->createSession( $this->params[ 'name' ] );
				} catch ( Exception $e ) {
					$this->errors[] = $e->getMessage();
					return false;
				}
				break;
			case "logout":
				$this->nsecure->killSession();
				break;
			case "register":
				$user = $this->nsecure->db_GetUser( $this->sql , array( "username" => $this->params[ 'name' ] ) );
				
				if ( $user ) {
					$this->errors[] = "User '" . $user['username'] . "' already exists";
					$this->dump();
					return false;
				}
				else unset( $user );
				
				try {
					$this->nsecure->db_InsertUser( $this->sql , 
						array(
							"username" =>	$this->params[ 'name' ],
							"password" =>	$this->params[ 'pass' ],
							"email" =>		$this->params[ 'email' ]
						)
					);
					
					$user = $this->nsecure->db_GetUser( $this->sql , array( "username" => $this->params[ 'name' ] ) );
					
					$this->sql->insert( "forum_user" , 
						array(
							"user_username" =>	$user['username'],
							"user_id" =>		$user['id']
						)
					);
				} catch ( Exception $e ) {
					$this->errors[] = $e->getMessage();
					return false;
				}
				
				break;
		}
		
		return true;
	}
	
	public function fallback( ) {
		$this->dump();
		return false;
	}
	
	public function document( $xml ) {
		if ( count( $this->errors ) ) {
			foreach ( $this->errors as $error ) {
				$xml->append( 400 , $error );
			}
		} else {
			switch ( $this->action ) {
				case "login":
					$xml->append( 100 , "You have sucessfully logged in!" );
					break;
				case "logout":
					$xml->append( 100 , "You have sucessfully logged out!" );
					break;
				case "register":
					$xml->append( 100 , "User sucessfully created!" );
					break;
			}
		}
	}
	
	public function output( $output ) {
		$output->document( $this->document );
	}
	
	public function after() {
		$this->kill();
	}
}
?>