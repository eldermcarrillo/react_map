<?php
defined('BASEPATH') OR exit('No direct script access allowed');

require_once('vendor/autoload.php');
require APPPATH . '/libraries/REST_Controller.php';

use \Firebase\JWT\JWT;
use Restserver\Libraries\REST_Controller;

class Markers extends REST_Controller {

    function __construct()
    {
        // Construct the parent class
        parent::__construct();
        // Configure limits on our controller methods
        // Ensure you have created the 'limits' table and enabled 'limits' within application/config/rest.php
        $this->methods['index_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['find_get']['limit'] = 500; // 500 requests per hour per user/key
        $this->methods['index_post']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['index_put']['limit'] = 100; // 100 requests per hour per user/key
        $this->methods['index_delete']['limit'] = 100; // 100 requests per hour per user/key

        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('', '');
        $this->key = $this->config->item('encryption_key');
        $this->decode = "";
    }

    public function index_get()
    {
        try {
            $this->decode = JWT::decode((isset(apache_request_headers()['Authorization'])) ? apache_request_headers()['Authorization'] : '', 'jhjgjhgg', array('HS256'));
            if ($this->get('typeOption') == 'get_markers') {

                    $obj = $this->db->query("SELECT * FROM markers LIMIT ".$this->get('pageSize')."  OFFSET ".$this->get('pageSize')*$this->get('pages'));

                    $recordsTotal = $this->db->query("select COUNT(*) as count from markers");
                    $recordsTotal = (isset($recordsTotal->result()[0]->count)) ? $recordsTotal->result()[0]->count : 0 ;

                    $this->response(array('data' => $obj->result(), 'pages' =>$recordsTotal), REST_Controller::HTTP_OK);
            }else{
                if ($this->get('typeOption') == 'get_polygons') {

                    $obj = $this->db->query("SELECT p.name,ps.lat,ps.lng FROM  polygons p inner join points ps on ps.id_polygons = p.id");
                
                    $this->response(array('data' => $obj->result()), REST_Controller::HTTP_OK);
                }else{
                    $this->response('', REST_Controller::HTTP_NO_CONTENT);
                }
            }
        } catch (Firebase\JWT\SignatureInvalidException $e){
            $this->response(array('errors' => ['message' => 'UNAUTHORIZED Signature Invalid']), REST_Controller::HTTP_UNAUTHORIZED);
        } catch (Firebase\JWT\ExpiredException $e){
            $this->response(array('errors' => ['message' => 'UNAUTHORIZED Signature Expired']), REST_Controller::HTTP_UNAUTHORIZED);
        } catch (UnexpectedValueException $e){
            $this->response(array('errors' => ['message' => 'UNAUTHORIZED Unexpected Value']), REST_Controller::HTTP_UNAUTHORIZED);
        }
    }

    public function find_get($id)
    {
        $this->response(array(), REST_Controller::HTTP_NO_CONTENT);
    }

    public function index_post()
    {
        try {
            $this->decode = JWT::decode((isset(apache_request_headers()['Authorization'])) ? apache_request_headers()['Authorization'] : '', 'jhjgjhgg', array('HS256'));

            if ($this->post('typeOption') == 'new_marker') {
                    $this->form_validation->set_data($this->post());
                    $rules = array(
                        array(
                            'field'   => 'marker',
                            'label'   => 'Marker',
                            'rules'   => 'required'
                        ),
                        array(
                            'field'   => 'lat',
                            'label'   => 'Latitud',
                            'rules'   => 'required'
                        ),
                        array(
                            'field'   => 'lng',
                            'label'   => 'Longitud',
                            'rules'   => 'required'
                        )
                    );
                    $this->form_validation->set_rules($rules);
                    $errors_array = array();

                    if ($this->form_validation->run() == FALSE)
                    {
                        foreach($rules as $row){
                            $field = $row['field'];
                            $error = form_error($field);
                            if($error){
                                $errors_array[$field] = $error;
                            }
                        }

                        $this->response(array('errors' => $errors_array), REST_Controller::HTTP_UNPROCESSABLE_ENTITY);
                    }
                    else
                    {
                        $data = array(
                           'name' => $this->post('marker'),
                           'lat' => $this->post('lat'),
                           'lng' => $this->post('lng'),
                        );

                        $this->db->insert('markers', $data);

                        $this->response(array('data' => ['message' => 'Markador almacenado satifactoriamente.']), REST_Controller::HTTP_CREATED);
                    }
            }else{
                if ($this->post('typeOption') == 'new_polygon') {
                    $this->form_validation->set_data($this->post());
                    $rules = array(
                        array(
                            'field'   => 'namep',
                            'label'   => 'namep',
                            'rules'   => 'required'
                        ),
                    );
                    $this->form_validation->set_rules($rules);
                    $errors_array = array();

                    if ($this->form_validation->run() == FALSE)
                    {
                        foreach($rules as $row){
                            $field = $row['field'];
                            $error = form_error($field);
                            if($error){
                                $errors_array[$field] = $error;
                            }
                        }

                        $this->response(array('errors' => $errors_array), REST_Controller::HTTP_UNPROCESSABLE_ENTITY);
                    }
                    else
                    {
                        $data = array(
                           'name' => $this->post('namep'),
                        );

                        $this->db->insert('polygons', $data);
                        $insert_id = $this->db->insert_id();

                        

                        $this->response(array('data' => ['message' => 'Markador almacenado satifactoriamente.']), REST_Controller::HTTP_CREATED);
                    }
            }else{
                $this->response('', REST_Controller::HTTP_NO_CONTENT);
            }
            }

        } catch (Firebase\JWT\SignatureInvalidException $e){
            $this->response(array('errors' => ['message' => 'UNAUTHORIZED Signature Invalid']), REST_Controller::HTTP_UNAUTHORIZED);
        } catch (Firebase\JWT\ExpiredException $e){
            $this->response(array('errors' => ['message' => 'UNAUTHORIZED Signature Expired']), REST_Controller::HTTP_UNAUTHORIZED);
        } catch (UnexpectedValueException $e){
            $this->response(array('errors' => ['message' => 'UNAUTHORIZED Unexpected Value']), REST_Controller::HTTP_UNAUTHORIZED);
        }
    }
}
