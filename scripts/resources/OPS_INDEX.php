<?
class Index extends SiteOperation {
	public function run() {
		$post = new HttpPost();
		$output = new HttpRelay();
		
		try {
			if ( $post->IsSet ) {
				$output->write( "Perform Post Operations" );
			} else {
				$html = new HtmlBuilder( "MySite" );
				$html->appendInternalJS( "Ajax" );
				$html->appendExternalJS( "./js/test.js" );
				
				$html->outputHTML();
			}
		} catch( GException $e ) {
			GError::CatchException( $e );
		}
	}
}
?>