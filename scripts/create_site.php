<?php

	/*
		@args1 : new site name.
	*/
	
	$siteDir = "../sites";
	
	if ( !$argv[1] ) die( "@sitename not defined\n" );
	$sitename = $argv[1];
	
	if ( is_dir( $siteDir . "/" . $sitename ) ) die( "Site already exists\n" );
	
	$dir = $siteDir . "/$sitename";
	if ( mkdir( $dir , 775 ) ) echo "$dir \n";
	$dir = $siteDir . "/$sitename/ops";
	if ( mkdir( $dir , 775 ) ) echo "$dir \n";
	
	$path = $siteDir . "/$sitename/ops/Index.php";
	if ( copy( "./resources/OPS_INDEX.php" , $path ) ) echo "$path \n";
	$path = $siteDir . "/$sitename/Index.php";
	if ( copy( "./resources/INDEX.php" , $path ) ) echo "$path \n";
	
	echo "Site $sitename created sucessfully.\n";
?>