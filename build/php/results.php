<!doctype html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="description" content="">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Rezultati zaznave barv</title>

    <!-- Bootstrap -->
    <link href="../css/bootstrap.min.css" rel="stylesheet" media="screen">
    <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&amp;subset=latin-ext" rel="stylesheet">

    <style type="text/css">
		body {
			font-family: 'Roboto', sans-serif;
		}

		#table-results {
			table-layout: fixed;
		}
    
    	.container {
    		width: 1280px;
    	}

    	.colorpatch {
    		width: 40px;
    		height: 40px;
    		float: left;
    		margin-right: 5px;
    		display: inline-block;
    	}

    	h1 {
    		font-size: 1.5em;
    		margin: 1em 0;
    	}

    	img {
    		width: 600px;
    		height: auto;
    		margin-bottom: 2em;
    	}



    </style>

  </head>
  <body>
  	<div class="container">
  		

  		<?php

  		require('config.php');

		// Create connection
		$mysqli = new mysqli($servername, $username, $password, $database);

		// Check connection
		if ($mysqli->connect_errno) {
		    echo "Failed to connect to MySQL: (" . $mysqli->connect_errno . ") " . $mysqli->connect_error;
		}

		// Set character type
		$mysqli->set_charset("utf8");

		// Get POST DATA
		if (!empty($_GET['image'])) {
			$image_name = 'slika-' . $_GET['image'] . '.jpg';
			$raw_data = $mysqli->query("SELECT * FROM hues WHERE image_id='{$image_name}' ORDER BY id ASC");
		} else {
			$raw_data = $mysqli->query("SELECT * FROM hues ORDER BY id ASC");
		}

		$results = array();

		if ($raw_data->num_rows > 0): 

			while($row = $raw_data->fetch_assoc()):
				$results[] = $row;
		    endwhile;

		    //print_r($results);
		?>

		<?php if (!empty($_GET['image'])): ?>
			<h1>Rezultati za <em><?php echo $image_name ?></em></h1>

			<img src="../test_images/<?php echo $image_name ?>">
		<?php else: ?>
			<h1>Rezultati meritev:</h1>
		<?php endif; ?>

		  <table id="table-results" class="table table-hover">
			    <thead>
			      <tr>
			        <th width="13%">ID</th>
			        <th width="13%">Gender</th>
			        <th width="13%">Letnica rojstva</th>
			        <th width="13%">City</th>
			        <th width="13%">Prof</th>
			        <th width="35%">Selected Colors</th>
			      </tr>
			    </thead>
			    <tbody>
					<?php foreach ($results as $row): ?>
						<tr>
					        <td><?php echo $row['id'] ?></td>
					        <td><?php echo $row['gender'] ?></td>
					        <td><?php echo $row['age'] ?></td>
					        <td><?php echo $row['city'] ?></td>
					        <td><?php echo $row['prof'] ?></td>
					        <td>
					        	<?php 
					        		$colors = explode(";", $row['results_values']);

					        		foreach ($colors as $color):
					        			echo '<span class="colorpatch" style="background-color: rgb(' . $color  .  ')"></span>';
					        		endforeach;



					        	 ?>

					    </tr>
					<?php endforeach ?>
			    </tbody>
			  </table>
		<?php
		    
		else: 
		    echo "Zaenkrat še ni rezultatov.";
		endif;
		$mysqli->close();

	?>
	
	</div>
  </body>
</html>
