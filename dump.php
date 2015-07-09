<?php

$post = file_get_contents('php://input');
$name = $_GET['name'];
$f = fopen("last_dump/" . $name, "w");
fwrite($f, $post);
fclose($f);

?>
