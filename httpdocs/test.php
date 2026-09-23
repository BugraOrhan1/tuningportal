<?php
echo "PHP works - DASHFIX httpdocs OK<br>";
echo "data vehicles: " . count(json_decode(file_get_contents(__DIR__.'/data/vehicles.json'), true)['makes']) . " makes<br>";
echo "assets css exists: " . (file_exists(__DIR__.'/assets/css/style.css') ? 'yes' : 'no') . "<br>";
echo "css exists: " . (file_exists(__DIR__.'/css/style.css') ? 'yes' : 'no') . "<br>";
