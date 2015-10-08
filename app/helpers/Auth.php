<?php

namespace app\helpers;

use app\helpers\Configuration;
use app\helpers\Sessions;
use app\model\User\RegisteredUser;
use app\helpers\Hash;

class Auth
{
    public static function checkAuthentication()
    {
        // initialize the session (if not initialized yet)
        Sessions::init();

        // if user is not logged in...
        if (!self::userIsLoggedIn()) {
            // ... then treat user as "not logged in", destroy session, redirect to login page
            Sessions::destroy();
            header('location: ' . Configuration::read('path.url') . 'clanovi/login');
            // to prevent fetching views via cURL (which "ignores" the header-redirect above) we leave the application
            // the hard way, via exit(). @see https://github.com/panique/php-login/issues/453
            // this is not optimal and will be fixed in future releases
            exit();
        }
    }


    public static function userIsLoggedIn()
    {
        return (Sessions::get(Configuration::read('session.user_logged_in')) ? true : false);
    }

    public static function doUserLogin($user)
    {

        Sessions::set(Configuration::read('session.user_logged_in'), true);
        $user = RegisteredUser::getUserByEmail($user->email);
        Sessions::set(Configuration::read('session.logged_user'), $user);
        Sessions::set(Configuration::read('session.logged_user_id'), $user->id);
        Sessions::set(Configuration::read('session.logged_user_email'), $user->email);

        return $user;
    }

    public static function doUserLogout() {
        if(isset($_COOKIE[Configuration::read('cookie.user_remember_me')]))
        {
            $logged_user_id = Sessions::get(Configuration::read('session.logged_user_id'));
            $user = RegisteredUser::getUserById($logged_user_id);
            $user->removeRememberMeCredentials();
            setcookie(Configuration::read('cookie.user_remember_me'), "", time() - 36000, "/");
            unset($_COOKIE[Configuration::read('cookie.user_remember_me')]);

        }
        Sessions::destroy();
        Sessions::init();
//        Sessions::set(Configuration::read('session.user_logged_in'), false);
//
//        Sessions::set(Configuration::read('session.logged_user'), null);
//        Sessions::set(Configuration::read('session.logged_user_id'), null);
//        Sessions::set(Configuration::read('session.logged_user_email'), null);
    }

    public static function setUserRememberMe($user) {

        $remember_me_id = Hash::getMSG()->generateString(128);
        $remember_me_token = Hash::getMSG()->generateString(128);
        $user->updateRememberMeCredentials($remember_me_id, Hash::hash($remember_me_token));

        setcookie(Configuration::read('cookie.user_remember_me'),
            "{$remember_me_id}___{$remember_me_token}",
            time() + Configuration::read('cookie.user_remember_me_duration'),
            "/");
    }

    public static function rememberMeCookieLogin($cookie_data) {
        $credentials = explode('___', $cookie_data);
        if (!((!isset($cookie_data) || trim($cookie_data) == FALSE) ||
            count($credentials) !==2))
        {
            $identifier = $credentials[0];
            $token = Hash::hash($credentials[1]);
            if($user = RegisteredUser::existsWithCredentials($identifier)) {
                if($user->credentialsMatch($token)) {
                    $user = Auth::doUserLogin($user);
                    return $user;
                }
                else {
                    $user->removeRememberMeCredentials();
                    return null;
                }
            }
            else {
                return null;
            }
        }
        return null;
    }
}
