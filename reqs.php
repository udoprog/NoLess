<?

$die = false;

if ( !extension_loaded( "libxml" ) ) {
	echo( "Extension 'libxml' must be loaded.\n" );
	$die = true;
}
if ( !extension_loaded( "dom" ) ) {
	echo( "Extension 'dom' must be loaded.\n" );
	$die = true;
}
if ( !extension_loaded( "pgsql" ) ) {
	echo( "Extension 'pgsql' must be loaded.\n" );
	$die = true;
}
if ( !extension_loaded( "session" ) ) {
	echo( "Extension 'session' must be loaded.\n" );
	$die = true;
}

if ( $die ) die( "\nOne or more extensions are missing.\n" );

phpinfo();

//phpinfo();

?>