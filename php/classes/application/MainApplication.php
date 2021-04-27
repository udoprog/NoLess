<?php

$MainApplicationDirname = dirname(__FILE__);

abstract class MainApplication extends Application{
	protected function init() {
		$this->setRoot( $this->dir() );
		$this->resolveImps( $this );
		$this->main();
		
		return false;
	}
	
	abstract protected function main();
	abstract protected function dir();
};

?>