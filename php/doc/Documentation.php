<?php
	require "NFileStream.php";
	require "NFileRandomAccess.php";
	
	define( "RAF_NAME" , "documentation.ndr" );
	
	$RAF = new NFileRandomAccess();
	
	if ( !is_file( RAF_NAME ) )
		$RAF->create( RAF_NAME , array( 256 ) );
	else
		$RAF->load( RAF_NAME );
		
		
	$response = array();
	while ( $response[] = $RAF->get() ) {
		
	}
	
	print_r( $response );
	
?>

<form>
	<input type="text" name="class_method" />
</form>