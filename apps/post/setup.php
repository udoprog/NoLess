<?php
	
	
	Application::$OpDir = "/ops";
	
	DatabasePgsql::$config = array(
		"host" => "127.0.0.1",
		"port" => "5432",
		"dbname" => "db",
		"user" => "dbuser",
		"password" => "dbpass"
	);
	
	DatabasePgsql::$structure[ "forum_threads" ] = 
						"CREATE TABLE forum_threads
						(
							id bigserial NOT NULL,
							name character varying(128) NOT NULL,
							
							parent_thread_id bigint NOT NULL,
							parent_thread_name character varying(128) NOT NULL,
							
							tree_name character varying(1024) NOT NULL,
							tree_id character varying(1024) NOT NULL,
							
							author_id bigint NOT NULL,
							author_name character varying(32) NOT NULL,
							
							owner_id bigint NOT NULL,
							owner_name character varying(32) NOT NULL,
							
							group_id bigint NOT NULL,
							group_name character varying(32),
							
							changed_by_id bigint NOT NULL,
							changed_by_name character varying(32) NOT NULL,
							
							permission character varying(3) NOT NULL,
							created timestamp with time zone DEFAULT now(),
							changed timestamp with time zone,
							
							CONSTRAINT forum_threads_id_prim PRIMARY KEY (id),
							CONSTRAINT forum_threads_id_unq UNIQUE ( id )
						)
						WITHOUT OIDS;";
	
	DatabasePgsql::$structure[ "forum_entries" ] = 
						"CREATE TABLE forum_entries
						(
							id bigserial NOT NULL,
							
							parent_thread_id bigint NOT NULL,
							parent_thread_name character varying(128) NOT NULL,
							
							author_id bigint NOT NULL,
							author_name character varying(32) NOT NULL,
							
							owner_id bigint NOT NULL,
							owner_name character varying(32) NOT NULL,
							
							group_id bigint NOT NULL,
							group_name character varying(32),
							
							changed_by_id bigint NOT NULL,
							changed_by_name character varying(32) NOT NULL,
							
							permission character varying(3) NOT NULL,
							created timestamp with time zone DEFAULT now(),
							changed timestamp with time zone,
							
							content character varying( 32000 ),
							
							CONSTRAINT forum_entries_id_prim PRIMARY KEY (id)
						)
						WITHOUT OIDS;";
						
	DatabasePgsql::$structure[ "forum_user" ] = 
						"CREATE TABLE forum_user
						(
							user_username character varying(32),
							user_id bigint,
							posts bigint DEFAULT 0,
							avatar_url character varying( 128 ) DEFAULT NULL,
							CONSTRAINT forum_user_user_id_prim PRIMARY KEY (user_id)
						) 
						WITHOUT OIDS;";
	
	/*DatabasePgsql::$executes[ "postUser" ] =
					"SELECT
						nsecure.username AS username ,
						nsecure.email AS email ,
						nsecure.password AS password ,
						forum_user.avatar_url AS avatar_url
					FROM 
						nsecure ,
						forum_user
					WHERE nsecure.username ~* \$1
					LIMIT 1;";*/
	
	/*DatabasePgsql::$structure[ "pnews" ] = 
					"CREATE TABLE pnews
					(
					  id bigserial NOT NULL,
					  \"password\" character varying(32),
					  CONSTRAINT id_prim PRIMARY KEY (id),
					  CONSTRAINT username_unq UNIQUE (username)
					) 
					WITHOUT OIDS;";
	*/
?>