<?php
use \app\model\User\RegisteredUser;
use app\model\Helpers\Sessions;
use app\config\Configuration as Cfg;
use app\model\Content\ImagesHandler;

$user_model = new RegisteredUser();

$app->group('/clanovi', function () use ($app, $user_model, $authenticated) {

    $app->get('/test-cloudinary', $authenticated(), function() use($app) {
        $app->render('user/cloudinary/cloudinary.test.twig', array(
            'user' => $app->auth
        ));
    })->name('user.cloudinary_ul');

    $app->get('/test-cloudinary-prew', $authenticated(), function() use($app) {
        $app->render('user/cloudinary/cloudinary.test_prew.twig', array(
            'user' => $app->auth
        ));
    })->name('user.cloudinary_ul.prew');

    $app->post('/test-cloudinary', $authenticated(), function() use ($app) {
        echo "submit";
        $p_avatar_file = $_FILES['avatar_file'];
        $zz = \Cloudinary\Uploader::upload($_FILES['avatar_file']['tmp_name'],
            array(
                "public_id" => "testa/c1"
            ));

        echo "<br>ZZ:<br>";var_dump($zz);

        $app->render('user/cloudinary/cloudinary.test_prew.twig', array(
            'user' => $app->auth
        ));
    })->name('user.cloudinary_ul.post');

    $app->get('/test-cloudinary-ul', $authenticated(), function() use($app) {
        $api = new \Cloudinary\Api();
        $upload_preset = "sample_" . substr(sha1(Cloudinary::config_get("api_key") .
                Cloudinary::config_get("api_secret")), 0, 10);
        try {
            $api->upload_preset($upload_preset);
        } catch (\Cloudinary\Api\NotFound $e) {
            $api->create_upload_preset(array("name"=>$upload_preset, "unsigned"=>TRUE, "folder"=>"test"));
        }
        $app->render('user/cloudinary/cloudinary.test.adhoc.twig', array(
            'user' => $app->auth,
            'upload_preset' => $upload_preset
        ));
    })->name('user.cloudinary_adhoc_ul.prew');

});
?>
