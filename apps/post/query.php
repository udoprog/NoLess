<?php
	require("../../header.php");
	require("./setup.php");
	
	class PostApp extends QueryApplication {
		protected function main() {
			$this->operation( "query" );
			$this->kill();
		}
		
		protected function dir() {
			return dirname( __FILE__ );
		}
	}
	
	$AppIn = new PostApp();
	$AppIn->start();
?>