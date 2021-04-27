<?php

class NFileStream extends System {
	protected $FileHandle;
	protected $Path;
	
	private $Results;
	private $Pos = 0;
	
	const ERROR_FAILED_OPEN_STREAM = "Failed to open stream";
	const ERROR_STREAM_NOT_OPEN = "Filestream not open";
	
	const APPEND = 'a';
	const WRITE = 'w';
	const READ = 'r';
	const CREATE = 'x';
	
	public function create( $filePath = false , $mode = false , $extendMode = false ) {
		if ( $filePath && $mode ) {
			$filePath = $this->seekPath( $filePath );
			$this->open( $filePath , $mode , $extendMode );
		}
		
		return $this;
	}
	
	public function document( $doc ) {
		$this->write( $doc->getOutput() );
		return false;
	}
	
	public function open( $path , $mode , $extendMode = false ) {
		$mode = $extendMode ? $mode . '+' : $mode ;
		
		$filePath = $this->seekPath( $path );
		if ( !$filePath ) throw new NException( "File not found" );
		
		if ( !$this->FileHandle = fopen( $filePath , $mode ) ) throw new NException( self::ERROR_FAILED_OPEN_STREAM );
		
		$this->Path = $filePath;
		$this->updatePos();
		return false;
	}
	
	public function readDocument( $doc ) {
		if ( !$this->isOpen() ) throw new NException( self::ERROR_STREAM_NOT_OPEN );
		$this->write( $doc->getOutput() );
		return false;
	}
	
	public function read( $length = false  ) {
		$this->Results = fgets( $this->FileHandle , $length + 1 );
		$this->updatePos();
		return $this->getResults();
	}
	
	public function readcsv( $length = false ) {
		$this->Results = fgetcsv( $this->FileHandle , $length );
		$this->updatePos();
		return $this->getResults();
	}
	
	public function write( $content , $length = 0 ) {
		if ( !$this->isOpen() ) return false;
		
		if ( !$length ) {
			fwrite( $this->FileHandle , $content );
			return true;
		}
		
		fwrite( $this->FileHandle , $content , $length );
		$countStr = strlen( $content );
		
		if ( $length > 0 )
			$countStr -= $length;
		
		if ( $countStr < 0 ) {
			for ( $i = 0 ; $i < abs( $countStr ) ; $i++ ) {
				fwrite( $this->FileHandle , " " );
			}
		}
		$this->updatePos();
		return true;
	}
	
	public function writecsv( $array ) {
		if ( !is_array( $array ) ) throw new NException( "Not Array" );
		fputcsv( $this->FileHandle , $array );
		$this->updatePos();
		return false;
	}
	
	public function seek( $position ) {
		fseek( $this->FileHandle , $position );
		$this->updatePos();
		return false;
	}
	
	public function seekEnd() {
		$this->seek( filesize( $this->Path ) );
		return true;
	}
	
	public function getResults() {
		return $this->Results;
	}
	
	public function isOpen() {
		if ( $this->FileHandle ) return true; 
		else return false;
	}
	
	public function size() {
		return filesize( $this->Path );
	}
	
	public function tell() {
		return ftell( $this->FileHandle );;
	}
	
	private function updatePos() {
		$this->Pos = $this->tell();
		return false;
	}
	
	public function eof() {
		if ( feof( $this->FileHandle ) ) return true; 
		else return false;
	}
};

/* Intarfaces and Handle functions */
interface Output_File {
	public function output( $nFileStream );
};

function output_file_interface( $object ) {
	$object->output( new NFileStream() );
	return false;
}


?>