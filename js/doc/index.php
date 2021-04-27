<html>
	<head>
		<title>
			NoLess Javascript Documentation
		</title>
		<style>
			html, body {
				background-color : #ffffff;
				color : #000000;
			}
		
			div#left {
				float : left;
				width : 15%;
			}
			
			div#right {
				float : left;
				width : 85%;
				height : 90%;
			}
		
			a.method {
				color : #000000;
				font-weight : bold;
				text-decoration : none;
				
				display : block;
				
				background-color : #cccccc;
				border : 1px solid #666666;
				
				padding-left : 5px;
			}
			
			a:hover.method {
				color : #333333;
				background-color : #ffffff;
			}
		
			list#logs {
				list-style: none;
			}
			
			list#logs li {
				padding : 0px;
				margin : 0px;
				
				width : 100%;
			}
		
			list#js_methods {
				list-style: none;
			}
			
			list#js_methods li {
				padding : 0px;
				margin : 0px;
				
				width : 100%;
			}
		</style>
	</head>
	<body>
		<h1>NoLess Javascript Documentation</h1>
		<div id='left'>
			<?php
			
				$logs = glob( "./*.log.txt" );
				echo "<list id='logs'>";
				
				foreach ( $logs as $log ) {
					$name = basename( $log );
					
					$name = substr( $name , 0 , strlen( $name ) - 4 );
					
					echo "<li><a href='display.php?file=$log' class='method' target='method_display'>$name</a></li>";
				}
				
				echo "</list>";
				echo "<br />";
				
				$docs = glob( "./*.doc.txt" );
				echo "<list id='js_methods'>";
				
				foreach ( $docs as $doc ) {
					$name = basename( $doc );
					$name = substr( $name , 0 , strlen( $name ) - 4 );
					
					echo "<li><a href='display.php?file=$doc' class='method' target='method_display'>$name</a></li>";
				}
				
				echo "</list>";
				
			?>
		</div>
		<div id="right">
			<iframe width="100%" height='100%' name="method_display" style="border: 1px solid #222222;">
			</iframe>
		</div>
	</body>
</html>