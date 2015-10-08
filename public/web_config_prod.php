<?php

use app\helpers\Configuration;
// DB Config
Configuration::write('db.host', 'localhost');
Configuration::write('db.port', '');
Configuration::write('db.basename', 'purepilatesdb_new');
Configuration::write('db.user', 'root');
Configuration::write('db.password', 'gh0c2211hrx');
// Project Config
Configuration::write('path.url', '/purepilates/');

Configuration::write('mail.username', 'ghoc.hrx@gmail.com');
Configuration::write('mail.password', 'isyxblxmzaxlnuku');
Configuration::write('mail.host', 'vps.webkanta.com');
Configuration::write('mail.port', '587');

Configuration::write('mail.send', true);

Configuration::write('path.domain', 'http://pilateszagreb.eu');