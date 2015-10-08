<?php
namespace app\model\User;

use app\helpers\Configuration as Cfg;
use app\model\Database\DatabaseConnection;
use app\helpers\Hash;
use app\helpers\General;
use \PDO;
use \PDOException;

class RegisteredUser
{
    public $id = null;
    public $username = null;
    public $first_name = null;
    public $last_name = null;
    public $email = null;
    public $sex = "";
    private $password = null;
    private $pass_salt = null;
//    private $pass_hash = null;
    public $avatar_ext = "";
    public $active = 1;
    public $activated = null;
    public $deactivated = null;
    public $banned = null;

    function __construct($input_data = array()) {
        if ( isset( $input_data['id'] ) )
            $this->id = (int) $input_data['id'];
        if ( isset( $input_data['username'] ) )
            $this->username = $input_data['username'];
        if ( isset( $input_data['first_name'] ) )
            $this->first_name = $input_data['first_name'];
        if ( isset( $input_data['last_name'] ) )
            $this->last_name = $input_data['last_name'];
        if ( isset( $input_data['email'] ) )
            $this->email = $input_data['email'] ;

        if ( isset( $input_data['avatar_format_ext'] ) )
            $this->avatar_ext = $input_data['avatar_format_ext'];
        if ( isset( $input_data['sex'] ) )
            $this->sex = $input_data['sex'];

        if ( isset( $input_data['active'] ) )
            $this->active = (int)$input_data['active'];
        if ( isset( $input_data['activated'] ) )
            $this->activated = (int)$input_data['activated'];
        if ( isset( $input_data['deactivated'] ) )
            $this->deactivated = (int)$input_data['deactivated'];
        if ( isset( $input_data['banned'] ) )
            $this->banned = (int)$input_data['banned'];


        if ( isset( $input_data['password'] ) )
            $this->password = $input_data['password'];
        if ( isset( $input_data['salt'] ) )
            $this->pass_salt = $input_data['salt'];
    }

    public function populate_attributes_from_input($data)
    {
        $this->__construct($data);
    }

    public static function getUserById($user_id)    {
        $dbh = DatabaseConnection::getInstance();
        $sql = "SELECT * FROM user WHERE id = :id LIMIT 1";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':id', $user_id, PDO::PARAM_INT);
        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $user = new RegisteredUser($stmt->fetch(PDO::FETCH_ASSOC));
        } else {
            return null;
        }
        return $user;
    }

    public function getPassword() {
        return $this->password;
    }

    public function getPasswordSalt() {
        return $this->pass_salt;
    }

    public function full_name()  {
        return ($this->first_name . " " . $this->last_name);
    }

    public static function getUserByEmail($email){
        $dbh = DatabaseConnection::getInstance();
        $sql = "SELECT * FROM user WHERE email = :email LIMIT 1";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() == 1) {
            $user = new RegisteredUser($stmt->fetch(PDO::FETCH_ASSOC));
            return $user;
        }
        else {
            return null;
        }
    }

    public static function getUserByUsername($username){
        $dbh = DatabaseConnection::getInstance();
        $sql = "SELECT * FROM user WHERE username = :username LIMIT 1";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        if ($stmt->rowCount() == 1) {
            $user = new RegisteredUser($stmt->fetch(PDO::FETCH_ASSOC));
            return $user;
        }
        else {
            return null;
        }
    }

    public function updateRememberMeCredentials($identifier, $token) {
        $dbh = DatabaseConnection::getInstance();
        $sql = "UPDATE user SET remember_me_id = :remember_me_id, remember_me_token = :token WHERE id = :id";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':remember_me_id', $identifier, PDO::PARAM_STR);
        $stmt->bindParam(':token', $token, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        $stmt->execute();
    }



    public function removeRememberMeCredentials() {
        $dbh = DatabaseConnection::getInstance();
        $sql = "UPDATE user SET remember_me_id = :remember_me_id, remember_me_token = :token WHERE id = :id";
        $stmt = $dbh->prepare($sql);
        $stmt->bindValue(':remember_me_id', null, PDO::PARAM_INT);
        $stmt->bindValue(':token', null, PDO::PARAM_INT);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        $stmt->execute();

    }

    public static function existsWithCredentials($identifier) {

        $dbh = DatabaseConnection::getInstance();
        $stmt = $dbh->prepare('SELECT * FROM user WHERE remember_me_id = :remember_me_id LIMIT 1');
        $stmt->bindParam(':remember_me_id', $identifier, PDO::PARAM_STR);

        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            return new RegisteredUser($stmt->fetch());
        } else {
            return null;
        }
    }


    public function credentialsMatch($hashedToken)
    {

        $dbh = DatabaseConnection::getInstance();
        $stmt = $dbh->prepare('SELECT * FROM user WHERE id = :id LIMIT 1');
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            $result = $stmt->fetch();
            $token = $result["remember_me_token"];
            if(Hash::hashCheck($hashedToken, $token))
            {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    }

    public function avatarExists($type = null) {
        $type = isset($type) ? $type : Cfg::read('path.images.full');
        if ($this->id && $this->avatar_ext != "") {
            $path = Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . $type . "/" . "avatar" . $this->avatar_ext;
            if(file_exists($path)) {
                return $path;
            }
            else {
                return false;
            }
        }
        else return false;
    }

    public function getAvatarPath($type = null) {
        $type = isset($type) ? $type : Cfg::read('path.images.full');
        if ($path = $this->avatarExists($type)) {
            return $path;
        }
        else return null;
    }


    public function deleteAvatarDir()
    {
        if (file_exists(Cfg::read('path.user.avatar') . "/" . $this->id))
        {
            General::rrmdir(Cfg::read('path.user.avatar') . "/" . $this->id);
        }
        $this->avatar_ext = "";
    }


    public function checkAvatarDir()
    {

        if (!file_exists(Cfg::read('path.user.avatar') . "/" . $this->id))
        {
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id, 0777, true);
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . Cfg::read('path.images.full'));
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . Cfg::read('path.images.t1'));
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . Cfg::read('path.images.t2'));
        }
        if(!file_exists(Cfg::read('path.user.avatar') . "/" .
            $this->id . "/" . Cfg::read('path.images.full')))
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . Cfg::read('path.images.full'));
        if(!file_exists(Cfg::read('path.user.avatar') . "/" .
            $this->id . "/" . Cfg::read('path.images.t1')))
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . Cfg::read('path.images.t1'));
        if(!file_exists(Cfg::read('path.user.avatar') . "/" .
            $this->id . "/" . Cfg::read('path.images.t2')))
            mkdir(Cfg::read('path.user.avatar') . "/" . $this->id .
                "/" . Cfg::read('path.images.t2'));
    }

    public function updateExtension() {
        $dbh = DatabaseConnection::getInstance();
        $sql = "UPDATE user SET avatar_format_ext = :avatar_ext WHERE id = :id";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':avatar_ext', $this->avatar_ext, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        $stmt->execute();
    }

    public function updatePassword($hashed_pass) {
        $dbh = DatabaseConnection::getInstance();
        $sql = "UPDATE user SET password = :new_pass WHERE id = :id";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':new_pass', $hashed_pass, PDO::PARAM_STR);
        $stmt->bindParam(':id', $this->id, PDO::PARAM_INT);

        $stmt->execute();
    }

    public static function createNew($username, $email, $password, $first_name = null, $last_name = null, $sex = null) {
        $dbh = DatabaseConnection::getInstance();
        $sql = "INSERT INTO user (email, username, first_name, last_name, password, salt, sex, registered_at)
            VALUES (:email, :username, :first_name, :last_name, :password, :salt, :sex, :registered_at)";
        $stmt = $dbh->prepare($sql);
        $stmt->bindParam(':registered_at', date("Y-m-d H:i:s", time()), PDO::PARAM_STR);
        $stmt->bindParam(':sex', $sex, PDO::PARAM_STR);
        $stmt->bindParam(':first_name', $first_name, PDO::PARAM_STR);
        $stmt->bindParam(':last_name', $last_name, PDO::PARAM_STR);
        $stmt->bindParam(':email', $email, PDO::PARAM_STR);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $salt = Hash::getMSG()->generateString(128);
        $stmt->bindParam(':salt', $salt, PDO::PARAM_STR);
        $stmt->bindParam(':password', Hash::password($password . $salt), PDO::PARAM_STR);

        $stmt->execute();

        if ($stmt->rowCount() == 1) {
            return true;
        } else {
            return false;
        }

    }


    public function activePassResetRequestExists() {
        return UserPassReset::activePassResetRequestExistsForUser($this);
    }

    public function createNewPasswordReset() {
        return UserPassReset::createNew($this);
    }

    public static function getPassResetByUserHash($hash) {
        return UserPassReset::getByUserHash($hash);
    }

    public function deletePasswordResetRequest() {
        UserPassReset::deleteForUser($this);
    }


    public function ssbos($string1, $string2) {
        //Select string based on user's sex
        if ($this->sex === Cfg::read('db.sex.female')) {
            return $string1;
        }
        return $string2;
    }

}
?>