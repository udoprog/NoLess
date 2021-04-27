<?php
	require("../../header.php");
	require("./setup.php");
	
	class PostApp extends MainApplication implements Validate_Db_Pgsql {
		protected function main() {
			$this->operation( "index" );
			$this->kill();
		}
		
		protected function dir() {
			return dirname( __FILE__ );
		}
	}
	
	$AppIn = new PostApp();
	$AppIn->start();
?>