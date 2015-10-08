<?php

use app\helpers\Sessions;
use app\helpers\Configuration as Cfg;
use app\model\User\RegisteredUser;
use app\helpers\Auth;
use app\helpers\Mailer;

$app->get('/clanovi/registracija', $guest(), function () use ($app) {
    $app->render('authentication/registration.twig', array(
    ));
})->name('user.registration');




$app->post('/clanovi/registracija', $guest(), function() use ($app) {
    $p_email = $app->request->post('email');
    $p_username = $app->request->post('username');
    $p_password = $app->request->post('password');
    $p_password_repeated = $app->request->post('password-repeated');
    $p_first_name = $app->request->post('first-name');
    $p_last_name = $app->request->post('last-name');
    $p_sex = $app->request->post('sex');
    if(!isset($p_email) || $p_email === "" || !isset($p_username) || $p_username === ""
        || !isset($p_password) || $p_password === "" || !isset($p_password_repeated) || $p_password_repeated === "")
    {
        $app->flash('errors',  "Nedostaju podaci za registraciju! \n" .
            "Unos e-mail adrese, korisničkog imena i lozinke su obavezni za prijavu.");
        $app->response()->redirect($app->urlFor('user.registration'));
    }
    if (!($p_password === $p_password_repeated)) {
        $app->flash('errors',  "Lozinka i njena potvrda se ne poklapaju!");
        $app->response()->redirect($app->urlFor('user.registration'));
    }

    // create new user
    if (RegisteredUser::createNew($p_username, $p_email, $p_password, $p_first_name, $p_last_name, $p_sex)) {
        $app->flash('success', "Uspješna registracija!");
        $app->flash('statuses', "Sada se možete prijaviti koristeći unesene podatke.");
        $app->response()->redirect($app->urlFor('user.login'));
    } else {
        $app->flash('errors', "Greška kod unosa u bazu..\nPokušajte ponovno");
        $app->response()->redirect($app->urlFor('user.login'));
    }



})->name('user.registration.post');





