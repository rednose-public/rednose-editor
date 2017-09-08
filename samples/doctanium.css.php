<?php

// Simulate a delay

$css = file_get_contents('doctanium.css');

//sleep(1);

header("Content-type: text/css", true); 

echo ($css);
