<?
class pageManager extends PostApp implements
							Operation ,
							Input_Post , 
							DB_Pgsql , 
							NSecurity , 
							Doc_XCom , 
							Output_Client
{
	private $errors = array();
	private $sql;
	
	public function before() {
		
	}
	
	public function post( $post ) {
		if ( !$this->page =	$post->getParam( "pageManager" , "page" ) )	$this->errors[] = "Name parameter must exist";
		return false;
	}
	
	public function pgsql( $db ) {
		$this->sql = $db;
		
		return false;
	}
	
	public function check( $sec ) {
		$this->nsecure = $sec;
		
		return true;
	}
	
	public function fallback( ) {
		return false;
	}
	
	public function document( $xml ) {
		
		$phpPath = $this->seekPath( "/xites/$this->page.xte" );
		if ( is_file( $phpPath ) ) {
			ob_start();
			include( $phpPath );
			$content = ob_get_contents();
			ob_end_clean();
		} else $this->errors[] = "Could not find file";
		
		if ( count( $this->errors ) ) {
			foreach ( $this->errors as $error ) {
				$xml->append( 400 , $error );
			}
		} else {
			$xml->append( 100 , "$content" );
		}
	}
	
	public function output( $output ) {
		$output->document( $this->document );
	}
	
	public function after() {
		$this->kill();
	}
}
?>