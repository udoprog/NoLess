<?

class query extends PostApp implements Operation, Input_Post , Input_Get {
	public function before() {
		
	}
	
	public function post( $post ) {
		if ( $post->hasParams() ) {
			foreach ( $post->getAll() as $key => $value ) {
				$this->operation( $key );
			}
			
			$this->kill();
		}
	}
	
	public function get( $get ) {
		if ( $get->hasParams() ) {
			foreach ( $get->getAll() as $key => $value ) {
				$this->operation( $key );
			}
			
			$this->kill();
		}
	}
	
	public function after() {
		$this->kill();
	}
}





?>