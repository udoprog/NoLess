<?php

class HtmlDocument extends NDocument {
	private $DOCTYPE;
	private $DOM;
	
	public $html;
	public $head;
	public $body;
	
	const INTERNAL_JS_PATH = "../../js";
	
	const DOCTYPE_QUALIFIED_NAME = "html";
	const DOCTYPE_PUBLIC_ID = "-//W3C//DTD XHTML 1.0 Strict//EN";
	const DOCTYPE_SYSTEM_ID = "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd";
	
	function __construct( $title = "" ) {
		if ( $title ) $this->create( $title );
		return false;
	}
	
	public function create( $title = "" ) {
		$DOMImp = new DOMImplementation();
		
		$this->DOCTYPE = $DOMImp->createDocumentType(
			self::DOCTYPE_QUALIFIED_NAME,
			self::DOCTYPE_PUBLIC_ID,
			self::DOCTYPE_SYSTEM_ID
		);
		$this->DOM  = $DOMImp->createDocument( null ,  "html" , $this->DOCTYPE );
		
		$this->html = $this->DOM->documentElement;
		$this->head = new DOMElement( "head" );
		$this->body = new DOMElement( "body" );
		
		$this->html->appendChild( $this->head );
		$this->html->appendChild( $this->body );
		
		$this->head->appendChild( new DOMElement( "title" , $title ) );
		
		$this->DOM->appendChild( $this->html );
		return false;
	}
	
	public function externalJS( $jsPath ) {
		$jsPath = $this->seekPath( $jsPath );
		if ( !is_file( $jsPath ) ) throw new Exception( "@jsName($jsPath) external javascript does not exist" );
		
		$scriptElement = new DOMElement( "script" ) ;
		
		$this->head->appendChild( $scriptElement );
		
		$scriptElement->setAttribute( "language" , "javascript" );
		$scriptElement->setAttribute( "type" , "text/javascript" );
		$scriptElement->setAttribute( "src" , $jsPath );
		return false;
	}
	
	public function loadAllInternalJS() {
		$glob = glob( self::INTERNAL_JS_PATH . "/*" );
		foreach( $glob as $jsFile )
			if ( is_file( $jsFile ) ) {
				$this->internalJS( basename( $jsFile ) );
			}
	}
	
	public function internalJS( $jsName ) {
		$jsPath = $this->seekPath( self::INTERNAL_JS_PATH . "/" . $jsName );
		if ( !is_file( $jsPath ) ) throw new Exception( "@jsName($jsPath) internal javascript does not exist" );
		
		$scriptElement = new DOMElement( "script" ) ;
		
		$this->head->appendChild( $scriptElement );
		
		$scriptElement->setAttribute( "language" , "javascript" );
		$scriptElement->setAttribute( "type" , "text/javascript" );
		$scriptElement->setAttribute( "src" , $jsPath );
		return false;
	}
	
	public function onload( $jsFunction ) {
		$this->body->setAttribute( "onload" , "$jsFunction()" );
		return false;
	}
	
	public function validate() {
		$this->DOCUMENT->validate();
		return false;
	}
	
	public function getOutput() {
		return $this->DOM->saveHTML();
	}
	
	public function getMimeType() {
		return "text/html";
	}
};

interface Doc_Html {
	public function document( $html );
}

function doc_html_interface( $object ) {
	$object->document = new HtmlDocument();
	$object->document( $object->document );
	return false;
}

?>