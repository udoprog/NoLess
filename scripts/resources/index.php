<?php
	require("../../header.php");
	
	$SiteDirname = dirname( __FILE__ );
	
	try {
		$app = new SiteApplication();
		$app->setDirname( $SiteDirname );
		$app->runOperation( "Index" );
		
		Application::kill();
	} catch( GException $e ) {
		GError::CatchException( $e );
	}
?>