<?php

class XmlDocument extends NDocument {
	protected $DOM;
	
	public $root = null;
	
	const VERSION = "1.0";
	const ENCODING = "UTF-8";
	
	const DFT_ROOT_NAME = "root";
	
	public function create( $root = false ) {
		$this->DOM = new DOMDocument( self::VERSION , self::ENCODING );
		if ( $root )	$this->root = new DOMElement( $root );
		else		$this->root = new DOMElement( self::DFT_ROOT_NAME );
		$this->DOM->appendChild( $this->root );
		return false;
	}
	
	public function importDom( $dom , $deep = false ) {
		return $this->DOM->importNode( $dom , $deep );
	}
	
	public function file2Root( $xmlPath ) {
		if ( !is_file( $xmlPath ) ) throw new Exception( "Could not find file" );
		
		$content = file_get_contents( $xmlPath );
		
		$content = "<root>$content</root>";
		
		$doc = new DOMDocument();
		$doc->loadXML( $content );
		
		$newRoot = $this->DOM->importNode( $doc->documentElement , true );
		
		$this->DOM->replaceChild( $newRoot , $this->root );
		$this->root = $newRoot;
	}
	
	public function load( $xmlPath ) {
		$xmlPath = $this->seekPath( $xmlPath );
		
		if ( !$xmlPath ) throw new NDocException( "File not found" );
		
		$this->DOM->load( $xmlPath );
		return false;
	}
	
	public function loadXML( $xml ) {
		$this->DOM->loadXML( $xml );
		return false;
	}
	
	public function Root() {
		return $this->DOM->documentElement;
	}
	
	public function getOutput() {
		return $this->DOM->saveXML();
	}
	
	public function getMimeType() {
		return "text/xml";
	}
};

interface Doc_Xml {
	public function document( $xml );
}

function doc_xml_interface( $object ) {
	$object->document = new XmlDocument();
	$object->document( $object->document );
	return false;
}

?>