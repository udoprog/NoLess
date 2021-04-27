<?class XComDocument extends XmlDocument {		protected $hasContent = false;
	
	const ERROR_TYPE_NOT_NUMERIC = "@type is not numeric";	const ERROR_CONTENT_UNSUPPORTED = "@content type not supported.";		const INFO = 100;	const ERROR = 400;	const EXCEPTION = 500;		const NO_OUTPUT = 401;	const NO_OUTPUT_CONTENT = "No Output";		function __construct() {		parent::create( "xcom" );	}	
	private function makeContent( $content , $cElement ) {
		if ( $content instanceof DOMElement ) {
			$cElement->appendChild( $this->DOM->importNode( $content , true ) );
		} else if ( is_string( $content ) ) {
			$cElement->appendChild(  $this->DOM->createCDATASection( $content ) );
		} else if ( is_array( $content ) ) {
			foreach ( $content as $i => $value ) {
				if ( is_numeric( $i ) ) $i = "null";
				$cElement->appendChild( new DOMElement( $i , $value ) );
			}
		} else throw new Exception( self::ERROR_CONTENT_UNSUPPORTED );
		
		return false;
	}
		public function append( $type ) {
		$contents = func_get_args();
				if ( !is_numeric( $type ) ) throw new Exception( self::ERROR_TYPE_NOT_NUMERIC );				$outputElement = $this->root->appendChild( new DOMElement( "o" ) );				$tElement = $outputElement->appendChild( new DOMElement( "t" , $type ) );		$cElement = $outputElement->appendChild( new DOMElement( "c" ) );
		
		for ( $i = 1 ; isset( $contents[$i] ) ; $i++ ) {
			$content = $contents[$i];
			
			$this->makeContent( $content , $cElement );		}				$this->hasContent = true;				return false;	}
	
	public function getMsgHandler( $msg ) {
		foreach( $msg->msgs as $type => $arr ) {
			foreach ( $arr as $entry ) {
				$this->append( $type , $entry );
			}
		}
		
		foreach( $msg->errors as $error ) {
			$this->append( 400 , $error );
		}
		
		return false;
	}};

interface Doc_XCom {
	public function document( $xcom );
}

function doc_xcom_interface( $object ) {
	$object->document = new XComDocument();
	$object->document( $object->document );
	return false;
}
?>