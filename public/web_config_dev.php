<?php

use app\helpers\Configuration;
// DB Config
Configuration::write('db.host', 'localhost');
Configuration::write('db.port', '');
Configuration::write('db.basename', 'nez_soc_net');
Configuration::write('db.user', 'root');
Configuration::write('db.password', '');
// Project Config
Configuration::write('path.url', '/nez_soc_net/');


Configuration::write('mail.username', 'myemail@socialnet.com');
Configuration::write('mail.password', 'trlababalan');
Configuration::write('mail.host', 'smtp.gmail.com');
Configuration::write('mail.port', '587');

Configuration::write('mail.send', false);

Configuration::write('path.domain', 'http://localhost');