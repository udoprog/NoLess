<?
class forumManager extends PostApp implements
							Operation ,
							Msg_Handler ,
							Input_Post , 
							DB_Pgsql , 
							NSecurity , 
							Doc_XCom , 
							Build ,
							Output_Client
{

	private $errors = array();
	private $params = null;

	public function before() {
		
	}
	
	public function msg( $msg ) {
		return false;
	}
	
	public function post( $post ) {
		$this->params = $post->getParam( "forumManager" );
		
		if ( !isset( $this->params[ 'action' ] ) ) {
			$msg->addError( "'action' not specified" );
			return false;
		} else {
			$this->action = $this->params[ 'action' ];
		}
		
		/*
			Variable validation forpost actions.
		*/
		switch ( $this->action ) {
			case "list":
					if ( !isset( $this->params[ 'thread_id' ] ) )	$this->msg->addError( "'thread_id' not specified" );
					if ( !isset( $this->params[ 'list' ] ) )			$this->msg->addError( "'list' action not specified" );
					
					switch( $this->params[ 'list' ] ) {
						case "threads":
							break;
						case "entries":
							break;
					}
				break;
			case "create":
					if ( !isset( $this->params[ 'thread_id' ] ) )	$this->msg->addError( "'thread_id' not specified" );
					if ( !isset( $this->params[ 'create' ] ) )			$this->msg->addError( "'create' action not specified" );
					
					switch( $this->params[ 'create' ] ) {
						case "thread":
							if ( !isset( $this->params[ 'name' ] ) )		$this->msg->addError( "'name' not specified" );
							$unsafe =	array( '/' );
							$safe =	array( '&#47;' );
							
							$this->params[ 'name' ] = str_replace( $unsafe , $safe , $this->params[ 'name' ] );
							break;
						case "entry":
							if ( !isset( $this->params[ 'content' ] ) )		$this->msg->addError( "'content' not specified" );
							break;
					}
				break;
			case "remove":
					if ( !isset( $this->params[ 'id' ] ) )	$this->msg->addError( "'id' not specified" );
					switch( $this->params[ 'remove' ] ) {
						case "thread":
							
							break;
						case "entry":
							
							break;
					}
				break;
			default:
				$this->msg->addError( "'action' cannot be handled" );
				break;
		}
		
		return false;
	}
	
	public function pgsql( $db ) { $this->sql = $db; return false; }
	public function check( $sec ) { $this->nsecure = $sec; return true; }
	public function fallback() { return false; }
	public function document( $xcom ) { $this->xcom = $xcom; return $xcom; }
	
	public function build() {
		if ( $this->msg->hasErrors ) return false;
		
		switch ( $this->action ) {
			case "list":
				switch( $this->params[ 'list' ] ) {
					case "threads":
						$this->list_threads();
						break;
					case "entries":
						$this->list_entries();
						break;
				}
				break;
			case "create":
			
				if ( !$this->nsecure->checkSession() ) {
					$this->msg->addError( "You are not authenticated to create anything" );
					return false;
				}
			
				switch( $this->params[ 'create' ] ) {
					case "thread":
						$this->create_thread();
						break;
					case "entry":
						$this->create_entry();
						break;
				}
				break;
			case "remove":
			
				if ( !$this->nsecure->checkSession() ) {
					$this->msg->addError( "You are not authenticated to remove anything" );
					return false;
				}
			
				switch( $this->params[ 'remove' ] ) {
					case "thread":
						$this->remove_thread();
						break;
					case "entry":
						$this->remove_entry();
						break;
				}
				break;
		}
	}
	
	public function output( $output ) {
		if ( $this->msg->hasMsgs || $this->msg->hasErrors ) $this->xcom->getMsgHandler( $this->msg );
		else $this->xcom->append( 100 , "No messages" );
		
		$output->document( $this->document );
	}
	
	public function after() {
		$this->kill();
	}
	
	private function list_threads() {
		$threads = $this->sql->query( 
			"SELECT id , name
			FROM forum_threads
			WHERE parent_thread_id = '" . $this->params['thread_id'] . "';"
		)->getArray();
		
		if ( $this->params[ 'thread_id' ] == 0 ) {
			$parent_thread = array(
				"id" => 0,
				"name" => "index",
				"tree_name" => "/",
				"tree_id" => "/"
			);
		} else {
			$parent_thread = $this->sql->query( 
				"SELECT id , name , tree_id , tree_name
				FROM forum_threads
				WHERE id = '" . $this->params['thread_id'] . "'
				LIMIT 1;"
			)->getSingle();
		}
		
		$this->msg->add( 111 ,
			array(
				"name" => $parent_thread[ 'name' ],
				"id" => $parent_thread[ 'id' ],
				"tree_name" => $parent_thread[ 'tree_name' ],
				"tree_id" => $parent_thread[ 'tree_id' ]
			)
		);
		
		if ( !isset( $threads[0] ) ) {
			$this->msg->add( 201 ,
				"No Threads"
			);
		} else {
			foreach ( $threads as $thread ) {
				$this->msg->add( 101 ,
					array(
						"id" => $thread[ 'id' ],
						"name" => $thread[ 'name' ]
					)
				);
			}
		}
		
		return false;
	}
	
	private function list_entries() {
		$entries = $this->sql->query(
			"SELECT
				id,
				content,
				author_name,
				author_id
			FROM forum_entries
			WHERE parent_thread_id = '" . $this->params['thread_id'] . "'"
		)->getArray();
		
		if ( !isset( $entries[0] ) ) {
			$this->msg->add( 202 ,
				"No Entries"
			);
		} else {
			foreach ( $entries as $entry ) {
				$this->msg->add( 102 ,
					array(
						"id" =>			$entry[ 'id' ],
						"content" =>		$entry[ 'content' ],
						"author_name" =>	$entry[ 'author_name' ],
						"author_id" =>		$entry[ 'author_id' ]
					)
				);
			}
		}
		
		return false;
	}
	
	public function create_thread() {
		$user = $this->nsecure->db_GetUser( $this->sql );
		
		$tTest = $this->sql->query(
			"SELECT id
			FROM forum_threads
			WHERE parent_thread_id = " . $this->params[ 'thread_id' ] . " AND name ~* '" . $this->params[ 'name' ] . "'
			LIMIT 1;"
		)->getSingle();
		
		print_r( $tTest[ 'id' ] );
		
		if ( isset( $tTest[ 'id' ] ) ) {
			$this->msg->addError( "Thread with same name already exists within this span" );
			return false;
		}
		
		date_default_timezone_set('UTC');
		
		if ( $this->params[ 'thread_id' ] == 0 ) {
			$parent_thread = array(
				"id" => 0,
				"name" => "index",
				"tree_name" => "/",
				"tree_id" => "/"
			);
		} else {
			$parent_thread = $this->sql->query(
				"SELECT
					id,
					name,
					tree_name,
					tree_id
				FROM forum_threads WHERE id = '" . $this->params[ 'thread_id' ] . "' LIMIT 1;"
			)->getSingle();
		}
		
		$tree_name =	$parent_thread[ 'tree_name' ] .	$parent_thread[ 'name' ] .	"/";
		$tree_id =		$parent_thread[ 'tree_id' ] .		$parent_thread[ 'id' ] .		"/";
		
		$this->sql->insert(
			"forum_threads",
			array(
				"name" =>				htmlspecialchars( $this->params[ 'name' ] ),
				
				"author_id" =>			$user['id'],
				"author_name" =>		$user['username'],
				
				"parent_thread_id" =>		$parent_thread[ 'id' ],
				"parent_thread_name" =>	$parent_thread[ 'name' ],
				
				"tree_name" =>			$tree_name,
				"tree_id" =>			$tree_id,
				
				"owner_id" =>			1,
				"owner_name" =>			$user['username'],
				
				"group_id" =>			1,
				"group_name" =>			"admin",
				
				"changed_by_id" =>		$user[ 'id' ],
				"changed_by_name" => 	$user[ 'username' ],
				
				"permission" =>			"777",
				"changed" =>			date( "Y-m-d H:i:s " ) . "GMT"
			)
		);
		
		$this->msg->add( 100 , "Created thread successfully" );
	}
	
	public function create_entry() {
		$user = $this->nsecure->db_GetUser( $this->sql );
		
		date_default_timezone_set('UTC');
		
		if ( $this->params[ 'thread_id' ] == 0 ) {
			$parent_thread = array(
				"id" => 0,
				"name" => "index"
			);
		} else {
			$parent_thread = $this->sql->query(
				"SELECT id , name 
				FROM forum_threads
				WHERE id = '" . $this->params[ 'thread_id' ] . "';"
			)->getSingle();
		}
		
		$this->sql->insert(
			"forum_entries",
			array(
				"author_id" => $user[ 'id' ],
				"author_name" => $user['username'],
				
				"parent_thread_id" => $parent_thread[ 'id' ],
				"parent_thread_name" => $parent_thread[ 'name' ],
				
				"owner_id" => 1,
				"owner_name" => $user['username'],
				
				"group_id" => 1,
				"group_name" => "admin",
				
				"changed_by_id" => 1,
				"changed_by_name" => $user[ 'username' ],
				
				"content" => htmlspecialchars( $this->params[ 'content' ] ),
				
				"permission" => "777",
				"changed" => date( "Y-m-d H:i:s " ) . "GMT"
			)
		);
		
		$this->msg->add( 100 , "Created entry successfully" );
	}
	
	public function remove_entry() {
		$user = $this->nsecure->db_GetUser( $this->sql );
		
		if ( $user[ 'username' ] != "septic" ) {
			$this->addError( "You are not authenticated to remove entries" );
			
			return false;
		}
		
		$this->sql->query( "DELETE FROM forum_entries WHERE id = " . $this->params[ 'id' ] . ";" );
		
		$this->msg->add( 100 , "Removed entry successfully" );
		
		return false;
	}
	
	public function remove_thread() {
		$user = $this->nsecure->db_GetUser( $this->sql );
		
		if (
			$user[ 'username' ] != "septic" &&
			$user[ 'username' ] != "liquid_raven" ) {
			$this->addError( "You are not authenticated to remove threads" );
			
			return false;
		}
		
		$this->sql->query( "DELETE FROM forum_threads WHERE id = " . $this->params[ 'id' ] . ";" );
		
		$this->msg->add( 100 , "Removed thread successfully" );
		
		return false;
	}
}
?>