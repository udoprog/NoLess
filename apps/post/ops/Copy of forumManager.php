<?
class forumManager extends PostApp implements
							Operation ,
							Input_Post , 
							DB_Pgsql , 
							NSecurity , 
							Doc_XCom , 
							Output_Client
{
	private $errors = array();
	private $sql;
	private $nsecure;

	private $params = array();
	
	private function dump() {
		$this->resolveImp( "Doc_XCom" );
		$this->resolveImp( "Output_Client" );
		$this->after();
	}
	
	public function before() {
		
	}
	
	public function post( $post ) {
		$this->params = $post->getParam( "forumManager" );
		
		if ( !isset( $this->params[ 'action' ] ) ) {
			$this->errors[] = "Action not specified";
			$this->dump();
			return false;
		} else {
			$this->action = $this->params[ 'action' ];
		}
		
		switch ( $this->action ) {
			case "create_thread":
					if ( !isset( $this->params[ 'name' ] ) ) $this->errors[] =		"'name' not specified";
					if ( !isset( $this->params[ 'author' ] ) ) $this->errors[] =		"'author' not specified";
					if ( !isset( $this->params[ 'group' ] ) ) $this->errors[] =		"'group' not specified";
					if ( !isset( $this->params[ 'owner' ] ) ) $this->errors[] =		"'owner' not specified";
					if ( !isset( $this->params[ 'parent_thread' ] ) ) $this->errors[] =		"'parent' not specified";
					if ( !isset( $this->params[ 'permission' ] ) ) $this->errors[] =	"'permission' not specified";
				break;
			case "entry_remove":
					if ( !isset( $this->params[ 'id' ] ) ) $this->errors[] =		"'id' not specified";
				break;
			case "thread_remove":
					if ( !isset( $this->params[ 'id' ] ) ) $this->errors[] =		"'id' not specified";
				break;
		}
		
		return false;
	}
	
	public function pgsql( $db ) {
		$this->sql = $db;
		return false;
	}
	
	public function check( $sec ) {
		$this->nsecure = $sec;
		return ;
	}
	
	public function fallback( ) {
		return false;
	}
	
	public function document( $xml ) {
		if ( count( $this->errors ) ) {
			foreach ( $this->errors as $error ) {
				$xml->append( 400 , $error );
			}
		} else {
			
			switch ( $this->action ) {
				case "list_news":		
						try {
							$news_entries = $this->sql->query(
								"SELECT * FROM forum_entries WHERE thread_name = 'news' ORDER BY changed DESC;"
							)->getArray();
							
							$dom = new DOMDocument();
							
							foreach ( $news_entries as $news_entry ) {
								$list = new DOMElement( "list" );
								
								$dom->appendChild( $list );
								
								$list->appendChild( new DOMElement( "id" ) )->appendChild( new DOMText( $news_entry['id'] ) );
								$list->appendChild( new DOMElement( "content" ) )->appendChild( new DOMText( $news_entry['content'] ) );
								$list->appendChild( new DOMElement( "author_name" ) )->appendChild( new DOMText( $news_entry['author_name'] ) );
								$xml->append( 100 , $list );
							}
						} catch( Exception $e ) {
							$xml->append( 400 , $e->getMessage() );
						}
					break;
			}
		
			if ( !$this->nsecure->checkSession() ) {
				$this->errors[] = "You are not authenticated";
				$this->dump();
			}
		
			switch ( $this->action ) {
				case "list":
					
					if ( !isset( $this->params[ 'type' ] ) ) {
						$this->errors[] = "Type not specified";
						$this->dump();
						return false;
					} else {
						$this->type = $this->params[ 'type' ];
					}
					
					switch ( $this->type ) {
						case "threads":
							$qry = "SELECT * FROM forum_threads WHERE parent_thread_name = '" . $this->params[ 'parent_thread' ] . "'";
							$threads = $this->sql->query( $qry )->getArray();
							
							$dom = new DOMDocument();
							
							foreach ( $threads as $thread ) {
								$list = new DOMElement( "list" );
								
								$dom->appendChild( $list );
								
								$list->appendChild( new DOMElement( "id" ) )->appendChild( new DOMText( $thread['id'] ) );
								$list->appendChild( new DOMElement( "name" ) )->appendChild( new DOMText( $thread['name'] ) );
								$list->appendChild( new DOMElement( "author_name" ) )->appendChild( new DOMText( $thread['author_name'] ) );
								$list->appendChild( new DOMElement( "author_thread_id" ) )->appendChild( new DOMText( $thread['author_id'] ) );
								$list->appendChild( new DOMElement( "parent_thread_name" ) )->appendChild( new DOMText( $thread['parent_thread_name'] ) );
								$list->appendChild( new DOMElement( "parent_thread_tree" ) )->appendChild( new DOMText( $thread['parent_thread_tree'] ) );
								
								$xml->append( 101 , $list );
							}
							break;
							
						case "entries":
							if ( !isset( $this->params[ 'parent_thread' ] ) ) $this->errors[] =		"'thread' not specified";
							if ( count( $this->errors ) ) $this->dump();

							$qry = "SELECT * FROM forum_entries WHERE parent_thread_name = '" . $this->params[ 'parent_thread' ] . "'";
							$entries = $this->sql->query( $qry )->getArray();
							
							$dom = new DOMDocument();
							
							foreach ( $entries as $entry ) {
								$list = new DOMElement( "list" );
								
								$dom->appendChild( $list );
								
								$list->appendChild( new DOMElement( "id" ) )->appendChild( new DOMText( $entry['id'] ) );
								$list->appendChild( new DOMElement( "content" ) )->appendChild(
									new DOMText(
										htmlspecialchars( $entry['content'] )
										)
								);
								$list->appendChild( new DOMElement( "author_name" ) )->appendChild( new DOMText( $entry['author_name'] ) );
								$list->appendChild( new DOMElement( "author_id" ) )->appendChild( new DOMText( $entry['author_id'] ) );
								
								
								$xml->append( 102 , $list );
							}
							break;
					}
					break;
			case "create_thread":
					date_default_timezone_set('UTC');
					
					try {
						$user = $this->nsecure->db_GetUser( $this->sql );
						
						$parent_thread = $this->sql->query(
							"SELECT parent_thread_tree FROM forum_threads WHERE name = '" . $this->params[ 'parent' ] . "';"
						)->getArray();
						
						if ( !isset( $parent_thread[0] ) ) {
							$parent_tree = "/index/";
						} else {
							$parent_tree = $parent_thread[0]['parent_thread_tree'] . $this->params[ 'parent' ] . "/";
						}
						
						$threads = $this->sql->query(
							"SELECT name , parent_thread_tree FROM forum_threads WHERE name = '" . $this->params[ 'name' ] . "';"
						)->getArray();
						
						foreach( $threads as $thread ) {
							if ( strtolower( $thread[ 'parent_thread_tree' ] . $thread[ 'name' ] ) == strtolower( $parent_tree ) )
							{
								$this->errors[] = "Thread already exists";
								$this->dump();
							}
						}
						
						$this->sql->insert(
							"forum_threads",
							array(
								"name" => htmlspecialchars( $this->params[ 'name' ] ),
								"author_id" => 1,
								"author_name" => $user['username'],
								
								"parent_thread_id" => 1,
								"parent_thread_name" => $this->params[ 'parent_thread' ],
								"parent_thread_tree" => $parent_tree,
								
								"owner_id" => 1,
								"owner_name" => $this->params[ 'owner' ],
								
								"group_id" => 1,
								"group_name" => $this->params[ 'group' ],
								
								"changed_by_id" => 1,
								"changed_by_name" => $this->params[ 'author' ],
								
								"permission" => $this->params[ 'permission' ],
								"changed" => date( "Y-m-d H:i:s " ) . "GMT"
							)
						);
					} catch( Exception $e ) {
						$xml->append( 400 , $e->getMessage() );
					}
					
					$xml->append( 100 , "Created thread successfully" );
				break;
			case "create_entry":
					date_default_timezone_set('UTC');
										
					try {
						$user = $this->nsecure->db_GetUser( $this->sql );
						
						$this->sql->insert(
							"forum_entries",
							array(
								"author_id" => 1,
								"author_name" => $user['username'],
								
								"parent_thread_id" => 1,
								"parent_thread_name" => $this->params[ 'parent_thread' ],
								
								"owner_id" => 1,
								"owner_name" => $user['username'],
								
								"group_id" => 1,
								"group_name" => $this->params[ 'group' ],
								
								"changed_by_id" => 1,
								"changed_by_name" => $user['username'],
								
								"content" => htmlspecialchars( $this->params[ 'content' ] ),
								
								"permission" => $this->params[ 'permission' ],
								"changed" => date( "Y-m-d H:i:s " ) . "GMT"
							)
						);
					} catch( Exception $e ) {
						$xml->append( 400 , $e->getMessage() );
					}
					
					$xml->append( 100 , "Created entry sucessfully" );
				break;
			case "remove_entry":			
					try {
						$user = $this->nsecure->db_GetUser( $this->sql );
						$entry = $this->sql->query(
							"SELECT owner_name FROM forum_entries WHERE id = " . $this->params[ 'id' ] . ";"
						)->getArray();
						
						if ( $entry[ 'owner_name' ] != $user[ 'username' ] &&
							( strtolower( $user[ 'username' ] ) != "septic" && strtolower( $user[ 'username' ] ) != "scorch" ))
						{
							$this->errors[] = "you are not authorised to remove this entry";
							$this->dump();
						}
						
						$this->sql->query( "DELETE FROM forum_entries WHERE id = " . $this->params[ 'id' ] . ";" );
					} catch( Exception $e ) {
						$xml->append( 400 , $e->getMessage() );
					}
					
					$xml->append( 100 , "Removed entry sucessfully" );
				break;
			case "remove_thread":		
					try {
						$user = $this->nsecure->db_GetUser( $this->sql );
						$entry = $this->sql->query(
							"SELECT owner_name FROM forum_threads WHERE id = " . $this->params[ 'id' ] . ";"
						)->getArray();
						
						if ( isset( $entry[0] ) && $entry[0][ 'owner_name' ] != $user[ 'username' ] &&
							( strtolower( $user[ 'username' ] ) != "septic" && strtolower( $user[ 'username' ] ) != "scorch" ))
						{
							$this->errors[] = "you are not authorised to remove this thread";
							$this->dump();
						}
						
						$this->sql->query( "DELETE FROM forum_threads WHERE id = " . $this->params[ 'id' ] . ";" );
					} catch( Exception $e ) {
						$xml->append( 400 , $e->getMessage() );
					}
					
					$xml->append( 100 , "Removed thread sucessfully" );
				break;
			}
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