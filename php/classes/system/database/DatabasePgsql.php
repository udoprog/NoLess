<?php


class DatabasePgsql {
	static protected $Connection;
	static public $config = array( "host" => "" , "port" => "" , "dbname" => "" , "user" => "" , "password" => "" );
	static public $executes = array();
	static public $setExecutes = array();
	static public $structure = array();
	
	public $Response;
	public $Rows;
	
	/*
		public function connect( void )
			-utilises the static public $config to configurate connection
	*/
	public function connect() {
		if ( !isset( self::$config ) ) throw new Exception( "@config not set" );
		
		$config = &self::$config;
		
		if ( self::$Connection ) return false;
		$connectStr = 
			"host=" .		$config["host"] .		" ".
			"port=" .		$config["port"] .		" ".
			"dbname=" .	$config["dbname"] . 	" ".
			"user=" .		$config["user"] . 		" ".
			"password=" .	$config["password"];
		
		try {
			self::$Connection = pg_connect( $connectStr );
		} catch ( Exception $e ) {
			throw new Exception( pgsql_error() );
		}
		
		if ( !self::$Connection ) throw new Exception( "Unable to connect to database" );
		return false;
	}
	
	/*
		public function connect( void )
			-validates database tables to make sure they 
	*/
	public function validate() {
		foreach ( self::$structure as $name => $buildQuery ) {
			if ( !$this->isTable( $name ) ) {
				$this->query( $buildQuery );
			}
		}
	}
	
	function prepare( $smt ) {
		if ( !isset( self::$executes[ $smt ] ) ) throw new Exception( "Execute '$smt' not defined" );
		if ( isset( self::$setExecutes[ $smt ] ) ) return false;
		
		pg_prepare( self::$Connection , $smt , self::$executes[ $smt ] );
		
		self::$setExecutes[ $smt ] = true;
		
		return $this;
	}
	
	function execute( $smt , $params = array() ) {
		$this->prepare( $smt );
		$this->Response = pg_execute( self::$Connection , $smt , $params );
		
		return $this;
	}
	
	public function disconnect() {
		if ( pg_close( self::$Connection ) )
			return true;
		else return false;
	}
	
	public function query( $query )
	{
		try {
			$this->Response = pg_query( self::$Connection , $query );
			$this->Rows = pg_num_rows( $this->Response );
		} catch ( Exception $e ) {
			echo $e->getMessage();
			echo $e->getTraceAsString();
			$this->kill();
		}
		return $this;
	}
	
	public function getArray() {
		if ( !$this->Rows ) return false;
		$results = Array();
		while ( $push = pg_fetch_array( $this->Response , NULL , PGSQL_ASSOC ) )
			$results[] = $push;
		
		return $results;
	}

	public function getSingle( $row = 0 ) {
		if ( !$this->Rows ) return false;
		$response = pg_fetch_array( $this->Response , $row , PGSQL_ASSOC );
		return $response;
	}

	public function isTable( $tblname ) {
		$response = $this->query( "SELECT pg_class.relname FROM pg_class WHERE pg_class.relname = '$tblname';" )->getSingle();
		if ( $response['relname'] ) return true;
		else return false;
	}
	
	public function selectSingle( $tbl , $filter ) {
		$response = $this->query( "SELECT * FROM $tbl WHERE $filter" );
		$response = $this->getArray();
		
		if ( isset( $response[0] ) ) return $response[0];
		return false;
	}
	
	public function insert( $tblname , $assocValues ) {
		pg_insert( self::$Connection , $tblname , $assocValues );
		
		return $this;
	}
	
	public function update( $tblname , $assocValues , $condition  ) {
		pg_update( self::$Connection , $tblname , $assocValues , $condition );
		
		return $this;
	}
	
	public function select( $tblname , $assocValues ) {
		$this->Response = pg_select( self::$Connection , $tblname , $assocValues );
		
		return $this->Response;
	}
	
	public function delete( $tblname , $assocValues ) {
		$this->Response = pg_delete( self::$Connection , $tblname , $assocValues );
		
		return $this;
	}
};

interface Db_Pgsql {
	public function pgsql( $pgsql );
}

function db_pgsql_interface( $object ) {
	$pgsql = new DatabasePgsql();
	$pgsql->connect();
	$object->pgsql( $pgsql );
}

interface Validate_Db_Pgsql {}

function validate_db_pgsql_interface() {
	$pgsql = new DatabasePgsql();
	$pgsql->connect();
	$pgsql->validate();
	
	return false;
}

?>