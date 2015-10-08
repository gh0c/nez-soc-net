<?php

use app\helpers\Configuration;
use app\helpers\Sessions;

$authenticationCheck = function($required) use ($app) {
    return function() use ($required, $app) {
        if (!$app->auth && $required)  {
            $app->flash('statuses', "Stranica dostupna samo prijavljenim članovima!");
            $app->redirect($app->urlFor('user.login'));
        }
        else if ($app->auth && !$required){
            $app->flash('statuses', "Već ste prijavljeni!");
            $app->redirect($app->urlFor('user.home'));
        }
    };
};

$authenticated = function() use ($authenticationCheck) {
    return $authenticationCheck(true);
};

$guest = function() use ($authenticationCheck) {
    return $authenticationCheck(false);
};
?>