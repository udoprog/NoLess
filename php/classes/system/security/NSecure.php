<?php

class NSecure extends System {
	const S_NAME = "name";
	
	private $sql = null;
	
	public function attachSql( $sql ) {
		$this->sql = $sql;
		
		return false;
	}
	
	public function db_InsertUser( $sql , $userArray ) {
		try {
			$sql->insert( "nsecure" , 
				array(
					"username" => $userArray[ 'username' ],
					"password" => md5( $userArray[ 'password' ] ),
					"email" => $userArray[ 'email' ]
				)
			);
		} catch ( Exception $e ) {
			throw $e;
		}
	}
	
	public function db_Validate( $sql , $name , $password ) {
		$user = $sql->query( "SELECT username, password FROM nsecure WHERE username ~* '$name';" )->getArray();
		
		if ( !isset( $user[0] ) ) throw new Exception( "User could not be found" );
		
		$user = $user[0];
		
		if ( $user[ "password" ] == md5( $password ) )
			return true;
		else throw new Exception( "Password failed ( " . $user[ "password" ] . " vs " . md5( $password ) ."  )" );
		
		return false;
	}
	
	public function db_GetUser( $sql , $user = array(  ) ) {
		if ( !isset( $user['username'] ) ) {
			$user[ "username" ] = $this->getSession();
		}
		return $sql->selectSingle( "nsecure" , "username ~* '" . $user['username'] . "'" );
	}
	
	public function __construct( ) {
		session_start( );
	}
	
	public function createSession( $name ) {
		$_SESSION[ self::S_NAME ] = $name;
	}
	
	public function checkSession( ) {
		if ( isset( $_SESSION[ self::S_NAME ] ) ) {
			return true;
		}
		else return false;
	}
	
	public function killSession( ) {
		unset( $_SESSION[ self::S_NAME ] );
		session_destroy();
	}
	
	public function getSession( ) {
		return isset( $_SESSION[ self::S_NAME ] ) ? $_SESSION[ self::S_NAME ] : false ;
	}
};

/* Intarfaces and Handle functions */
interface NSecurity {
	public function check( $NSInstance );
	
	public function fallback( );
	
};

function nsecurity_interface( $object ) {
	$NSInstance = new NSecure( );
	
	if ( !$object->check( $NSInstance ) ) {
		$object->fallback( );
	}
	
	return false;
}


?>