<?php

$FileSystemDirname = dirname(__FILE__);

class System {
	static private $ROOT;
	
	const ERROR_ROOT_NOT_DIR = "@rootDir(@rootDir) is not a directory";
	const ERROR_ROOT_NOT_WRITABLE = "@rootDir(@rootDir) isn't writable, check server settings";
	const ERROR_ROOT_NOT_SET = "self::\$ROOT is not set";
	
	public function __construct( $rootDir = false ) {
		if ( $rootDir ) $this->setRoot( $rootDir );
		return false;
	}
	
	static public function setRoot( $rootDir ) {
		if ( !is_dir( $rootDir ) ) throw new Exception( self::ERROR_ROOT_NOT_DIR );
		if ( !is_writeable( $rootDir ) ) throw new Exception( self::ERROR_ROOT_NOT_WRITABLE );
		self::$ROOT = $rootDir;
		return false;
	}
	
	static public function getRoot() {
		if ( !isset( self::$ROOT ) ) return false; //throw new NException( self::ERROR_ROOT_NOT_SET );
		return self::$ROOT;
	}
	
	static public function seekPath( $path , $web = false ) {
		if ( !$web )
			$path = self::getRoot() ? self::getRoot() . $path : "." . $path;
		else
			$path = "." . $path;
		
		if ( !is_file( $path ) ) return false;
		
		return $path;
	}
	
	static public function ob_start() {
		ob_start();
		
		return false;
	}
	
	static public function ob_clean() {
		ob_clean();
		
		return false;
	}
	
	static public function ob_stop() {
		ob_stop();
		
		return false;
	}
	
	static public function glob( $pattern ) {
		return glob( self::seekPath( "/$pattern" ) );
	}
};

?>