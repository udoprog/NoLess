<?php

	if ( isset( $_POST['file'] ) )
		$file = $_POST['file'];
	else if( isset( $_GET['file'] ) )
		$file = $_GET['file'];
	else die( "File not specified" );
	
	if ( isset( $_POST['content'] ) )
		$content = $_POST['content'];
		
	if ( isset( $_POST['password'] ) )
		$password = $_POST['password'];
	
	if ( isset( $_POST['file'] ) ) {
		if ( !$file ) die( "Failed to update, filename not specified" );
		if ( !$content ) die( "Failed to update, content not specified" );
		if ( !$password ) die( "Failed to update, password not specified" );
		
		if ( $password != "hidoggery" ) die( "Failed to update, password is wrong" );
		
		file_put_contents( $file , $content );
		
		header( "location: $file" );
	} else {
	
	header( "content-type: text/html" );
?>

<style>
	input {
		border : 1px solid black;
	}
	
	#contents_area {
		width : 100%;
		height : 85%;
		border : 1px solid black;
	}

</style>

<?
	
		if ( file_exists( $file ) ) {
			$content = file_get_contents( $file );
		} else die( "Failed to get contents" );
?>
		<form method="post">
			Editing file: <input type="text" value="<?=$file?>" name="file" /><br />
			<textarea id="contents_area" name="content"><?=$content ?></textarea><br />
			Password: <input type="password" name="password" /> - <input type="submit" value="change file" />
		</form>
<?
	}
?>