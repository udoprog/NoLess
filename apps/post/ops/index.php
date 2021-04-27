<?

class index extends PostApp implements Operation, Doc_Html, Output_Client {
	public function before() {
		
	}
	
	public function document( $html ) {
		$html->create( "P.OST Bulletin Board" );
		
		$html->internalJS( "A_Tools.js" );
		$html->internalJS( "Ajax.js" );
		$html->internalJS( "NClient.js" );
		$html->internalJS( "NClientCom.js" );
		$html->internalJS( "SimpleXml.js" );
		$html->internalJS( "XCom.js" );
		$html->internalJS( "Xite.js" );
		
		$html->externalJS( "/js/etc.js" );
		$html->externalJS( "/js/forum.js" );
		$html->externalJS( "/js/register.js" );
		
		$html->externalCSS( "/css/index.css" );
		$html->externalCSS( "/css/main.css" );
		
		$html->file2Body( "/xites/index.xte" );
		
		$html->onload( "boot" );
	}
	
	public function output( $output ) {
		$output->document( $this->document );
	}
	
	public function after() {
		$this->kill();
	}
}





?>