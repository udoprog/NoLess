<?php
	include( "DatabasePgsql_standalone.php" );
	
	try {
		$dbconnect = new DatabasePgsql();
		$dbconnect->connect();
	} catch ( Exception $e ) {
		echo $e->getMessage();
	}
	
	$dbconnect->validate();
	
	/*$dbconnect->insert( "nsecure" ,
		array(
			"username" => "myuser" , 
			"password" => md5( "mypass" ),
			"email" => "aa@a.aa"
		)
	);*/
	
	$response = $dbconnect->query( "SELECT * FROM nsecure;" )->getSingle();
	
	print_r( $response[0] );

?>