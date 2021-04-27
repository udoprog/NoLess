<?php

/*
	06:50 2006-12-30
	Security updated, it was very obsolete.

	Pretty much added the entire procedureof authentication, checks ip and everything.
*/

define( "PERM_U" , 1 );
define( "PERM_G" , 2 );
define( "PERM_O" , 4 );

define( "PERM_R" , 1 );
define( "PERM_W" , 2 );
define( "PERM_X" , 4 );

define( "PERM_ROOT" , "septic" );

class NPerm extends Gnarf_Module {
	const ERROR_PERM_NOT_SET = "Permission has not been set and can therefore not be tested.";
	
	private $ugo;
	private $u;
	private $g;
	private $o;
	
	private $is_set;
	
	private $owner;
	private $group;
	
	private $GSec;
	
	protected function setPermission( $Permission ) {
		$rawArray = Array();
		
		preg_match( '/^([0-9])([0-9])([0-9])/' , $Permission , $rawArray );
		
		$this->ugo = $rawArray[0];
		$this->u =	$rawArray[1];
		$this->g =	$rawArray[2];
		$this->o =	$rawArray[3];
		
		$this->is_set = true;
		
		return $this;
	}
	
	public function test( $own , $mod ) {
		if ( !$this->is_set ) throw new NException( self::ERROR_PERM_NOT_SET );
		
		if ( PERM_O & $own )
			if ( $this->o & $mod )
				return true;
		
		if ( !$this->GSec ) {
			return false;
		}
		
		if ( $this->GSec->username == PERM_ROOT ) return true;
		
		if ( PERM_U & $own )
			if ( $this->u & $mod )
				if ( $this->owner == $this->GSec->username )
					return true;
		
		if ( PERM_G & $own )
			if ( $this->g & $mod )
				if ( $this->group == $this->GSec->group )
					return true;
		
		$this->reset();
		return false;
	}
	
	private function setOwner( $owner ) {
		$this->owner = $owner;
		return false;
	}
	
	private function setGroup( $group ) {
		$this->group = $group;
		return false;
	}
	
	public function setPermBySxe( $sxe ) {
		if ( !( $sxe instanceof SimpleXMLElement ) ) {
			throw new Exception( "Attempted to set non SimpleXMLElement object" );
		}
	
		$this->setPermission( $sxe->permission );
		$this->setOwner( $sxe->owner );
		$this->setGroup( $sxe->group );
		
		return $this;
	}
	
	public function setGSecure( $gSec ) {
		if ( !( $gSec instanceof NSecure ) ) {
			throw new Exception( "Attempted to set non GSecure object" );
		}
		
		$this->GSec = $gSec;
		
		return $this;
	}
	
	public function reset() {
		$this->ugo = null;
		$this->u = null;
		$this->g = null;
		$this->o = null;
		
		$this->group = null;
		$this->owner = null;
		
		$this->is_set = false;
	}
	
	protected function Set( ) {
		
	}
	
	protected function Verbose( ) {
		return "[Permission Module]";
	}
};

?>