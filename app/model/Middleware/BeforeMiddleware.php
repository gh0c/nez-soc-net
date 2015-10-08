<?php

namespace app\model\Middleware;

use Slim\Middleware;
use app\helpers\Configuration;
use app\helpers\Sessions;
use app\helpers\Auth;
use app\model\User\RegisteredUser;


class BeforeMiddleware extends Middleware
{
    public function call()
    {
        $this->app->hook('slim.before', array($this, 'run'));
        $this->next->call();
    }

    public function run()
    {

        if (Sessions::get(Configuration::read('session.user_logged_in')))  {
            $this->app->auth = RegisteredUser::getUserById(Sessions::get(Configuration::read('session.logged_user_id')));
        }
        $this->checkRememberMe();

        $error_msgs = Sessions::get(Configuration::read('session.status.error'));
        $success_msgs = Sessions::get(Configuration::read('session.status.success'));
        $status_msgs = Sessions::get(Configuration::read('session.status.neutral'));

        Sessions::set(Configuration::read('session.status.error'), null);
        Sessions::set(Configuration::read('session.status.success'), null);
        Sessions::set(Configuration::read('session.status.neutral'), null);

        $this->app->view()->appendData(array(
            'error_msgs' => $error_msgs,
            'success_msgs' => $success_msgs,
            'status_msgs' => $status_msgs,
            'auth' => $this->app->auth));

    }

    protected function checkRememberMe() {
        if(isset($_COOKIE[Configuration::read('cookie.user_remember_me')]) &&
            !$this->app->auth) {

            $data = $_COOKIE[Configuration::read('cookie.user_remember_me')];
            $user = Auth::rememberMeCookieLogin($data);
            if($user) {
                $this->app->auth = $user;
            }
        }
    }
}
