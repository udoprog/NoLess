<?php
	header( "content-type: text/html" );
?>
	<style>
		html, body {
			font-family: "Verdana","Helvetica","Tahoma","Sans Serif";
		}
		
		a {
			text-decoration : none;
			color : #000000;
			font-weight : bold;
		}
		
		a:hover {
			font-decoration : underline;
			color : #777777;
		}
	</style>
<?
	
	
	$DOC_EXT = ".doc" ;
	$FILE_EXT = ".txt" ;
	
	if ( $_GET['file'] ) {
		$file_path = $_GET['file'];
		if ( !is_file( $file_path ) ) die( "<h3>File not found</h3>" );
	
		$file = file( $file_path );
		
		foreach ( $file as $line ) {
			for ( $i = 0 ; isset( $line[$i] ) ; $i++ ) {
				$chr = $line[ $i ];
				switch( ord( $chr ) ) {
					case 9:
						echo "&nbsp;&nbsp;&nbsp;&nbsp;";
						break;
					case 128:
						$link = "";
						for ( $i++ ; isset( $line[$i] ) ; $i++ ) {
							if ( preg_match( "/[\s]/" , $line[$i] ) ) {
								break;
							} else {
								$link .= $line[$i];
							}
						}
						$link = trim( $link ) . $DOC_EXT . $FILE_EXT;
						$name = substr( $link , 0 , strlen( $link ) - ( strlen( $DOC_EXT ) + strlen( $FILE_EXT ) ) );
						echo "<a href='display.php?file=$link'>" . $name . "</a>";
						
						break;
					default:
						echo $chr;
						break;
				}
			}
			echo "<br />";
		}
		echo "<br />";
		echo "<a href='edit.php?file=$file_path'>EDIT</a>";
	}
?>