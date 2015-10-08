<?php

use app\helpers\Configuration;
// DB Config
Configuration::write('db.host', 'localhost');
Configuration::write('db.port', '');
Configuration::write('db.basename', 'authdatabase');
Configuration::write('db.user', 'root');
Configuration::write('db.password', 'databasepass');
// Project Config
Configuration::write('path.url', '/purepilates/');

Configuration::write('mail.username', 'email@email.com');
Configuration::write('mail.password', 'isyxblxmzaxlnuku');
Configuration::write('mail.host', 'vps.dsds.com');
Configuration::write('mail.port', '587');

Configuration::write('mail.send', true);

Configuration::write('path.domain', 'http://pilateszagreb.eu');