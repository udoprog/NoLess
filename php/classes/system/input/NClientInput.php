<?php

/*
	NClientInput
	
	Takes care of client input and gives the programmer a few new controls.
	
*/

class NClientInput {
	private $Parameters;
	public $Set = false;
	
	const GET = "get";
	const POST = "post";
	
	public function __construct( $method ) {
		$params = array();
		
		switch ( strToLower( $method ) ) {
			case self::GET:
				$params = $_GET;
				break;
			case self::POST:
				$params = $_POST;
				break;
		}
		
		$this->setParams( $params );
		return;
	}
	
	protected function setParams( $params ) {
		if ( is_array( $params ) && $params ) {
			$this->Parameters = $params;
			$this->Set = true;
		} else $this->Set = false;
		
		return false;
	}
	
	public function getParam( $name , $key = false ) {
		$bundle = isset( $this->Parameters[ $name ] ) ? $this->Parameters[ $name ] : false ;
		
		if ( !$bundle ) return null;
		
		if ( $key ) {
			$param = isset( $bundle[ $key ] ) ? $bundle[ $key ] : false ;
		} else {
			$param = $bundle;
		}
		
		return $param;
	}
	
	public function isParam( $name ) {
		return isset( $this->Parameters[ $name ] ) ? true : false ;
	}
	
	public function hasParams() {
		return isset( $this->Parameters ) ? true : false ;
	}
	
	public function getAll() {
		if ( !$this->hasParams() ) return false;
		return $this->Parameters;
	}
};

/* Intarfaces and Handle functions */

interface Input_Get {
	public function get( $nci );
}

function input_get_interface( $object ) {
	$object->get( new NClientInput( NClientInput::GET ) );
	return false;
}

interface Input_Post {
	public function post( $nci );
}

function input_post_interface( $object ) {
	$object->post( new NClientInput( NClientInput::POST ) );
	return false;
}

?>