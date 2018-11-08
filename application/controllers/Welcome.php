<?php
defined('BASEPATH') OR exit('No direct script access allowed');
/*require_once('vendor/autoload.php');
use Kreait\Firebase\Factory;
use Kreait\Firebase\ServiceAccount;*/

require_once('vendor/autoload.php');
use \Firebase\JWT\JWT;

class Welcome extends CI_Controller {

	/**
	 * Index Page for this controller.
	 *
	 * Maps to the following URL
	 * 		http://example.com/index.php/welcome
	 *	- or -
	 * 		http://example.com/index.php/welcome/index
	 *	- or -
	 * Since this controller is set as the default controller in
	 * config/routes.php, it's displayed at http://example.com/
	 *
	 * So any other public methods not prefixed with an underscore will
	 * map to /index.php/welcome/<method_name>
	 * @see https://codeigniter.com/user_guide/general/urls.html
	 */
	function __construct()
	{
		parent::__construct();
		/*if(!isset($_SESSION)){
			session_start();
		}*/

		$this->load->library('session');
		/*$serviceAccount = ServiceAccount::fromJsonFile('google-service-account.json');
		$this->firebase = (new Factory)
			->withServiceAccount($serviceAccount)
			->withDatabaseUri('https://inatec-6d717.firebaseio.com')
			->create();
		$this->auth = $this->firebase->getAuth();*/
	}

	public function index()
	{
		$now_seconds = time();
					$auxtoken = array(
						"iss" => "http://www.learningenglish.tecnacional.edu.ni/",
						"aud" => "http://www.learningenglish.tecnacional.edu.ni/",
						"iat" => $now_seconds,
						"exp" => $now_seconds+86400,
						"claims" => array(
							'is_logued_in'  =>      TRUE,
						)
					);

					$jwt = JWT::encode($auxtoken,'jhjgjhgg');
					$data = array(
						'__token__'		=>		$jwt
					);

					$this->session->set_userdata($data);

		$this->load->view('index');
	}
}
