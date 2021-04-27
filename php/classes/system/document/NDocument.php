<?php

abstract class NDocument extends System {
	abstract public function getOutput();
	abstract public function getMimeType();
	
	public function setVar( $name , $value ) {
		$this->$name = $value;
		
		return false;
	}
};

class NDocException extends Exception {
}


?>