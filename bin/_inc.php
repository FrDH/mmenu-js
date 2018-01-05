<?php

function getDist()
{
	global $src, $argv;

	if ( isset( $argv[ 1 ] ) )
	{
		return dirname( dirname( __FILE__ ) ) . '/' . $argv[ 1 ];
	}
	return substr( $src, 0, -1 );
}

$parts	= [ 'core', 'extensions', 'addons', 'wrappers' ];
$src 	= dirname( dirname( __FILE__ ) ) . '/src/';
