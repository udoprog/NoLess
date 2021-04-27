<?php

$NoLessDirname = dirname(__FILE__);

require( $NoLessDirname . "/config.php" );

if ( $System )					require_once "$NoLessDirname/classes/System.php";
if ( $Application )					require_once "$NoLessDirname/classes/Application.php";
	if ( $QueryApplication )				require_once "$NoLessDirname/classes/application/QueryApplication.php";
	if ( $MainApplication )				require_once "$NoLessDirname/classes/application/MainApplication.php";

if ( $System_NClientInput )		require_once "$NoLessDirname/classes/system/input/NClientInput.php";

if ( $System_DatabasePgsql )	require_once "$NoLessDirname/classes/system/database/DatabasePgsql.php";

if ( $System_NDocument )		require_once "$NoLessDirname/classes/system/document/NDocument.php";
if ( $System_DocumentHtml )		require_once "$NoLessDirname/classes/system/document/HtmlDocument.php";
if ( $System_DocumentXml )		require_once "$NoLessDirname/classes/system/document/XmlDocument.php";
if ( $System_DocumentXCom )		require_once "$NoLessDirname/classes/system/document/XComDocument.php";

if ( $System_NClientOutput )	require_once "$NoLessDirname/classes/system/output/NClientOutput.php";
if ( $System_NFileStream )		require_once "$NoLessDirname/classes/system/output/NFileStream.php";
if ( $System_NMsgHandler )		require_once "$NoLessDirname/classes/system/output/NMsgHandler.php";


if ( $System_NSecure )			require_once "$NoLessDirname/classes/system/security/NSecure.php";

Class NoLess {
	const VERSION = "0.1 Pre-Alpha";
	const NAME = "NoLess PHP/Javascript Framework";
};

require( $NoLessDirname . "/setup.php" );

?>