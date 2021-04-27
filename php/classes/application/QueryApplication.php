<?php

$QueryApplicationDirname = dirname(__FILE__);

abstract class QueryApplication extends Application{
	protected function init() {
		
		$this->setRoot( $this->dir() );
		$this->main();
		
		return false;
	}
};

?>