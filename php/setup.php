<?
	DatabasePgsql::$structure["nsecure"] =
					"CREATE TABLE nsecure
					(
					  username character varying(32) NOT NULL,
					  id bigserial NOT NULL,
					  \"password\" character varying(32),
					  email character varying(32),
					  CONSTRAINT nsecure_id_prim PRIMARY KEY (id),
					  CONSTRAINT nsecure_username_unq UNIQUE (username)
					) 
					WITHOUT OIDS;";
	
	DatabasePgsql::$executes[ "isTable" ] =	"SELECT pg_class.relname FROM pg_class WHERE pg_class.relname = \$1;";
?>