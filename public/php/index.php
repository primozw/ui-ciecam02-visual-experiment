<?php
 	
	//Make sure that it is a POST request.
	if(strcasecmp($_SERVER['REQUEST_METHOD'], 'POST') != 0){
	    throw new Exception('Request method must be POST!');
	}
	 
	//Receive the RAW post data.
	$content = trim(file_get_contents("php://input"));
	 
	//Attempt to decode the incoming RAW post data from JSON.
	$post_data  = json_decode($content, true);
	 
	//If json_decode failed, the JSON is invalid.
	if(!is_array($post_data )){
	    throw new Exception('Received content contained invalid JSON!');
	}
 
	require('config.php');

	// Create connection
	$mysqli = new mysqli($servername, $username, $password, $database);

	// Check connection
	if ($mysqli->connect_errno) {
	    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
	}

	// Set character type
	$mysqli->set_charset("utf8");

	

	// GET VALUES FROM USER DATA	
	$userID = intval( $mysqli->real_escape_string($post_data['userID']) );

	foreach ($post_data['conditions'] as $condition => $value) {
		if (gettype($value) == 'array'){
			$$condition = join($value, ';');
		} else {
			$$condition =  $mysqli->real_escape_string($value);
		}
	}

	foreach ($post_data['userData'] as $data) {
		$color1 = $mysqli->real_escape_string($data['color1']);
		$color2 = $mysqli->real_escape_string($data['color2']);
		$background1 = $mysqli->real_escape_string($data['background1']);
		$background2 = $mysqli->real_escape_string($data['background2']);
		$adjust = intval( $mysqli->real_escape_string($data['adjust']) );
		$id = intval( $mysqli->real_escape_string($data['id']) );
		$agreement = intval( $mysqli->real_escape_string($data['agreement']) );
		$jch = join($data['JCH'], ';');

		$background1XYZ = join($data['background1XYZ'], ';');
		$background2XYZ = join($data['background2XYZ'], ';');
		$proximal1XYZ = join($data['proximal1XYZ'], ';');
		$proximal2XYZ = join($data['proximal2XYZ'], ';');
		$rgb2 = join($data['rgb2'], ';');
		$xyz1 = join($data['xyz1'], ';');
		$xyz2 = join($data['xyz2'], ';');
		$time = $data['time'];


		// Perform database query		
		$sql = "INSERT INTO results (userID, time, adaptLum, pHue, pLightness, surroundType, whitePoint, workspace, color1, color2, background1, background2, adjust, id, agreement, jch, background1XYZ, background2XYZ, proximal1XYZ, proximal2XYZ, rgb2, xyz1, xyz2) VALUES ('{$userID}', '{$time}', '{$adaptingLuminance}','{$pHue}','{$pLightness}', '{$surroundType}', '{$whitePoint}', '{$workspace}', '{$color1}', '{$color2}', '{$background1}', '{$background2}', '{$adjust}', '{$id}', '{$agreement}', '{$jch}', '{$background1XYZ}', '{$background2XYZ}', '{$proximal1XYZ}','{$proximal2XYZ}','{$rgb2}','{$xyz1}','{$xyz2}')";

		if ($mysqli->query($sql) !== TRUE) {
			echo "Error: " . $sql . "<br>" . $mysqli->error;
			die();
		}
	}				 	 

	$mysqli->close();

	echo 'OK';
	
 ?>
