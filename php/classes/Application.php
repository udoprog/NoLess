<?php

/*
	FileStream
	TODO !
	Errorhandling!
*/

$ApplicationDirname = dirname(__FILE__);

abstract class Application extends System {
	public static $OpDir = "/ops/";
	public static $ImpFuncExt = "_interface";
	public static $StdPostHandle = false;

	const ERROR_DIRNAME_INVALID = "@dirname(\$1) is of invalid type";
	const ERROR_OPERATION_NOT_FOUND = "";
	
	public function start() {
		$this->init();
		
		return false;
	}
	
	static public function kill() {
		exit;
		return false;
	}
	
	protected function operation( $opName , $assocVars = false ) {
		$opPath = $this->seekPath( self::$OpDir . "/" . $opName . PHP_EXT );
		
		if ( !is_file( $opPath ) ) throw new Exception( "@opName($opName) operation could not be found in '$opPath'" );
		require_once( $opPath );
		
		$opName = preg_match( '/[a-zA-Z_]+$/' , $opName , $response );
		$opName = $response[0];
		
		$opInstance = new $opName();
		
		if ( $assocVars ) {
			$opInstance->post = Array();
			foreach ( $assocVars as $key => $value ) {
				$opInstance->post[ $key ] = $value;
			}
		}
		
		$opInstance->before();
				
		$this->resolveImps( $opInstance );
		
		return $opInstance->after();
	}
	
	protected function resolveImps( $opInstance ) {
		$imps = class_implements( $opInstance );
		foreach ( $imps as $imp ) {
			$this->resolveImp( $imp , $opInstance );
		}
	}
	
	protected function resolveImp( $imp , $opInstance = false ) {
		$imp = strToLower( $imp ) . self::$ImpFuncExt;
		if ( !function_exists( $imp ) ) {
			throw new Exception( "Could not find handle function named $imp" );
		}
		
		if ( !$opInstance ) {
			$opInstance = $this;
		}
		
		$imp( $opInstance );
		
		return false;
	}
	
	protected function stdPostHandling() {
		$post = new NClientInput( NClientInput::POST );
		
		if ( $post->hasParams() ) {
			foreach ( $post->getAll() as $op => $params ) {
				$this->operation( $op , $params );
			}
		}
		
		return false;
	}
	
	abstract protected function init();
};

interface Operation {
	public function before();
	public function after();
}

function operation_interface() {
	return false;
}

interface Build {
	public function build();
}

function build_interface( $object ) {
	$object->build();
	return false;
}

?>