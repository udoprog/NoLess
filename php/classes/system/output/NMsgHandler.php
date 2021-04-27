<?php

class NMsgHandler extends System {
	public $msgs = array();
	public $errors = array();
	
	public $hasErrors = false;
	public $hasMsgs = false;
	
	private function addGrp( $grp_name ) {
		$this->msgs[ $grp_name ] = array();
		
		return false;
	}
	
	public function add( $grp_name , $msg ) {
		if ( !isset( $this->msgs[ $grp_name ] ) ) $this->addGrp( $grp_name );
		
		$this->msgs[ $grp_name ][] = $msg;
		$this->hasMsgs = true;
		
		return false;
	}

	public function addError( $msg ) {
		$this->errors[] = $msg;
		$this->hasErrors = true;
		
		return false;
	}
	
	public function hasMsgs() {
		return isset( $this->msgs[0] );
	}
	
	public function hasErrors() {
		return isset( $this->errors[0] );
	}
	
	public function iterate( $grp_name , $notify ) {
		if ( !isset( $this->msgs[ $grp_name ] ) ) throw new Exception( "grp specified in @grp_name does not exist" );
		
		foreach ( $this->msgs[ $grp_name ] as $index => $value ) {
			$notify( $index , $value );
		}
		
		return false;
	}
};

/* Intarfaces and Handle functions */
interface Msg_Handler {
	public function msg( $msghandler );
};

function msg_handler_interface( $object ) {
	$object->msg = new NMsgHandler();
	$object->msg( $object->msg );
	return false;
}


?>