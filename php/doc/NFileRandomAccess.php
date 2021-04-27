<?php


$FileRandomAccessDirname = dirname(__FILE__);

class NFileRandomAccess extends NFileStream {
	private $FileStream;
	private $name;
	private $path;
	
	private $atRecord = 0;
	
	public $KeyLengths;
	public $keysOffset;
	public $recordModular;
	
	const ERROR_KEYLENGTHS_MISSING = "Could not fetch any key lengths";
	const ERROR_FILE_NOT_CONTAINING_KEYLENGTHS = "File does not contain keylengths, it is thereby required as second argument in 'loadByName( \$name , \$keyLengths )'";
	const ERROR_KEYLENGTH_INVALID = "Key(\$1) invalid for file \$2";
	const ERROR_WRITE_LENGTH_MISMATCH = "@Arguments length mismatched \$KeyLengths length";
	const ERROR_FAILED_WRITE_REGISTRY = "Failed to write registry entry #\$1";
	const ERROR_FAILED_READ_REGISTRY = "Failed to read registry entry #\$1 with offset \$2";
	const ERROR_FILE_INVALID_LENGTH_TEST = "File(\$1) corrupt ( modular and recordsize compared to filesize )";
	
	public function __construct( $name = false ) {
		if ( $name ) $this->loadByName( $name );
	}
	
	public function create( $name , array $keyLengths = null ) {
		$this->name = $name;
		
		$this->createFileStream( $name , true );
		
		$this->KeyLengths = $keyLengths;
		
		if ( $keyLengths )
			$this->writeKeys();
		else if ( !$this->readKeys() )	throw new Exception( self::ERROR_KEYLENGTHS_MISSING );
		
		$this->setOffsetAndModular();
		
		return false;
	}
	
	public function load( $name ) {
		$this->name =	$name;
		$this->path = $this->name;
		
		$this->createFileStream( $this->path );
		if ( !$this->readKeys() ) throw new Exception( self::ERROR_KEYLENGTHS_MISSING );
		
		$this->setOffsetAndModular();
		
		return false;
	}
	
	public function put() {
		$args = func_get_args();
		
		if ( count( $args ) != count( $this->KeyLengths ) ) throw new Exception( self::ERROR_WRITE_LENGTH_MISMATCH );
		
		foreach ( $args as $key => $arg ) {
			if ( !$this->write( $arg , $this->KeyLengths[ $key ] ) ) throw new NException( self::ERROR_FAILED_WRITE_REGISTRY , $key );
		}
		
		return true;
	}
	
	public function get( $recordOffset = null ) {
		if ( $recordOffset != null )
			$this->goto( $recordOffset );
		
		if ( $this->size() <= $this->tell() ) return false;
		
		$response = array();
		
		foreach ( $this->KeyLengths as $key => $length ) {
			if ( !$response[] = $this->read( $length ) ) throw new Exception( self::ERROR_FAILED_READ_REGISTRY );
		}
		
		$this->atRecord++;
		
		return $response;
	}
	
	public function getAll() {
		$response = array();
		$i = 0;
		while ( $response[] = ( $this->get( $i++ ) ) ) {}
		array_pop( $response );
		
		return $response;
	}
	
	public function goto( $recordOffset ) {
		$this->atRecord = $recordOffset;
		if ( $recordOffset > $this->length() ) return false;
		
		$this->seek( $this->keysOffset + $this->recordModular * $recordOffset );
		return true;
	}
	
	public function gotoLast() {
		$this->goto( $this->length() );
		return true;
	}
	
	private function setOffsetAndModular() {
		if ( isset( $this->keysOffset ) && isset( $this->recordModular ) ) return false;
		
		$this->keysOffset = 0;
		$this->recordModular = 0;
		foreach( $this->KeyLengths as $keyLength ) {
			$this->keysOffset += strlen( $keyLength );
			$this->recordModular += (int) $keyLength;
		}
		$this->recordModular += 1;
		
		return true;
	}
	
	public function length() {
		$size = $this->size();
		$recordsSize = $size - $this->keysOffset;
		
		if ( $recordsSize < 0 ) return 0;
		
		$results = $recordsSize / $this->recordModular;
		
		if ( (int) $results != $results ) throw new NException( self::ERROR_FILE_INVALID_LENGTH_TEST , $this->name );
		
		return $results;
	}
	
	private function createFileStream( $path = null , $overwrite = null ) {
		if ( $this->isOpen() ) return false;
		
		$mode = ( !$overwrite && is_file( $path ) ? 'r' : 'w' );
		
		$this->open( $path , $mode , true );
		
		return false;
	}
	
	private function readKeys() {
		$this->KeyLengths = $this->readcsv();
		
		if ( !$this->KeyLengths ) throw new NException( self::ERROR_FILE_NOT_CONTAINING_KEYLENGTHS );
		
		foreach ( $this->KeyLengths as $key => $keyLength ) {
			$this->KeyLengths[ $key ] = (int) $keyLength;
			if ( !$this->KeyLengths[ $key ] ) throw new NException( self::ERROR_KEYLENGTH_INVALID , $key , $this->path );
		}
		
		if ( !isset( $this->KeyLengths[0] ) ) return false;
		return true;
	}
	
	private function writeKeys() {
		if ( !$this->KeyLengths ) throw new NException( self::ERROR_KEYLENGTHS_MISSING );
		$this->seek(0);
		$this->writecsv( $this->KeyLengths );
		
		return true;
	}
};

?>