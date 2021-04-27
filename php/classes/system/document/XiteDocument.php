<?php

/*
	XiteXMLLink
*/

class XiteDocument extends XmlDocument {
	const XITES_DIR = "/xites";
	const XITE_EXT = ".xte";
	const XITE_ROOT = "NBody";
	
	public function __construct() {
		parent::__construct( self::XITE_ROOT );
	}
	
	public function loadFile( $name ) {
		$path = $this->seekPath( self::XITES_DIR . "/$name" . self::XITE_EXT );
		$this->DOM->load( $path );
		return $this->DOM;
	}
};

?>