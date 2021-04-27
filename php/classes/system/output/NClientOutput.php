<?php

/*
	NClientOutput
	
	Handles all output back to the client.
	
*/

class NClientOutput {
	protected $Stack;
	protected $isStacking;
	private $headers;
	
	const ERROR_NOT_STACKING = "Is not stacking.";

	public function document( $doc ) {
		$this->setHeader( "content-type" , $doc->getMimeType() );
		$this->write( $doc->getOutput() );
		
		if ( $this->isStacking ) {
			$this->dump();
		}
		return false;
	}
	
	public function setIfStacking( $isStacking ) {
		$this->isStacking = $isStacking;
	}
	
	public function write( $str ) {
		if ( $this->isStacking ) {
			$this->dumpHeaders();
			$this->Stack .= $str;
		} else {
			echo $str;
		}
		
		return false;
	}
	
	public function writeln( $str ) {
		$this->write( $str . "\n" );
		return false;
	}
	
	public function clear() {
		$this->Stack = "";
		return false;
	}
	
	public function dump() {
		if ( $this->isStacking ) {
			$this->dumpHeaders();
			echo $this->Stack;
			$this->clear();
		} else {
			throw new Exception( self::ERROR_NOT_STACKING );
		} return false;
	}
	
	public function setHeader( $name , $value ) {
		try {
			$this->headers[] = "$name: $value";
		} catch( Exception $e ) {
			throw new NException( "HEader cant be set." );
		}
		return false;
	}
	
	private function dumpHeaders() {
		foreach ( $this->headers as $header ) {
			header( $header );
		}
		return true;
	}
}

/* Intarfaces and Handle functions */

interface Output_Client {
	public function output( $output );
};

function output_client_interface( $object ) {
	$object->output( new NClientOutput() );
	return false;
}

?>